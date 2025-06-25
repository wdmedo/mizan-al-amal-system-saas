import { supabase } from '@/integrations/supabase/client';
import { 
  Expense, 
  PendingCustomer, 
  Payment, 
  CompletedCustomer, 
  Employee, 
  Coverage, 
  Account,
  CapitalEntry,
  EmployeeTransaction,
  CoverageTransaction,
  ProductDifference
} from '@/types/accounting';

// Helper function to transform database row to PendingCustomer
const transformPendingCustomer = (row: any): PendingCustomer => ({
  id: row.id,
  name: row.name,
  idNumber: row.id_number,
  phoneNumber: row.phone_number,
  payments: row.payments?.map((payment: any) => ({
    id: payment.id,
    amount: payment.amount,
    source: payment.source
  })) || []
});

// Helper function to transform database row to CompletedCustomer
const transformCompletedCustomer = (row: any): CompletedCustomer => ({
  id: row.id,
  name: row.name,
  idNumber: row.id_number,
  phoneNumber: row.phone_number,
  amount: row.amount,
  fixedInterest: row.fixed_interest,
  brokerInterest: row.broker_percentage,
  netProfit: row.net_profit
});

// Helper function to transform database row to Employee
const transformEmployee = (row: any): Employee => ({
  id: row.id,
  name: row.name,
  salary: row.salary,
  advances: row.advances,
  transactions: row.employee_transactions?.map((transaction: any) => ({
    id: transaction.id,
    amount: transaction.amount,
    type: transaction.type,
    description: transaction.description,
    date: transaction.date
  })) || []
});

// Helper function to transform database row to Coverage
const transformCoverage = (row: any): Coverage => ({
  id: row.id,
  amount: row.amount,
  receivedFrom: row.received_from,
  receivedBy: row.received_by,
  remaining: row.remaining,
  transactions: row.coverage_transactions?.map((transaction: any) => ({
    id: transaction.id,
    amount: transaction.amount,
    type: transaction.type,
    description: transaction.description,
    date: transaction.date
  })) || []
});

