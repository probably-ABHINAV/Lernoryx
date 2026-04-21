-- Seed file to insert initial user and organization

-- 1. Create the default organization
INSERT INTO public.organizations (id, name)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Default Admin Organization'
) ON CONFLICT (id) DO NOTHING;

-- 2. Create the user in Auth (This will trigger 'handle_new_user' to insert a pending user into public.users)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'xoxogroovy@gmail.com',
  crypt('Cypher123@', gen_salt('bf')),
  current_timestamp,
  current_timestamp,
  current_timestamp,
  '{"provider":"email","providers":["email"]}',
  '{"full_name": "Groovy User"}',
  current_timestamp,
  current_timestamp
) ON CONFLICT (id) DO NOTHING;

-- 3. Update the matching public.users row created by the auth trigger 
-- Assign 'admin' role and attach to the created organization
UPDATE public.users 
SET 
  role = 'super_admin',
  org_id = '11111111-1111-1111-1111-111111111111'
WHERE email = 'xoxogroovy@gmail.com';
