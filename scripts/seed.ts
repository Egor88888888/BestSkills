import { supabase } from '../apps/web/lib/supabase'

async function seed() {
  // Create admin user
  const { data: adminAuth, error: adminAuthError } = await supabase.auth.signUp({
    email: 'admin@barterhours.com',
    password: 'admin123',
  })

  if (adminAuthError) {
    console.error('Error creating admin user:', adminAuthError)
    return
  }

  // Create admin profile
  const { error: adminProfileError } = await supabase
    .from('profiles')
    .insert({
      id: adminAuth.user.id,
      full_name: 'Admin User',
      is_admin: true,
      is_business: true,
      phone: '+1234567890',
    })

  if (adminProfileError) {
    console.error('Error creating admin profile:', adminProfileError)
    return
  }

  // Create sample services
  const services = [
    {
      user_id: adminAuth.user.id,
      title: 'Web Development',
      description: 'Professional web development services',
      category: 'Development',
      hourly_rate: 2,
      portfolio_urls: ['https://example.com/portfolio1'],
    },
    {
      user_id: adminAuth.user.id,
      title: 'Graphic Design',
      description: 'Creative graphic design services',
      category: 'Design',
      hourly_rate: 1.5,
      portfolio_urls: ['https://example.com/portfolio2'],
    },
  ]

  const { error: servicesError } = await supabase
    .from('services')
    .insert(services)

  if (servicesError) {
    console.error('Error creating services:', servicesError)
    return
  }

  // Create sample tasks
  const tasks = [
    {
      owner_id: adminAuth.user.id,
      title: 'Need a website',
      description: 'Looking for a simple business website',
      category: 'Development',
      proposed_hours: 5,
      status: 'open',
    },
    {
      owner_id: adminAuth.user.id,
      title: 'Logo design',
      description: 'Need a new logo for my business',
      category: 'Design',
      proposed_hours: 3,
      status: 'open',
    },
  ]

  const { error: tasksError } = await supabase
    .from('tasks')
    .insert(tasks)

  if (tasksError) {
    console.error('Error creating tasks:', tasksError)
    return
  }

  console.log('Seed completed successfully!')
}

seed().catch(console.error) 