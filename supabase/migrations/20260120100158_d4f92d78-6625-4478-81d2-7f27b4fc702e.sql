-- Drop existing RESTRICTIVE policies and create PERMISSIVE ones

-- expenses table (has no policies, add them)
DROP POLICY IF EXISTS "Allow all expenses" ON public.expenses;
CREATE POLICY "Allow all expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);

-- accounts
DROP POLICY IF EXISTS "Authenticated can select accounts" ON public.accounts;
DROP POLICY IF EXISTS "Authenticated can insert accounts" ON public.accounts;
DROP POLICY IF EXISTS "Authenticated can update accounts" ON public.accounts;
DROP POLICY IF EXISTS "Authenticated can delete accounts" ON public.accounts;
CREATE POLICY "Allow all accounts" ON public.accounts FOR ALL USING (true) WITH CHECK (true);

-- employees
DROP POLICY IF EXISTS "Authenticated can select employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated can insert employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated can update employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated can delete employees" ON public.employees;
CREATE POLICY "Allow all employees" ON public.employees FOR ALL USING (true) WITH CHECK (true);

-- employee_transactions
DROP POLICY IF EXISTS "Authenticated can select employee_transactions" ON public.employee_transactions;
DROP POLICY IF EXISTS "Authenticated can insert employee_transactions" ON public.employee_transactions;
DROP POLICY IF EXISTS "Authenticated can update employee_transactions" ON public.employee_transactions;
DROP POLICY IF EXISTS "Authenticated can delete employee_transactions" ON public.employee_transactions;
CREATE POLICY "Allow all employee_transactions" ON public.employee_transactions FOR ALL USING (true) WITH CHECK (true);

-- coverages
DROP POLICY IF EXISTS "Authenticated can select coverages" ON public.coverages;
DROP POLICY IF EXISTS "Authenticated can insert coverages" ON public.coverages;
DROP POLICY IF EXISTS "Authenticated can update coverages" ON public.coverages;
DROP POLICY IF EXISTS "Authenticated can delete coverages" ON public.coverages;
CREATE POLICY "Allow all coverages" ON public.coverages FOR ALL USING (true) WITH CHECK (true);

-- coverage_transactions
DROP POLICY IF EXISTS "Authenticated can select coverage_transactions" ON public.coverage_transactions;
DROP POLICY IF EXISTS "Authenticated can insert coverage_transactions" ON public.coverage_transactions;
DROP POLICY IF EXISTS "Authenticated can update coverage_transactions" ON public.coverage_transactions;
DROP POLICY IF EXISTS "Authenticated can delete coverage_transactions" ON public.coverage_transactions;
CREATE POLICY "Allow all coverage_transactions" ON public.coverage_transactions FOR ALL USING (true) WITH CHECK (true);

-- capital_entries
DROP POLICY IF EXISTS "Authenticated can select capital_entries" ON public.capital_entries;
DROP POLICY IF EXISTS "Authenticated can insert capital_entries" ON public.capital_entries;
DROP POLICY IF EXISTS "Authenticated can update capital_entries" ON public.capital_entries;
DROP POLICY IF EXISTS "Authenticated can delete capital_entries" ON public.capital_entries;
CREATE POLICY "Allow all capital_entries" ON public.capital_entries FOR ALL USING (true) WITH CHECK (true);

-- payments
DROP POLICY IF EXISTS "Authenticated can select payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated can update payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated can delete payments" ON public.payments;
CREATE POLICY "Allow all payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);

-- pending_customers
DROP POLICY IF EXISTS "Authenticated users can view pending customers" ON public.pending_customers;
DROP POLICY IF EXISTS "Authenticated users can insert pending customers" ON public.pending_customers;
DROP POLICY IF EXISTS "Authenticated users can update pending customers" ON public.pending_customers;
DROP POLICY IF EXISTS "Authenticated users can delete pending customers" ON public.pending_customers;
CREATE POLICY "Allow all pending_customers" ON public.pending_customers FOR ALL USING (true) WITH CHECK (true);

-- completed_customers
DROP POLICY IF EXISTS "Authenticated users can view completed customers" ON public.completed_customers;
DROP POLICY IF EXISTS "Authenticated users can insert completed customers" ON public.completed_customers;
DROP POLICY IF EXISTS "Authenticated users can update completed customers" ON public.completed_customers;
DROP POLICY IF EXISTS "Authenticated users can delete completed customers" ON public.completed_customers;
CREATE POLICY "Allow all completed_customers" ON public.completed_customers FOR ALL USING (true) WITH CHECK (true);

-- daily_visits
DROP POLICY IF EXISTS "Authenticated can select daily_visits" ON public.daily_visits;
DROP POLICY IF EXISTS "Authenticated can insert daily_visits" ON public.daily_visits;
DROP POLICY IF EXISTS "Authenticated can update daily_visits" ON public.daily_visits;
DROP POLICY IF EXISTS "Authenticated can delete daily_visits" ON public.daily_visits;
CREATE POLICY "Allow all daily_visits" ON public.daily_visits FOR ALL USING (true) WITH CHECK (true);

-- customer_followups
DROP POLICY IF EXISTS "Authenticated can select customer_followups" ON public.customer_followups;
DROP POLICY IF EXISTS "Authenticated can insert customer_followups" ON public.customer_followups;
DROP POLICY IF EXISTS "Authenticated can update customer_followups" ON public.customer_followups;
DROP POLICY IF EXISTS "Authenticated can delete customer_followups" ON public.customer_followups;
CREATE POLICY "Allow all customer_followups" ON public.customer_followups FOR ALL USING (true) WITH CHECK (true);