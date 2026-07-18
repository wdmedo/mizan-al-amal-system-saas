-- Add SaaS tenant support with organizations and tenant isolation

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_select_organizations" ON public.organizations
  FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.user_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'employee',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, organization_id)
);
GRANT SELECT ON public.user_organizations TO authenticated;
GRANT ALL ON public.user_organizations TO service_role;
ALTER TABLE public.user_organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_select_user_organizations" ON public.user_organizations
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "authenticated_insert_user_organizations" ON public.user_organizations
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND organization_id IS NOT NULL);
CREATE POLICY "authenticated_update_user_organizations" ON public.user_organizations
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "authenticated_delete_user_organizations" ON public.user_organizations
  FOR DELETE TO authenticated USING (user_id = auth.uid());

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

ALTER TABLE public.expenses
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.pending_customers
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.completed_customers
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.coverages
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.employee_transactions
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.coverage_transactions
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.capital_entries
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.daily_visits
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.customer_followups
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

CREATE INDEX IF NOT EXISTS idx_profiles_company_name ON public.profiles(company_name);
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_expenses_organization_id ON public.expenses(organization_id);
CREATE INDEX IF NOT EXISTS idx_pending_customers_organization_id ON public.pending_customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_payments_organization_id ON public.payments(organization_id);
CREATE INDEX IF NOT EXISTS idx_completed_customers_organization_id ON public.completed_customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_organization_id ON public.employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_coverages_organization_id ON public.coverages(organization_id);
CREATE INDEX IF NOT EXISTS idx_accounts_organization_id ON public.accounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_employee_transactions_organization_id ON public.employee_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_coverage_transactions_organization_id ON public.coverage_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_capital_entries_organization_id ON public.capital_entries(organization_id);
CREATE INDEX IF NOT EXISTS idx_daily_visits_organization_id ON public.daily_visits(organization_id);
CREATE INDEX IF NOT EXISTS idx_customer_followups_organization_id ON public.customer_followups(organization_id);

CREATE OR REPLACE FUNCTION public.current_organization_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.user_organizations WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_first_user BOOLEAN;
  org_id UUID;
BEGIN
  INSERT INTO public.organizations (name)
  VALUES (COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.email || ' organization'))
  RETURNING id INTO org_id;

  INSERT INTO public.profiles (id, email, full_name, company_name, organization_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
    org_id
  );

  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles) INTO is_first_user;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN is_first_user THEN 'admin'::app_role ELSE 'employee'::app_role END);

  INSERT INTO public.user_organizations (user_id, organization_id, role)
  VALUES (NEW.id, org_id, CASE WHEN is_first_user THEN 'admin'::app_role ELSE 'employee'::app_role END);

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_organization_id_via_auth()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.organization_id IS NULL THEN
    NEW.organization_id := public.current_organization_id();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_organization_id_expenses
  BEFORE INSERT ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id_via_auth();

CREATE TRIGGER set_organization_id_pending_customers
  BEFORE INSERT ON public.pending_customers
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id_via_auth();

CREATE TRIGGER set_organization_id_payments
  BEFORE INSERT ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id_via_auth();

CREATE TRIGGER set_organization_id_completed_customers
  BEFORE INSERT ON public.completed_customers
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id_via_auth();

CREATE TRIGGER set_organization_id_employees
  BEFORE INSERT ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id_via_auth();

CREATE TRIGGER set_organization_id_coverages
  BEFORE INSERT ON public.coverages
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id_via_auth();

CREATE TRIGGER set_organization_id_accounts
  BEFORE INSERT ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id_via_auth();

CREATE TRIGGER set_organization_id_employee_transactions
  BEFORE INSERT ON public.employee_transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id_via_auth();

CREATE TRIGGER set_organization_id_coverage_transactions
  BEFORE INSERT ON public.coverage_transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id_via_auth();

CREATE TRIGGER set_organization_id_capital_entries
  BEFORE INSERT ON public.capital_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id_via_auth();

CREATE TRIGGER set_organization_id_daily_visits
  BEFORE INSERT ON public.daily_visits
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id_via_auth();

CREATE TRIGGER set_organization_id_customer_followups
  BEFORE INSERT ON public.customer_followups
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id_via_auth();

-- Enforce tenant isolation for all business tables using organization_id

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_expenses" ON public.expenses;
CREATE POLICY "org_select_own_expenses" ON public.expenses FOR SELECT TO authenticated USING (organization_id = public.current_organization_id());
CREATE POLICY "org_insert_own_expenses" ON public.expenses FOR INSERT TO authenticated WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_update_own_expenses" ON public.expenses FOR UPDATE TO authenticated USING (organization_id = public.current_organization_id()) WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_delete_own_expenses" ON public.expenses FOR DELETE TO authenticated USING (organization_id = public.current_organization_id());

ALTER TABLE public.pending_customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_pending_customers" ON public.pending_customers;
CREATE POLICY "org_select_own_pending_customers" ON public.pending_customers FOR SELECT TO authenticated USING (organization_id = public.current_organization_id());
CREATE POLICY "org_insert_own_pending_customers" ON public.pending_customers FOR INSERT TO authenticated WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_update_own_pending_customers" ON public.pending_customers FOR UPDATE TO authenticated USING (organization_id = public.current_organization_id()) WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_delete_own_pending_customers" ON public.pending_customers FOR DELETE TO authenticated USING (organization_id = public.current_organization_id());

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_payments" ON public.payments;
CREATE POLICY "org_select_own_payments" ON public.payments FOR SELECT TO authenticated USING (organization_id = public.current_organization_id());
CREATE POLICY "org_insert_own_payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_update_own_payments" ON public.payments FOR UPDATE TO authenticated USING (organization_id = public.current_organization_id()) WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_delete_own_payments" ON public.payments FOR DELETE TO authenticated USING (organization_id = public.current_organization_id());

