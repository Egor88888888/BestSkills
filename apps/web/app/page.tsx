import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Sparkles, ArrowRight, Users, Clock, Star } from 'lucide-react'

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
      {/* HERO BLOCK */}
      <section className="flex flex-col items-center text-center mb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none opacity-60 blur-2xl z-0" aria-hidden>
          <div className="w-[600px] h-[600px] bg-gradient-to-tr from-yellow-300 via-yellow-100 to-transparent rounded-full absolute left-1/2 top-0 -translate-x-1/2 -z-10" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-primary drop-shadow-lg">
          BestSkills
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
          Биржа обмена услугами, где время — твоя валюта. <br />
          Помогай, получай помощь, развивайся и экономь!
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-4 flex items-center gap-2 shadow-lg" asChild>
            <Link href="/auth">
              Начать сейчас <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 flex items-center gap-2" asChild>
            <Link href="/services">
              Смотреть сервисы
            </Link>
          </Button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Как это работает?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 bg-card rounded-xl shadow hover:shadow-lg transition">
            <Users className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Зарегистрируйся</h3>
            <p className="text-muted-foreground">Создай аккаунт и расскажи о своих навыках.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-xl shadow hover:shadow-lg transition">
            <Clock className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Обменивайся часами</h3>
            <p className="text-muted-foreground">Выполняй задачи, зарабатывай часы и трать их на услуги других.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-xl shadow hover:shadow-lg transition">
            <Star className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Развивайся и помогай</h3>
            <p className="text-muted-foreground">Получай отзывы, прокачивай профиль и расширяй круг общения.</p>
          </div>
        </div>
      </section>

      {/* TASKS & SERVICES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-md hover:shadow-xl transition">
          <CardHeader>
            <CardTitle>Недавние задачи</CardTitle>
            <CardDescription>Последние задачи, требующие обслуживания</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Загрузка задач...</div>}>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4 bg-muted/50 hover:bg-muted transition">
                    <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-medium text-yellow-600">{task.proposed_hours} ч.</span>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/tasks/${task.id}`}>Подробнее</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Suspense>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-xl transition">
          <CardHeader>
            <CardTitle>Последние услуги</CardTitle>
            <CardDescription>Новейшие предлагаемые услуги</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Загрузка сервисов...</div>}>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4 bg-muted/50 hover:bg-muted transition">
                    <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-medium text-yellow-600">{service.hourly_rate} ч./час</span>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/services/${service.id}`}>Подробнее</Link>
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