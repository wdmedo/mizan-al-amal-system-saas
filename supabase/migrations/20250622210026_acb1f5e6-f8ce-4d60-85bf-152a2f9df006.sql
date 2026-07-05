
-- إنشاء جدول حركات رأس المال
CREATE TABLE public.capital_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('increase', 'decrease')),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء فهرس للتاريخ لتحسين الأداء
CREATE INDEX idx_capital_entries_date ON public.capital_entries(date);

-- إنشاء فهرس للنوع
CREATE INDEX idx_capital_entries_type ON public.capital_entries(type);
