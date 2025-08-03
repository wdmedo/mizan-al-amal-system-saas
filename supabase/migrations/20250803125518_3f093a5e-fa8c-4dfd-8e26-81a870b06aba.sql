-- Create table for daily customer visits
CREATE TABLE public.daily_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  mediator TEXT,
  reception_employee TEXT,
  bank TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for customer follow-ups
CREATE TABLE public.customer_followups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  sunday_status TEXT,
  monday_status TEXT,
  tuesday_status TEXT,
  wednesday_status TEXT,
  thursday_status TEXT,
  follow_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.daily_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_followups ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no authentication is implemented)
CREATE POLICY "Allow all operations on daily_visits" 
ON public.daily_visits 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on customer_followups" 
ON public.customer_followups 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_daily_visits_updated_at
  BEFORE UPDATE ON public.daily_visits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_followups_updated_at
  BEFORE UPDATE ON public.customer_followups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better search performance
CREATE INDEX idx_daily_visits_customer_name ON public.daily_visits(customer_name);
CREATE INDEX idx_daily_visits_date ON public.daily_visits(date);
CREATE INDEX idx_customer_followups_customer_name ON public.customer_followups(customer_name);
CREATE INDEX idx_customer_followups_follow_date ON public.customer_followups(follow_date);