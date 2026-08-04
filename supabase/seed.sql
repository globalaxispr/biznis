-- Extension para criptografia de modpas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ID fixo para o Administrador Inicial
DO $$
DECLARE
  admin_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
BEGIN
  -- 1. Inserir usuário na tabela auth.users do Supabase
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    admin_id,
    'authenticated',
    'authenticated',
    'admin@bizhaiti.com',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"first_name": "Admin", "last_name": "BizHaiti", "role": "admin"}',
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- 2. Garantir perfil Admin na tabela public.profiles
  INSERT INTO public.profiles (id, first_name, last_name, role, is_active)
  VALUES (
    admin_id,
    'Admin',
    'BizHaiti',
    'admin',
    true
  ) ON CONFLICT (id) DO UPDATE SET role = 'admin', is_active = true;

END $$;
