import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

async function getTopTasks() {
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(5)

  return tasks || []
}

async function getTopServices() {
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return services || []
}

export default async function Home() {
  const [tasks, services] = await Promise.all([
    getTopTasks(),
    getTopServices(),
  ])

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to BarterHours</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Exchange services using hours as currency
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/tasks">Browse Tasks</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/services">Browse Services</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Latest tasks looking for services</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading tasks...</div>}>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-medium">{task.proposed_hours} hours</span>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/tasks/${task.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Services</CardTitle>
            <CardDescription>Latest services offered</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading services...</div>}>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-medium">{service.hourly_rate} hours/hour</span>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/services/${service.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 