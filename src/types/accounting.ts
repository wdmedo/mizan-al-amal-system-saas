
export interface Expense {
  id: string;
  date: string;
  amount: number;
  description: string;
}

export interface PendingCustomer {
  id: string;
  name: string;
  idNumber: string;
  phoneNumber: string;
  payments: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  source: string;
}

export interface CompletedCustomer {
  id: string;
  name: string;
  idNumber: string;
  phoneNumber: string;
  amount: number;
  fixedInterest: number;
  brokerInterest: number;
  productDifference: number;
  netProfit: number;
}

export interface Employee {
  id: string;
  name: string;
  salary: number;
  advances: number;
}

export interface Coverage {
  id: string;
  amount: number;
  receivedFrom: string;
  receivedBy: string;
  remaining: number;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface AccountingData {
  expenses: Expense[];
  pendingCustomers: PendingCustomer[];
  completedCustomers: CompletedCustomer[];
  employees: Employee[];
  coverages: Coverage[];
  accounts: Account[];
}