ALTER TABLE public.completed_customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_completed_customers" ON public.completed_customers;
CREATE POLICY "org_select_own_completed_customers" ON public.completed_customers FOR SELECT TO authenticated USING (organization_id = public.current_organization_id());
CREATE POLICY "org_insert_own_completed_customers" ON public.completed_customers FOR INSERT TO authenticated WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_update_own_completed_customers" ON public.completed_customers FOR UPDATE TO authenticated USING (organization_id = public.current_organization_id()) WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_delete_own_completed_customers" ON public.completed_customers FOR DELETE TO authenticated USING (organization_id = public.current_organization_id());

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_employees" ON public.employees;
CREATE POLICY "org_select_own_employees" ON public.employees FOR SELECT TO authenticated USING (organization_id = public.current_organization_id());
CREATE POLICY "org_insert_own_employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_update_own_employees" ON public.employees FOR UPDATE TO authenticated USING (organization_id = public.current_organization_id()) WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_delete_own_employees" ON public.employees FOR DELETE TO authenticated USING (organization_id = public.current_organization_id());

ALTER TABLE public.coverages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_coverages" ON public.coverages;
CREATE POLICY "org_select_own_coverages" ON public.coverages FOR SELECT TO authenticated USING (organization_id = public.current_organization_id());
CREATE POLICY "org_insert_own_coverages" ON public.coverages FOR INSERT TO authenticated WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_update_own_coverages" ON public.coverages FOR UPDATE TO authenticated USING (organization_id = public.current_organization_id()) WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_delete_own_coverages" ON public.coverages FOR DELETE TO authenticated USING (organization_id = public.current_organization_id());

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_accounts" ON public.accounts;
CREATE POLICY "org_select_own_accounts" ON public.accounts FOR SELECT TO authenticated USING (organization_id = public.current_organization_id());
CREATE POLICY "org_insert_own_accounts" ON public.accounts FOR INSERT TO authenticated WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_update_own_accounts" ON public.accounts FOR UPDATE TO authenticated USING (organization_id = public.current_organization_id()) WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_delete_own_accounts" ON public.accounts FOR DELETE TO authenticated USING (organization_id = public.current_organization_id());

ALTER TABLE public.employee_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_employee_transactions" ON public.employee_transactions;
CREATE POLICY "org_select_own_employee_transactions" ON public.employee_transactions FOR SELECT TO authenticated USING (organization_id = public.current_organization_id());
CREATE POLICY "org_insert_own_employee_transactions" ON public.employee_transactions FOR INSERT TO authenticated WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_update_own_employee_transactions" ON public.employee_transactions FOR UPDATE TO authenticated USING (organization_id = public.current_organization_id()) WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_delete_own_employee_transactions" ON public.employee_transactions FOR DELETE TO authenticated USING (organization_id = public.current_organization_id());

ALTER TABLE public.coverage_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_coverage_transactions" ON public.coverage_transactions;
CREATE POLICY "org_select_own_coverage_transactions" ON public.coverage_transactions FOR SELECT TO authenticated USING (organization_id = public.current_organization_id());
CREATE POLICY "org_insert_own_coverage_transactions" ON public.coverage_transactions FOR INSERT TO authenticated WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_update_own_coverage_transactions" ON public.coverage_transactions FOR UPDATE TO authenticated USING (organization_id = public.current_organization_id()) WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_delete_own_coverage_transactions" ON public.coverage_transactions FOR DELETE TO authenticated USING (organization_id = public.current_organization_id());

ALTER TABLE public.capital_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_capital_entries" ON public.capital_entries;
CREATE POLICY "org_select_own_capital_entries" ON public.capital_entries FOR SELECT TO authenticated USING (organization_id = public.current_organization_id());
CREATE POLICY "org_insert_own_capital_entries" ON public.capital_entries FOR INSERT TO authenticated WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_update_own_capital_entries" ON public.capital_entries FOR UPDATE TO authenticated USING (organization_id = public.current_organization_id()) WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_delete_own_capital_entries" ON public.capital_entries FOR DELETE TO authenticated USING (organization_id = public.current_organization_id());

ALTER TABLE public.daily_visits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_daily_visits" ON public.daily_visits;
CREATE POLICY "org_select_own_daily_visits" ON public.daily_visits FOR SELECT TO authenticated USING (organization_id = public.current_organization_id());
CREATE POLICY "org_insert_own_daily_visits" ON public.daily_visits FOR INSERT TO authenticated WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_update_own_daily_visits" ON public.daily_visits FOR UPDATE TO authenticated USING (organization_id = public.current_organization_id()) WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_delete_own_daily_visits" ON public.daily_visits FOR DELETE TO authenticated USING (organization_id = public.current_organization_id());

ALTER TABLE public.customer_followups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_all_customer_followups" ON public.customer_followups;
CREATE POLICY "org_select_own_customer_followups" ON public.customer_followups FOR SELECT TO authenticated USING (organization_id = public.current_organization_id());
CREATE POLICY "org_insert_own_customer_followups" ON public.customer_followups FOR INSERT TO authenticated WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_update_own_customer_followups" ON public.customer_followups FOR UPDATE TO authenticated USING (organization_id = public.current_organization_id()) WITH CHECK (organization_id = public.current_organization_id());
CREATE POLICY "org_delete_own_customer_followups" ON public.customer_followups FOR DELETE TO authenticated USING (organization_id = public.current_organization_id());

