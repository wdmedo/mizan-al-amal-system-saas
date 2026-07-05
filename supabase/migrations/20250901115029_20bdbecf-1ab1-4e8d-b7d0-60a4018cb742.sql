-- 1) Enable RLS on remaining tables (skip ones that already have policies)
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coverages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coverage_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capital_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 2) Create authenticated-only policies for tables that don't have them yet
-- expenses
DROP POLICY IF EXISTS "Authenticated can select expenses" ON public.expenses;
CREATE POLICY "Authenticated can select expenses" ON public.expenses FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated can insert expenses" ON public.expenses;
CREATE POLICY "Authenticated can insert expenses" ON public.expenses FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can update expenses" ON public.expenses;
CREATE POLICY "Authenticated can update expenses" ON public.expenses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can delete expenses" ON public.expenses;
CREATE POLICY "Authenticated can delete expenses" ON public.expenses FOR DELETE TO authenticated USING (true);

-- accounts
DROP POLICY IF EXISTS "Authenticated can select accounts" ON public.accounts;
CREATE POLICY "Authenticated can select accounts" ON public.accounts FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated can insert accounts" ON public.accounts;
CREATE POLICY "Authenticated can insert accounts" ON public.accounts FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can update accounts" ON public.accounts;
CREATE POLICY "Authenticated can update accounts" ON public.accounts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can delete accounts" ON public.accounts;
CREATE POLICY "Authenticated can delete accounts" ON public.accounts FOR DELETE TO authenticated USING (true);

-- employees
DROP POLICY IF EXISTS "Authenticated can select employees" ON public.employees;
CREATE POLICY "Authenticated can select employees" ON public.employees FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated can insert employees" ON public.employees;
CREATE POLICY "Authenticated can insert employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can update employees" ON public.employees;
CREATE POLICY "Authenticated can update employees" ON public.employees FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can delete employees" ON public.employees;
CREATE POLICY "Authenticated can delete employees" ON public.employees FOR DELETE TO authenticated USING (true);

-- employee_transactions
DROP POLICY IF EXISTS "Authenticated can select employee_transactions" ON public.employee_transactions;
CREATE POLICY "Authenticated can select employee_transactions" ON public.employee_transactions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated can insert employee_transactions" ON public.employee_transactions;
CREATE POLICY "Authenticated can insert employee_transactions" ON public.employee_transactions FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can update employee_transactions" ON public.employee_transactions;
CREATE POLICY "Authenticated can update employee_transactions" ON public.employee_transactions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can delete employee_transactions" ON public.employee_transactions;
CREATE POLICY "Authenticated can delete employee_transactions" ON public.employee_transactions FOR DELETE TO authenticated USING (true);

-- coverages
DROP POLICY IF EXISTS "Authenticated can select coverages" ON public.coverages;
CREATE POLICY "Authenticated can select coverages" ON public.coverages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated can insert coverages" ON public.coverages;
CREATE POLICY "Authenticated can insert coverages" ON public.coverages FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can update coverages" ON public.coverages;
CREATE POLICY "Authenticated can update coverages" ON public.coverages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can delete coverages" ON public.coverages;
CREATE POLICY "Authenticated can delete coverages" ON public.coverages FOR DELETE TO authenticated USING (true);

-- coverage_transactions
DROP POLICY IF EXISTS "Authenticated can select coverage_transactions" ON public.coverage_transactions;
CREATE POLICY "Authenticated can select coverage_transactions" ON public.coverage_transactions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated can insert coverage_transactions" ON public.coverage_transactions;
CREATE POLICY "Authenticated can insert coverage_transactions" ON public.coverage_transactions FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can update coverage_transactions" ON public.coverage_transactions;
CREATE POLICY "Authenticated can update coverage_transactions" ON public.coverage_transactions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can delete coverage_transactions" ON public.coverage_transactions;
CREATE POLICY "Authenticated can delete coverage_transactions" ON public.coverage_transactions FOR DELETE TO authenticated USING (true);

-- capital_entries
DROP POLICY IF EXISTS "Authenticated can select capital_entries" ON public.capital_entries;
CREATE POLICY "Authenticated can select capital_entries" ON public.capital_entries FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated can insert capital_entries" ON public.capital_entries;
CREATE POLICY "Authenticated can insert capital_entries" ON public.capital_entries FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can update capital_entries" ON public.capital_entries;
CREATE POLICY "Authenticated can update capital_entries" ON public.capital_entries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can delete capital_entries" ON public.capital_entries;
CREATE POLICY "Authenticated can delete capital_entries" ON public.capital_entries FOR DELETE TO authenticated USING (true);

-- payments
DROP POLICY IF EXISTS "Authenticated can select payments" ON public.payments;
CREATE POLICY "Authenticated can select payments" ON public.payments FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated can insert payments" ON public.payments;
CREATE POLICY "Authenticated can insert payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can update payments" ON public.payments;
CREATE POLICY "Authenticated can update payments" ON public.payments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can delete payments" ON public.payments;
CREATE POLICY "Authenticated can delete payments" ON public.payments FOR DELETE TO authenticated USING (true);

-- 3) Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
