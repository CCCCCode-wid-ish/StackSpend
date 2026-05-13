-- Supabase SQL setup script for StackSpend

-- 1. Create audits table
CREATE TABLE IF NOT EXISTS public.audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    tool TEXT NOT NULL,
    current_spend NUMERIC NOT NULL,
    recommended_plan TEXT NOT NULL,
    savings NUMERIC NOT NULL,
    reason TEXT NOT NULL
);

-- 2. Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    audit_id UUID REFERENCES public.audits(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    tool TEXT NOT NULL,
    estimated_monthly_savings NUMERIC NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. Create policies to allow public inserts (since this is a public form without authentication)
CREATE POLICY "Enable insert for public access on audits" 
ON public.audits FOR INSERT 
TO public 
WITH CHECK (true);

-- (Optional) If you want to view reports via public links, allow select
CREATE POLICY "Enable read access for all users on audits" 
ON public.audits FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Enable insert for public access on leads" 
ON public.leads FOR INSERT 
TO public 
WITH CHECK (true);
