-- Allow authenticated users to read study materials
CREATE POLICY "Authenticated users can select materials"
ON public.materials
FOR SELECT
TO authenticated
USING (true);

-- Allow admins to insert new materials
CREATE POLICY "Admins can insert materials"
ON public.materials
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Allow admins to update materials
CREATE POLICY "Admins can update materials"
ON public.materials
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Allow admins to delete materials
CREATE POLICY "Admins can delete materials"
ON public.materials
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));
