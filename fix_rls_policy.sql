-- Drop existing admin policy
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;

-- Create new admin policy that works properly
CREATE POLICY "Admins can manage articles" ON public.articles
FOR ALL
TO authenticated
USING (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);
