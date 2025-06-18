
import { useState, useEffect } from 'react';
import { AccountingData } from '@/types/accounting';

const initialData: AccountingData = {
  expenses: [],
  pendingCustomers: [],
  completedCustomers: [],
  employees: [],
  coverages: [],
  accounts: []
};

export const useAccountingData = () => {
  const [data, setData] = useState<AccountingData>(initialData);

  useEffect(() => {
    const savedData = localStorage.getItem('accountingData');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  const saveData = (newData: AccountingData) => {
    setData(newData);
    localStorage.setItem('accountingData', JSON.stringify(newData));
  };

  const updateExpenses = (expenses: any[]) => {
    const newData = { ...data, expenses };
    saveData(newData);
  };

  const updatePendingCustomers = (pendingCustomers: any[]) => {
    const newData = { ...data, pendingCustomers };
    saveData(newData);
  };

  const updateCompletedCustomers = (completedCustomers: any[]) => {
    const newData = { ...data, completedCustomers };
    saveData(newData);
  };

  const updateEmployees = (employees: any[]) => {
    const newData = { ...data, employees };
    saveData(newData);
  };

  const updateCoverages = (coverages: any[]) => {
    const newData = { ...data, coverages };
    saveData(newData);
  };

  const updateAccounts = (accounts: any[]) => {
    const newData = { ...data, accounts };
    saveData(newData);
  };

  return {
    data,
    updateExpenses,
    updatePendingCustomers,
    updateCompletedCustomers,
    updateEmployees,
    updateCoverages,
    updateAccounts
  };
};
