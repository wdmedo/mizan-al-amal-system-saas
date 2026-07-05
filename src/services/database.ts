import { createOrgQuery, orgInsert } from '@/services/tenant';
import { 
  Employee, 
  Coverage, 
  Expense, 
  EmployeeTransaction,
  CoverageTransaction,
  PendingCustomer,
  CompletedCustomer,
  Account,
  CapitalEntry
} from '@/types/accounting';

export const saveExpense = async (expense: Omit<Expense, 'id'>) => {
  const { data, error } = await orgInsert('expenses', [{
    description: expense.description,
    amount: expense.amount,
    date: expense.date
  }])
    .select()
    .single();

  if (error) throw error;

  // تحديث رصيد البنك الرئيسي (خصم المصروف)
  await updateBankBalance(-expense.amount, 'مصروف: ' + expense.description);

  return data;
};

export const getExpenses = async (): Promise<Expense[]> => {
  const org = await createOrgQuery<Expense>('expenses');
  const { data, error } = await org
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(item => ({
    id: item.id,
    date: item.date,
    amount: item.amount,
    description: item.description
  }));
};

export const getPendingCustomers = async (): Promise<PendingCustomer[]> => {
  const org = await createOrgQuery<PendingCustomer>('pending_customers');
  const { data, error } = await org
    .select(`
      *,
      payments (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(customer => ({
    id: customer.id,
    name: customer.name,
    idNumber: customer.id_number,
    phoneNumber: customer.phone_number,
    payments: customer.payments?.map((payment: { id: string; amount: number; source: string }) => ({
      id: payment.id,
      amount: payment.amount,
      source: payment.source
    })) || []
  }));
};

export const getCompletedCustomers = async (): Promise<CompletedCustomer[]> => {
  const org = await createOrgQuery<CompletedCustomer>('completed_customers');
  const { data, error } = await org
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(customer => ({
    id: customer.id,
    name: customer.name,
    idNumber: customer.id_number,
    phoneNumber: customer.phone_number,
    amount: customer.amount,
    fixedInterest: customer.fixed_interest,
    brokerInterest: customer.broker_percentage,
    productDifference: customer.product_difference,
    netProfit: customer.net_profit
  }));
};

export const saveEmployee = async (employee: Omit<Employee, 'id'>) => {
  const { data, error } = await orgInsert('employees', [{
      name: employee.name,
      salary: employee.salary,
      advances: employee.advances || 0
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getEmployees = async (): Promise<Employee[]> => {
  const org = await createOrgQuery<Employee>('employees');
  const { data, error } = await org
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(employee => ({
    id: employee.id,
    name: employee.name,
    salary: employee.salary,
    advances: employee.advances || 0
  }));
};

export const saveCoverage = async (coverage: Omit<Coverage, 'id'>) => {
  const { data, error } = await orgInsert('coverages', [{
      amount: coverage.amount,
      received_from: coverage.receivedFrom,
      received_by: coverage.receivedBy,
      remaining: coverage.remaining
    }])
    .select()
    .single();

  if (error) throw error;

  // تحديث رصيد البنك الرئيسي (خصم مبلغ التغطية)
  await updateBankBalance(-coverage.amount, 'تغطية من: ' + coverage.receivedFrom);

  return data;
};

export const getCoverages = async (): Promise<Coverage[]> => {
  const org = await createOrgQuery<Coverage>('coverages');
  const { data, error } = await org
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(coverage => ({
    id: coverage.id,
    amount: coverage.amount,
    receivedFrom: coverage.received_from,
    receivedBy: coverage.received_by,
    remaining: coverage.remaining
  }));
};

// دالة مساعدة لتحديث رصيد البنك الرئيسي
const updateBankBalance = async (amount: number, description: string) => {
  // البحث عن حساب البنك الرئيسي أو إنشاؤه إذا لم يكن موجوداً
  const org = await createOrgQuery<Account>('accounts');
  const { data: bankAccount, error: getBankError } = await org
    .select('*')
    .eq('name', 'حساب البنك الرئيسي')
    .single();

  if (getBankError && getBankError.code !== 'PGRST116') {
    throw getBankError;
  }

  if (!bankAccount) {
    // إنشاء حساب البنك الرئيسي إذا لم يكن موجوداً
    const { data: newAccount, error: createError } = await orgInsert('accounts', [{
      name: 'حساب البنك الرئيسي',
      balance: amount
    }])
      .select()
      .single();

    if (createError) throw createError;
    return newAccount;
  } else {
    // تحديث الرصيد الحالي
    const newBalance = bankAccount.balance + amount;
const { error: updateError } = await org
      .update({ balance: newBalance })
      .eq('id', bankAccount.id);

    if (updateError) throw updateError;
    
    console.log(`تم تحديث رصيد البنك: ${amount} - ${description}`);
    return { ...bankAccount, balance: newBalance };
  }
};

export const saveEmployeeTransaction = async (transaction: Omit<EmployeeTransaction, 'id'>) => {
  // Start a transaction to ensure data consistency
  const { data: transactionData, error: transactionError } = await orgInsert('employee_transactions', [{
      employee_id: transaction.employeeId,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      date: transaction.date
    }])
    .select()
    .single();

  if (transactionError) throw transactionError;

  // Get current employee data
  const employeeOrg = await createOrgQuery<Employee>('employees');
  const { data: employee, error: employeeError } = await employeeOrg
    .select('*')
    .eq('id', transaction.employeeId)
    .single();

  if (employeeError) throw employeeError;

  // Calculate new advances based on transaction type
  let newAdvances = employee.advances;
  let bankBalanceChange = 0;
  
  if (transaction.type === 'advance') {
    // Add to advances
    newAdvances = employee.advances + transaction.amount;
    // خصم من رصيد البنك (إعطاء سلفة)
    bankBalanceChange = -transaction.amount;
  } else if (transaction.type === 'salary_payment') {
    // Subtract from advances (payment reduces the advance)
    newAdvances = Math.max(0, employee.advances - transaction.amount);
    // خصم من رصيد البنك (دفع راتب)
    bankBalanceChange = -transaction.amount;
  } else if (transaction.type === 'deduction') {
    // Add to advances (deduction increases what employee owes)
    newAdvances = employee.advances + transaction.amount;
    // إضافة إلى رصيد البنك (خصم من الموظف)
    bankBalanceChange = transaction.amount;
  } else if (transaction.type === 'bonus') {
    // Subtract from advances (bonus reduces what employee owes)
    newAdvances = Math.max(0, employee.advances - transaction.amount);
    // خصم من رصيد البنك (دفع مكافأة)
    bankBalanceChange = -transaction.amount;
  }

  // Update employee advances
  const employeesOrg = await createOrgQuery<Employee>('employees');
  const { error: updateError } = await employeesOrg
    .update({ advances: newAdvances })
    .eq('id', transaction.employeeId);

  if (updateError) throw updateError;

  // تحديث رصيد البنك
  if (bankBalanceChange !== 0) {
    await updateBankBalance(bankBalanceChange, `معاملة ${employee.name}: ${transaction.description}`);
  }

  return transactionData;
};

export const getEmployeeTransactions = async (): Promise<EmployeeTransaction[]> => {
  const org = await createOrgQuery<EmployeeTransaction>('employee_transactions');
  const { data, error } = await org
    .select(`
      *,
      employees (
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(transaction => ({
    id: transaction.id,
    employeeId: transaction.employee_id,
    amount: transaction.amount,
    type: transaction.type as "advance" | "salary_payment" | "deduction" | "bonus",
    description: transaction.description,
    date: transaction.date
  }));
};

export const saveCoverageTransaction = async (transaction: Omit<CoverageTransaction, 'id'>) => {
  // Start a transaction to ensure data consistency
  const { data: transactionData, error: transactionError } = await orgInsert('coverage_transactions', [{
      coverage_id: transaction.coverageId,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      date: transaction.date
    }])
    .select()
    .single();

  if (transactionError) throw transactionError;

  // Get current coverage data
  const coverageOrg = await createOrgQuery<Coverage>('coverages');
  const { data: coverage, error: coverageError } = await coverageOrg
    .select('*')
    .eq('id', transaction.coverageId)
    .single();

  if (coverageError) throw coverageError;

  // Calculate new remaining amount based on transaction type
  let newRemaining = coverage.remaining;
  let bankBalanceChange = 0;
  
  if (transaction.type === 'payment') {
    // Subtract from remaining (payment reduces what's left)
    newRemaining = Math.max(0, coverage.remaining - transaction.amount);
    // إضافة إلى رصيد البنك (دفعة من التغطية)
    bankBalanceChange = transaction.amount;
  } else if (transaction.type === 'adjustment') {
    // Can increase or decrease remaining based on adjustment
    // For positive adjustments, add to remaining
    // For negative adjustments, subtract from remaining
    newRemaining = Math.max(0, coverage.remaining + transaction.amount);
    // تأثير على رصيد البنك حسب نوع التسوية
    bankBalanceChange = -transaction.amount;
  } else if (transaction.type === 'refund') {
    // Add to remaining (refund increases what's left)
    newRemaining = coverage.remaining + transaction.amount;
    // خصم من رصيد البنك (رد مبلغ)
    bankBalanceChange = -transaction.amount;
  }

  // Update coverage remaining amount
  const { error: updateError } = await coverageOrg
    .update({ remaining: newRemaining })
    .eq('id', transaction.coverageId);

  if (updateError) throw updateError;

  // تحديث رصيد البنك
  if (bankBalanceChange !== 0) {
    await updateBankBalance(bankBalanceChange, `معاملة تغطية من ${coverage.received_from}: ${transaction.description}`);
  }

  return transactionData;
};

export const getCoverageTransactions = async (): Promise<CoverageTransaction[]> => {
  const org = await createOrgQuery<CoverageTransaction>('coverage_transactions');
  const { data, error } = await org
    .select(`
      *,
      coverages (
        received_from
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(transaction => ({
    id: transaction.id,
    coverageId: transaction.coverage_id,
    amount: transaction.amount,
    type: transaction.type as "payment" | "adjustment" | "refund",
    description: transaction.description,
    date: transaction.date
  }));
};

export const getAccounts = async (): Promise<Account[]> => {
  const org = await createOrgQuery<Account>('accounts');
  const { data, error } = await org
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(account => ({
    id: account.id,
    name: account.name,
    balance: account.balance
  }));
};

export const getCapitalEntries = async (): Promise<CapitalEntry[]> => {
  const org = await createOrgQuery<CapitalEntry>('capital_entries');
  const { data, error } = await org
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(entry => ({
    id: entry.id,
    date: entry.date,
    amount: entry.amount,
    type: entry.type as 'increase' | 'decrease',
    description: entry.description
  }));
};

// CRUD operations
export const deleteExpense = async (id: string) => {
  // الحصول على بيانات المصروف قبل الحذف
  const org = await createOrgQuery<Expense>('expenses');
  const { data: expense, error: getError } = await org
    .select('*')
    .eq('id', id)
    .single();

  if (getError) throw getError;

  // حذف المصروف
  const { error } = await org
    .delete()
    .eq('id', id);

  if (error) throw error;

  // إعادة المبلغ إلى رصيد البنك (عكس الخصم)
  await updateBankBalance(expense.amount, 'إلغاء مصروف: ' + expense.description);
};

export const addPendingCustomer = async (customer: Omit<PendingCustomer, 'id' | 'payments'>) => {
  const { data, error } = await orgInsert('pending_customers', [{
      name: customer.name,
      id_number: customer.idNumber,
      phone_number: customer.phoneNumber
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePendingCustomer = async (id: string) => {
  const org = await createOrgQuery<PendingCustomer>('pending_customers');
  const { error } = await org
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addPayment = async (payment: { customerId: string; amount: number; source: string }) => {
  const { data, error } = await orgInsert('payments', [{
      customer_id: payment.customerId,
      amount: payment.amount,
      source: payment.source
    }])
    .select()
    .single();

  if (error) throw error;

  // إضافة الدفعة إلى رصيد البنك
  await updateBankBalance(payment.amount, `دفعة من عميل معلق - ${payment.source}`);

  return data;
};

export const deletePayment = async (id: string) => {
  // الحصول على بيانات الدفعة قبل الحذف
  const paymentsOrg = await createOrgQuery<{ id: string; amount: number; source: string }>('payments');
  const { data: payment, error: getError } = await paymentsOrg
    .select('*')
    .eq('id', id)
    .single();

  if (getError) throw getError;

  // حذف الدفعة
  const { error } = await paymentsOrg
    .delete()
    .eq('id', id);

  if (error) throw error;

  // خصم المبلغ من رصيد البنك (عكس الإضافة)
  await updateBankBalance(-payment.amount, `إلغاء دفعة - ${payment.source}`);
};

export const addCompletedCustomer = async (customer: Omit<CompletedCustomer, 'id'>) => {
  const { data, error } = await orgInsert('completed_customers', [{
      name: customer.name,
      id_number: customer.idNumber,
      phone_number: customer.phoneNumber,
      amount: customer.amount,
      fixed_interest: customer.fixedInterest,
      broker_percentage: customer.brokerInterest,
      product_difference: customer.productDifference,
      net_profit: customer.netProfit,
      total_payment: customer.amount + customer.fixedInterest
    }])
    .select()
    .single();

  if (error) throw error;

  // إضافة إجمالي المبلغ المستلم إلى رصيد البنك
  const totalReceived = customer.amount + customer.fixedInterest;
  await updateBankBalance(totalReceived, `عميل خالص: ${customer.name}`);

  return data;
};

export const deleteCompletedCustomer = async (id: string) => {
  // الحصول على بيانات العميل قبل الحذف
  const completedOrg = await createOrgQuery<CompletedCustomer>('completed_customers');
  const { data: customer, error: getError } = await completedOrg
    .select('*')
    .eq('id', id)
    .single();

  if (getError) throw getError;

  // حذف العميل
  const { error } = await completedOrg
    .delete()
    .eq('id', id);

  if (error) throw error;

  // خصم المبلغ من رصيد البنك (عكس الإضافة)
  const totalReceived = customer.amount + customer.fixed_interest;
  await updateBankBalance(-totalReceived, `إلغاء عميل خالص: ${customer.name}`);
};

export const addEmployee = async (employee: Omit<Employee, 'id'>) => {
  return await saveEmployee(employee);
};

export const deleteEmployee = async (id: string) => {
  const employeesOrg = await createOrgQuery<Employee>('employees');
  const { error } = await employeesOrg
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addEmployeeTransaction = async (transaction: Omit<EmployeeTransaction, 'id'>) => {
  return await saveEmployeeTransaction(transaction);
};

export const deleteEmployeeTransaction = async (id: string) => {
  // Get the transaction details before deleting
  const employeeTransactionsOrg = await createOrgQuery<EmployeeTransaction>('employee_transactions');
  const { data: transaction, error: getError } = await employeeTransactionsOrg
    .select('*')
    .eq('id', id)
    .single();

  if (getError) throw getError;

  // Get current employee data
  const employeeOrg2 = await createOrgQuery<Employee>('employees');
  const { data: employee, error: employeeError } = await employeeOrg2
    .select('*')
    .eq('id', transaction.employee_id)
    .single();

  if (employeeError) throw employeeError;

  // Reverse the transaction effect on advances
  let newAdvances = employee.advances;
  let bankBalanceChange = 0;
  
  if (transaction.type === 'advance') {
    // Remove from advances
    newAdvances = Math.max(0, employee.advances - transaction.amount);
    // إعادة المبلغ إلى رصيد البنك
    bankBalanceChange = transaction.amount;
  } else if (transaction.type === 'salary_payment') {
    // Add back to advances
    newAdvances = employee.advances + transaction.amount;
    // إعادة المبلغ إلى رصيد البنك
    bankBalanceChange = transaction.amount;
  } else if (transaction.type === 'deduction') {
    // Remove from advances
    newAdvances = Math.max(0, employee.advances - transaction.amount);
    // خصم من رصيد البنك
    bankBalanceChange = -transaction.amount;
  } else if (transaction.type === 'bonus') {
    // Add back to advances
    newAdvances = employee.advances + transaction.amount;
    // إعادة المبلغ إلى رصيد البنك
    bankBalanceChange = transaction.amount;
  }

  // Update employee advances
  const { error: updateError } = await employeeOrg2
    .update({ advances: newAdvances })
    .eq('id', transaction.employee_id);

  if (updateError) throw updateError;

  // تحديث رصيد البنك
  if (bankBalanceChange !== 0) {
    await updateBankBalance(bankBalanceChange, `إلغاء معاملة ${employee.name}: ${transaction.description}`);
  }

  // Delete the transaction
  const { error } = await employeeTransactionsOrg
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addCoverage = async (coverage: Omit<Coverage, 'id'>) => {
  return await saveCoverage(coverage);
};

export const deleteCoverage = async (id: string) => {
  // الحصول على بيانات التغطية قبل الحذف
  const coveragesOrg3 = await createOrgQuery<Coverage>('coverages');
  const { data: coverage, error: getError } = await coveragesOrg3
    .select('*')
    .eq('id', id)
    .single();

  if (getError) throw getError;

  // حذف التغطية
  const { error } = await coveragesOrg3
    .delete()
    .eq('id', id);

  if (error) throw error;

  // إعادة المبلغ إلى رصيد البنك (عكس الخصم)
  await updateBankBalance(coverage.amount, `إلغاء تغطية من: ${coverage.received_from}`);
};

export const addCoverageTransaction = async (transaction: Omit<CoverageTransaction, 'id'>) => {
  return await saveCoverageTransaction(transaction);
};

export const deleteCoverageTransaction = async (id: string) => {
  // Get the transaction details before deleting
  const coverageTransactionsOrg = await createOrgQuery<CoverageTransaction>('coverage_transactions');
  const { data: transaction, error: getError } = await coverageTransactionsOrg
    .select('*')
    .eq('id', id)
    .single();

  if (getError) throw getError;

  // Get current coverage data
  const coverageOrg2 = await createOrgQuery<Coverage>('coverages');
  const { data: coverage, error: coverageError } = await coverageOrg2
    .select('*')
    .eq('id', transaction.coverage_id)
    .single();

  if (coverageError) throw coverageError;

  // Reverse the transaction effect on remaining amount
  let newRemaining = coverage.remaining;
  let bankBalanceChange = 0;
  
  if (transaction.type === 'payment') {
    // Add back to remaining
    newRemaining = coverage.remaining + transaction.amount;
    // خصم من رصيد البنك
    bankBalanceChange = -transaction.amount;
  } else if (transaction.type === 'adjustment') {
    // Reverse the adjustment
    newRemaining = Math.max(0, coverage.remaining - transaction.amount);
    // عكس التأثير على رصيد البنك
    bankBalanceChange = transaction.amount;
  } else if (transaction.type === 'refund') {
    // Remove from remaining
    newRemaining = Math.max(0, coverage.remaining - transaction.amount);
    // إعادة المبلغ إلى رصيد البنك
    bankBalanceChange = transaction.amount;
  }

  // Update coverage remaining amount
  const { error: updateError } = await coverageOrg2
    .update({ remaining: newRemaining })
    .eq('id', transaction.coverage_id);

  if (updateError) throw updateError;

  // تحديث رصيد البنك
  if (bankBalanceChange !== 0) {
    await updateBankBalance(bankBalanceChange, `إلغاء معاملة تغطية من ${coverage.received_from}: ${transaction.description}`);
  }

  // Delete the transaction
  const { error } = await coverageTransactionsOrg
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addAccount = async (account: Omit<Account, 'id'>) => {
  const { data, error } = await orgInsert('accounts', [{
      name: account.name,
      balance: account.balance
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteAccount = async (id: string) => {
  const org = await createOrgQuery<Account>('accounts');
  const { error } = await org
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addCapitalEntry = async (entry: Omit<CapitalEntry, 'id'>) => {
  const { data, error } = await orgInsert('capital_entries', [{
      date: entry.date,
      amount: entry.amount,
      type: entry.type,
      description: entry.description
    }])
    .select()
    .single();

  if (error) throw error;

  // تحديث رصيد البنك الرئيسي حسب نوع الحركة
  const bankBalanceChange = entry.type === 'increase' ? entry.amount : -entry.amount;
  await updateBankBalance(bankBalanceChange, `حركة رأس المال: ${entry.description}`);

  return data;
};

export const deleteCapitalEntry = async (id: string) => {
  // الحصول على بيانات الحركة قبل الحذف
  const capitalOrg = await createOrgQuery<CapitalEntry>('capital_entries');
  const { data: entry, error: getError } = await capitalOrg
    .select('*')
    .eq('id', id)
    .single();

  if (getError) throw getError;

  // حذف الحركة
  const { error } = await capitalOrg
    .delete()
    .eq('id', id);

  if (error) throw error;

  // عكس التأثير على رصيد البنك
  const bankBalanceChange = entry.type === 'increase' ? -entry.amount : entry.amount;
  await updateBankBalance(bankBalanceChange, `إلغاء حركة رأس المال: ${entry.description}`);
};

export const addExpense = async (expense: Omit<Expense, 'id'>) => {
  return await saveExpense(expense);
};
