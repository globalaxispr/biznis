-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Fornecedores
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  is_vip BOOLEAN DEFAULT false NOT NULL,
  total_spent NUMERIC(12,2) DEFAULT 0.00 NOT NULL,
  last_purchase_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  barcode TEXT UNIQUE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  buy_price NUMERIC(12,2) DEFAULT 0.00 NOT NULL,
  sell_price NUMERIC(12,2) DEFAULT 0.00 NOT NULL,
  quantity INTEGER DEFAULT 0 NOT NULL,
  min_stock INTEGER DEFAULT 5 NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Caixa (Cash Register Drawer)
CREATE TABLE IF NOT EXISTS public.cash_registers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opened_by UUID REFERENCES auth.users(id),
  closed_by UUID REFERENCES auth.users(id),
  initial_balance NUMERIC(12,2) DEFAULT 0.00 NOT NULL,
  current_balance NUMERIC(12,2) DEFAULT 0.00 NOT NULL,
  status TEXT CHECK (status IN ('open', 'closed')) DEFAULT 'open' NOT NULL,
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Movimentações de Caixa (Sangria / Refòs)
CREATE TABLE IF NOT EXISTS public.cash_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cash_register_id UUID REFERENCES public.cash_registers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  type TEXT CHECK (type IN ('in', 'out')) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Vendas
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id),
  cash_register_id UUID REFERENCES public.cash_registers(id) ON DELETE SET NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  discount NUMERIC(12,2) DEFAULT 0.00 NOT NULL,
  total NUMERIC(12,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'transfer', 'other')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Itens da Venda
CREATE TABLE IF NOT EXISTS public.sale_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  total_price NUMERIC(12,2) NOT NULL
);

-- Movimentações de Estoque (Entrada / Saída / Ajuste)
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  type TEXT CHECK (type IN ('in', 'out', 'adjustment')) NOT NULL,
  quantity INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurações da Empresa
CREATE TABLE IF NOT EXISTS public.store_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT DEFAULT 'BizHaiti Store' NOT NULL,
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  currency TEXT DEFAULT 'HTG' NOT NULL,
  language TEXT DEFAULT 'ht' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Inserir configurações padrão
INSERT INTO public.store_settings (id, name, phone, email, address)
VALUES (1, 'BizHaiti Commerce', '+509 3700 0000', 'contact@bizhaiti.ht', 'Port-au-Prince, Haiti')
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_registers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura para usuários autenticados
CREATE POLICY "Auth users can view categories" ON public.categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth users can view suppliers" ON public.suppliers FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth users can view customers" ON public.customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth users can view products" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth users can view cash_registers" ON public.cash_registers FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth users can view cash_movements" ON public.cash_movements FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth users can view sales" ON public.sales FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth users can view sale_items" ON public.sale_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth users can view inventory_movements" ON public.inventory_movements FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth users can view store_settings" ON public.store_settings FOR ALL TO authenticated USING (true);
