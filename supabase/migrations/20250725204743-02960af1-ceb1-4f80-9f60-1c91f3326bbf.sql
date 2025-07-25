-- Insert admin user into auth.users table with proper password hash
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
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'mtegakennedy@gmail.com',
  crypt('Helphelp@2024', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Kennedy Mtega"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Insert corresponding record in public.users table with admin role
INSERT INTO public.users (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'mtegakennedy@gmail.com'),
  'mtegakennedy@gmail.com',
  'Kennedy Mtega',
  'admin',
  NOW(),
  NOW()
);