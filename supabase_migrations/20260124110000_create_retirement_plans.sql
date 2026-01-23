-- Create Retirement Plans Table
CREATE TABLE IF NOT EXISTS public.retirement_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  target_age integer NOT NULL,
  current_age integer NOT NULL,
  current_savings numeric NOT NULL DEFAULT 0,
  monthly_contribution numeric NOT NULL DEFAULT 0,
  expected_return numeric NOT NULL DEFAULT 5.0, -- Default 5%
  inflation_rate numeric NOT NULL DEFAULT 2.0, -- Default 2%
  target_monthly_income numeric NOT NULL DEFAULT 0,
  linked_goal_id text, -- Loose link to goals (UUID as text or strict FK if goals table exists)
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT retirement_plans_pkey PRIMARY KEY (id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_retirement_plans_user_id ON public.retirement_plans(user_id);

-- RLS
ALTER TABLE public.retirement_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own retirement plans"
  ON public.retirement_plans
  FOR ALL
  USING (auth.uid() = user_id);
