-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Authenticated can select expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated can insert expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated can update expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated can delete expenses" ON public.expenses;

-- Enable RLS on all remaining tables that don't have it yet
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coverages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coverage_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capital_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Remove any overly-permissive public policies
DROP POLICY IF EXISTS "Allow all operations on daily_visits" ON public.daily_visits;
DROP POLICY IF EXISTS "Allow all operations on customer_followups" ON public.customer_followups;