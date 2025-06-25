
-- Create employee_transactions table
CREATE TABLE public.employee_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('advance', 'payment')),
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coverage_transactions table
CREATE TABLE public.coverage_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coverage_id UUID NOT NULL REFERENCES public.coverages(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('payment', 'refund')),
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_employee_transactions_employee_id ON public.employee_transactions(employee_id);
CREATE INDEX idx_coverage_transactions_coverage_id ON public.coverage_transactions(coverage_id);
