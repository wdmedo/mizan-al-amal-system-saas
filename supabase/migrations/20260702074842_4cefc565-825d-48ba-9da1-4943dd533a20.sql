
-- Expenses
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO anon, authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all_expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);

-- Accounts
CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  balance NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accounts TO anon, authenticated;
GRANT ALL ON public.accounts TO service_role;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all_accounts" ON public.accounts FOR ALL USING (true) WITH CHECK (true);

-- Employees
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  salary NUMERIC NOT NULL,
  advances NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO anon, authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all_employees" ON public.employees FOR ALL USING (true) WITH CHECK (true);

-- Employee transactions
CREATE TABLE public.employee_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employee_transactions TO anon, authenticated;
GRANT ALL ON public.employee_transactions TO service_role;
ALTER TABLE public.employee_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all_employee_transactions" ON public.employee_transactions FOR ALL USING (true) WITH CHECK (true);

-- Coverages
CREATE TABLE public.coverages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC NOT NULL,
  received_from TEXT NOT NULL,
  received_by TEXT NOT NULL,
  remaining NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coverages TO anon, authenticated;
GRANT ALL ON public.coverages TO service_role;
ALTER TABLE public.coverages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all_coverages" ON public.coverages FOR ALL USING (true) WITH CHECK (true);

-- Coverage transactions
CREATE TABLE public.coverage_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coverage_id UUID NOT NULL REFERENCES public.coverages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coverage_transactions TO anon, authenticated;
GRANT ALL ON public.coverage_transactions TO service_role;
ALTER TABLE public.coverage_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all_coverage_transactions" ON public.coverage_transactions FOR ALL USING (true) WITH CHECK (true);

-- Capital entries
CREATE TABLE public.capital_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.capital_entries TO anon, authenticated;
GRANT ALL ON public.capital_entries TO service_role;
ALTER TABLE public.capital_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all_capital_entries" ON public.capital_entries FOR ALL USING (true) WITH CHECK (true);

-- Pending customers
CREATE TABLE public.pending_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  id_number TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pending_customers TO anon, authenticated;
GRANT ALL ON public.pending_customers TO service_role;
ALTER TABLE public.pending_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all_pending_customers" ON public.pending_customers FOR ALL USING (true) WITH CHECK (true);

-- Payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.pending_customers(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO anon, authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all_payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);

-- Completed customers
CREATE TABLE public.completed_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  id_number TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  fixed_interest NUMERIC NOT NULL,
  broker_percentage NUMERIC NOT NULL,
  product_difference NUMERIC NOT NULL,
  net_profit NUMERIC NOT NULL,
  total_payment NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.completed_customers TO anon, authenticated;
GRANT ALL ON public.completed_customers TO service_role;
ALTER TABLE public.completed_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all_completed_customers" ON public.completed_customers FOR ALL USING (true) WITH CHECK (true);

-- Daily visits
CREATE TABLE public.daily_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  mediator TEXT,
  reception_employee TEXT,
  bank TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_visits TO anon, authenticated;
GRANT ALL ON public.daily_visits TO service_role;
ALTER TABLE public.daily_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all_daily_visits" ON public.daily_visits FOR ALL USING (true) WITH CHECK (true);

-- Customer followups
CREATE TABLE public.customer_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  follow_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sunday_status TEXT,
  monday_status TEXT,
  tuesday_status TEXT,
  wednesday_status TEXT,
  thursday_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_followups TO anon, authenticated;
GRANT ALL ON public.customer_followups TO service_role;
ALTER TABLE public.customer_followups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all_customer_followups" ON public.customer_followups FOR ALL USING (true) WITH CHECK (true);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_daily_visits_updated_at BEFORE UPDATE ON public.daily_visits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_followups_updated_at BEFORE UPDATE ON public.customer_followups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
