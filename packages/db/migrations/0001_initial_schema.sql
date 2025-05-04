-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type task_status as enum ('open', 'accepted', 'completed', 'disputed', 'closed');
create type deal_status as enum ('pending', 'in_progress', 'completed', 'disputed', 'resolved');
create type transaction_type as enum ('credit', 'debit');

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  about text,
  rating float default 0,
  hours_balance float default 0,
  phone text,
  is_business boolean default false,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create services table
create table services (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category text not null,
  hourly_rate float not null,
  portfolio_urls text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tasks table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category text not null,
  proposed_hours float not null,
  status task_status default 'open' not null,
  accepted_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create deals table
create table deals (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references tasks(id) on delete cascade not null,
  buyer_id uuid references profiles(id) on delete cascade not null,
  seller_id uuid references profiles(id) on delete cascade not null,
  hours_locked float not null,
  commission float not null,
  status deal_status default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create transactions table
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  type transaction_type not null,
  amount_hours float not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reviews table
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  deal_id uuid references deals(id) on delete cascade not null,
  from_user uuid references profiles(id) on delete cascade not null,
  to_user uuid references profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create disputes table
create table disputes (
  id uuid default uuid_generate_v4() primary key,
  deal_id uuid references deals(id) on delete cascade not null,
  raised_by uuid references profiles(id) on delete cascade not null,
  reason text not null,
  status text default 'open' not null,
  resolution_comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create stored procedures
create or replace function lock_hours(buyer_id uuid, amount float)
returns void as $$
begin
  -- Check if user has enough hours
  if (select hours_balance from profiles where id = buyer_id) < amount then
    raise exception 'Insufficient hours balance';
  end if;
  
  -- Deduct hours
  update profiles set hours_balance = hours_balance - amount where id = buyer_id;
  
  -- Record transaction
  insert into transactions (user_id, type, amount_hours, note)
  values (buyer_id, 'debit', amount, 'Hours locked for deal');
end;
$$ language plpgsql security definer;

create or replace function add_hours(user_id uuid, amount_hours float)
returns void as $$
begin
  -- Add hours to balance
  update profiles set hours_balance = hours_balance + amount_hours where id = user_id;
  
  -- Record transaction
  insert into transactions (user_id, type, amount_hours, note)
  values (user_id, 'credit', amount_hours, 'Hours purchased');
end;
$$ language plpgsql security definer;

-- Create RLS policies
alter table profiles enable row level security;
alter table services enable row level security;
alter table tasks enable row level security;
alter table deals enable row level security;
alter table transactions enable row level security;
alter table reviews enable row level security;
alter table disputes enable row level security;

-- Profiles policies
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Services policies
create policy "Services are viewable by everyone"
  on services for select
  using (true);

create policy "Users can create own services"
  on services for insert
  with check (auth.uid() = user_id);

create policy "Users can update own services"
  on services for update
  using (auth.uid() = user_id);

create policy "Users can delete own services"
  on services for delete
  using (auth.uid() = user_id);

-- Tasks policies
create policy "Tasks are viewable by everyone"
  on tasks for select
  using (true);

create policy "Users can create own tasks"
  on tasks for insert
  with check (auth.uid() = owner_id);

create policy "Users can update own tasks"
  on tasks for update
  using (auth.uid() = owner_id);

-- Deals policies
create policy "Deals are viewable by participants"
  on deals for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Admin can view all deals"
  on deals for select
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

-- Transactions policies
create policy "Users can view own transactions"
  on transactions for select
  using (auth.uid() = user_id);

-- Reviews policies
create policy "Reviews are viewable by everyone"
  on reviews for select
  using (true);

create policy "Users can create reviews for their deals"
  on reviews for insert
  with check (exists (
    select 1 from deals
    where id = deal_id
    and (buyer_id = auth.uid() or seller_id = auth.uid())
  ));

-- Disputes policies
create policy "Disputes are viewable by participants"
  on disputes for select
  using (exists (
    select 1 from deals
    where id = deal_id
    and (buyer_id = auth.uid() or seller_id = auth.uid())
  ));

create policy "Admin can view all disputes"
  on disputes for select
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

-- Create triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

create trigger update_services_updated_at
  before update on services
  for each row
  execute function update_updated_at_column();

create trigger update_tasks_updated_at
  before update on tasks
  for each row
  execute function update_updated_at_column();

create trigger update_deals_updated_at
  before update on deals
  for each row
  execute function update_updated_at_column();

create trigger update_disputes_updated_at
  before update on disputes
  for each row
  execute function update_updated_at_column(); 