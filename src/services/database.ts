import { supabase } from '@/integrations/supabase/client';
import { 
  Expense, 
  PendingCustomer, 
  Payment, 
  CompletedCustomer, 
  Employee, 
  Coverage, 
  Account,
  CapitalEntry
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
  productDifference: row.product_difference,
  netProfit: row.net_profit
});

// Helper function to transform database row to Coverage
const transformCoverage = (row: any): Coverage => ({
  id: row.id,
  amount: row.amount,
  receivedFrom: row.received_from,
  receivedBy: row.received_by,
  remaining: row.remaining
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
    product_difference: customer.productDifference,
    net_profit: customer.netProfit,
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
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .insert(employee)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Coverages
export const getCoverages = async (): Promise<Coverage[]> => {
  const { data, error } = await supabase
    .from('coverages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data?.map(transformCoverage) || [];
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
  return transformCoverage(data);
};

export const deleteCoverage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('coverages')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
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
    .from('capital_entries' as any)
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addCapitalEntry = async (entry: Omit<CapitalEntry, 'id'>): Promise<CapitalEntry> => {
  const { data, error } = await supabase
    .from('capital_entries' as any)
    .insert(entry)
    .select()
    .single();
  
  if (error) throw error;

  // تحديث حساب البنك الرئيسي تلقائياً
  await updateBankAccountForCapitalEntry(entry);
  
  return data;
};

export const deleteCapitalEntry = async (id: string): Promise<void> => {
  // الحصول على بيانات الحركة قبل حذفها لعكس تأثيرها على حساب البنك
  const { data: entry, error: fetchError } = await supabase
    .from('capital_entries' as any)
    .select('*')
    .eq('id', id)
    .single();
  
  if (fetchError) throw fetchError;
  
  const { error } = await supabase
    .from('capital_entries' as any)
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
