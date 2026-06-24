-- Create employee_transactions table
CREATE TABLE public.employee_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('advance', 'salary_payment', 'deduction', 'bonus')),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coverage_transactions table
CREATE TABLE public.coverage_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coverage_id UUID NOT NULL REFERENCES public.coverages(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('payment', 'adjustment', 'refund')),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_employee_transactions_employee_id ON public.employee_transactions(employee_id);
CREATE INDEX idx_employee_transactions_date ON public.employee_transactions(date);
CREATE INDEX idx_employee_transactions_type ON public.employee_transactions(type);

CREATE INDEX idx_coverage_transactions_coverage_id ON public.coverage_transactions(coverage_id);
CREATE INDEX idx_coverage_transactions_date ON public.coverage_transactions(date);
CREATE INDEX idx_coverage_transactions_type ON public.coverage_transactions(type);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_employee_transactions_updated_at
  BEFORE UPDATE ON public.employee_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coverage_transactions_updated_at
  BEFORE UPDATE ON public.coverage_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.employee_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coverage_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Authenticated can select employee_transactions" ON public.employee_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert employee_transactions" ON public.employee_transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update employee_transactions" ON public.employee_transactions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete employee_transactions" ON public.employee_transactions FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated can select coverage_transactions" ON public.coverage_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert coverage_transactions" ON public.coverage_transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update coverage_transactions" ON public.coverage_transactions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete coverage_transactions" ON public.coverage_transactions FOR DELETE TO authenticated USING (true);
