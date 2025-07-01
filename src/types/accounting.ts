
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
  transactions?: EmployeeTransaction[];
}

export interface EmployeeTransaction {
  id: string;
  employeeId: string;
  type: 'advance' | 'salary_payment' | 'deduction' | 'bonus';
  amount: number;
  description: string;
  date: string;
}

export interface Coverage {
  id: string;
  amount: number;
  receivedFrom: string;
  receivedBy: string;
  remaining: number;
  transactions?: CoverageTransaction[];
}

export interface CoverageTransaction {
  id: string;
  coverageId: string;
  type: 'payment' | 'adjustment' | 'refund';
  amount: number;
  description: string;
  date: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface CapitalEntry {
  id: string;
  date: string;
  amount: number;
  type: 'increase' | 'decrease';
  description: string;
}

export interface AccountingData {
  expenses: Expense[];
  pendingCustomers: PendingCustomer[];
  completedCustomers: CompletedCustomer[];
  employees: Employee[];
  employeeTransactions: EmployeeTransaction[];
  coverages: Coverage[];
  coverageTransactions: CoverageTransaction[];
  accounts: Account[];
  capitalEntries: CapitalEntry[];
}
