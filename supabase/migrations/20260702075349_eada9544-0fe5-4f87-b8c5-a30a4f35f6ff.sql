
-- Drop all permissive policies and revoke anon access; recreate as authenticated-only

DO $$
DECLARE
  t text;
  p record;
  tables text[] := ARRAY[
    'accounts','capital_entries','completed_customers','coverage_transactions',
    'coverages','customer_followups','daily_visits','employee_transactions',
    'employees','expenses','payments','pending_customers'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    -- Drop existing policies
    FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=t LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p.policyname, t);
    END LOOP;

    -- Revoke anon
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);

    -- Ensure authenticated has full CRUD
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);

    -- Create authenticated-only policies
    EXECUTE format(
      'CREATE POLICY "authenticated_select_%s" ON public.%I FOR SELECT TO authenticated USING (true)',
      t, t
    );
    EXECUTE format(
      'CREATE POLICY "authenticated_insert_%s" ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL)',
      t, t
    );
    EXECUTE format(
      'CREATE POLICY "authenticated_update_%s" ON public.%I FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL)',
      t, t
    );
    EXECUTE format(
      'CREATE POLICY "authenticated_delete_%s" ON public.%I FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL)',
      t, t
    );
  END LOOP;
END $$;