// Expenses
export const getExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expense)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Pending Customers
export const getPendingCustomers = async (): Promise<PendingCustomer[]> => {
  const { data: customers, error } = await supabase
    .from('pending_customers')
    .select(`
      *,
      payments (*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return customers?.map(transformPendingCustomer) || [];
};

export const addPendingCustomer = async (customer: Omit<PendingCustomer, 'id' | 'payments'>): Promise<PendingCustomer> => {
  const dbCustomer = {
    name: customer.name,
    id_number: customer.idNumber,
    phone_number: customer.phoneNumber
  };

  const { data, error } = await supabase
    .from('pending_customers')
    .insert(dbCustomer)
    .select()
    .single();
  
  if (error) throw error;
  return transformPendingCustomer({ ...data, payments: [] });
};

export const deletePendingCustomer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('pending_customers')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Payments
export const addPayment = async (payment: Omit<Payment, 'id'> & { customerId: string }): Promise<Payment> => {
  const dbPayment = {
    amount: payment.amount,
    source: payment.source,
    customer_id: payment.customerId
  };

  const { data, error } = await supabase
    .from('payments')
    .insert(dbPayment)
    .select()
    .single();
  
  if (error) throw error;
  return {
    id: data.id,
    amount: data.amount,
    source: data.source
  };
};

export const deletePayment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Completed Customers
export const getCompletedCustomers = async (): Promise<CompletedCustomer[]> => {
  const { data, error } = await supabase
    .from('completed_customers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data?.map(transformCompletedCustomer) || [];
};

export const addCompletedCustomer = async (customer: Omit<CompletedCustomer, 'id'>): Promise<CompletedCustomer> => {
  const dbCustomer = {
    name: customer.name,
    id_number: customer.idNumber,
    phone_number: customer.phoneNumber,
    amount: customer.amount,
    fixed_interest: customer.fixedInterest,
    broker_percentage: customer.brokerInterest,
    net_profit: customer.netProfit,
    product_difference: 0, // Default value for existing database schema
    total_payment: customer.amount + customer.fixedInterest
  };

  const { data, error } = await supabase
    .from('completed_customers')
    .insert(dbCustomer)
    .select()
    .single();
  
  if (error) throw error;
  return transformCompletedCustomer(data);
};

export const deleteCompletedCustomer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('completed_customers')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Employees
export const getEmployees = async (): Promise<Employee[]> => {
  const { data: employees, error } = await supabase
    .from('employees')
    .select(`
      *,
      employee_transactions (*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return employees?.map(employee => transformEmployee(employee)) || [];
};

export const addEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .insert({
      name: employee.name,
      salary: employee.salary,
      advances: employee.advances
    })
    .select()
    .single();
  
  if (error) throw error;
  return {
    ...data,
    transactions: []
  };
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Employee Transactions
export const addEmployeeTransaction = async (transaction: Omit<EmployeeTransaction, 'id'> & { employeeId: string }): Promise<EmployeeTransaction> => {
  const dbTransaction = {
    employee_id: transaction.employeeId,
    amount: transaction.amount,
    type: transaction.type,
    description: transaction.description,
    date: transaction.date
  };

  const { data, error } = await supabase
    .from('employee_transactions')
    .insert(dbTransaction)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    amount: data.amount,
    type: data.type as 'advance' | 'payment',
    description: data.description,
    date: data.date
  };
};

export const deleteEmployeeTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('employee_transactions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Coverage Transactions
export const addCoverageTransaction = async (transaction: Omit<CoverageTransaction, 'id'> & { coverageId: string }): Promise<CoverageTransaction> => {
  const dbTransaction = {
    coverage_id: transaction.coverageId,
    amount: transaction.amount,
    type: transaction.type,
    description: transaction.description,
    date: transaction.date
  };

  const { data, error } = await supabase
    .from('coverage_transactions')
    .insert(dbTransaction)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    amount: data.amount,
    type: data.type as 'payment' | 'refund',
    description: data.description,
    date: data.date
  };
};

export const deleteCoverageTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('coverage_transactions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Coverages
export const getCoverages = async (): Promise<Coverage[]> => {
  const { data: coverages, error } = await supabase
    .from('coverages')
    .select(`
      *,
      coverage_transactions (*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return coverages?.map(coverage => transformCoverage(coverage)) || [];
};

export const addCoverage = async (coverage: Omit<Coverage, 'id'>): Promise<Coverage> => {
  const dbCoverage = {
    amount: coverage.amount,
    received_from: coverage.receivedFrom,
    received_by: coverage.receivedBy,
    remaining: coverage.remaining
  };

  const { data, error } = await supabase
    .from('coverages')
    .insert(dbCoverage)
    .select()
    .single();
  
  if (error) throw error;
  return transformCoverage({
    ...data,
    coverage_transactions: []
  });
};

export const deleteCoverage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('coverages')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Product Differences - Remove these functions
export const getProductDifferences = async (): Promise<ProductDifference[]> => {
  return [];
};

export const addProductDifference = async (productDifference: Omit<ProductDifference, 'id'>): Promise<ProductDifference> => {
  throw new Error('Product differences feature has been removed');
};

export const deleteProductDifference = async (id: string): Promise<void> => {
  throw new Error('Product differences feature has been removed');
};

// Accounts
export const getAccounts = async (): Promise<Account[]> => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addAccount = async (account: Omit<Account, 'id'>): Promise<Account> => {
  const { data, error } = await supabase
    .from('accounts')
    .insert(account)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteAccount = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Capital Entries
export const getCapitalEntries = async (): Promise<CapitalEntry[]> => {
  const { data, error } = await supabase
    .from('capital_entries')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data?.map(entry => ({
    ...entry,
    type: entry.type as 'increase' | 'decrease'
  })) || [];
};

export const addCapitalEntry = async (entry: Omit<CapitalEntry, 'id'>): Promise<CapitalEntry> => {
  const { data, error } = await supabase
    .from('capital_entries')
    .insert(entry)
    .select()
    .single();
  
  if (error) throw error;

  // تحديث حساب البنك الرئيسي تلقائياً
  await updateBankAccountForCapitalEntry(entry);
  
  return {
    ...data,
    type: data.type as 'increase' | 'decrease'
  };
};

export const deleteCapitalEntry = async (id: string): Promise<void> => {
  // الحصول على بيانات الحركة قبل حذفها لعكس تأثيرها على حساب البنك
  const { data: entry, error: fetchError } = await supabase
    .from('capital_entries')
    .select('*')
    .eq('id', id)
    .single();
  
  if (fetchError) throw fetchError;
  
  const { error } = await supabase
    .from('capital_entries')
    .delete()
    .eq('id', id);
  
  if (error) throw error;

  // عكس تأثير الحركة على حساب البنك
  if (entry) {
    await updateBankAccountForCapitalEntry({
      date: entry.date,
      amount: entry.amount,
      type: entry.type === 'increase' ? 'decrease' : 'increase',
      description: entry.description
    });
  }
};

// تحديث حساب البنك عند إضافة حركة رأس مال
const updateBankAccountForCapitalEntry = async (entry: Omit<CapitalEntry, 'id'>) => {
  // البحث عن حساب البنك الرئيسي أو إنشاؤه
  let { data: bankAccount, error: fetchError } = await supabase
    .from('accounts')
    .select('*')
    .eq('name', 'حساب البنك الرئيسي')
    .single();
  
  if (fetchError && fetchError.code === 'PGRST116') {
    // إنشاء حساب البنك الرئيسي إذا لم يكن موجوداً
    const { data: newAccount, error: createError } = await supabase
      .from('accounts')
      .insert({ name: 'حساب البنك الرئيسي', balance: 0 })
      .select()
      .single();
    
    if (createError) throw createError;
    bankAccount = newAccount;
  } else if (fetchError) {
    throw fetchError;
  }

  // تحديث رصيد حساب البنك
  const balanceChange = entry.type === 'increase' ? entry.amount : -entry.amount;
  const newBalance = bankAccount.balance + balanceChange;

  const { error: updateError } = await supabase
    .from('accounts')
    .update({ balance: newBalance })
    .eq('id', bankAccount.id);

  if (updateError) throw updateError;
};
