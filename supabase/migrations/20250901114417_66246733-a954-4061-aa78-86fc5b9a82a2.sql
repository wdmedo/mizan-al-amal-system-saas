-- Secure sensitive data in completed_customers by enabling RLS and restricting access
-- 1) Enable Row Level Security
ALTER TABLE public.completed_customers ENABLE ROW LEVEL SECURITY;

-- 2) Policies: allow only authenticated users to access
CREATE POLICY "Authenticated users can view completed customers"
ON public.completed_customers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert completed customers"
ON public.completed_customers
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update completed customers"
ON public.completed_customers
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete completed customers"
ON public.completed_customers
FOR DELETE
TO authenticated
USING (true);
