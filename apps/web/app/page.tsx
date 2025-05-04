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
    <div className="container mx-auto py-12 px-2 md:px-0">
      {/* HERO BLOCK */}
      <section className="flex flex-col items-center text-center mb-20 relative overflow-hidden min-h-[350px] animate-fade-in">
        <div className="absolute inset-0 pointer-events-none select-none opacity-70 blur-2xl z-0" aria-hidden>
          <div className="w-[700px] h-[700px] bg-gradient-to-tr from-yellow-300 via-yellow-100 to-transparent rounded-full absolute left-1/2 top-0 -translate-x-1/2 -z-10 animate-pulse" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-primary drop-shadow-xl animate-fade-in-up">
          BestSkills
        </h1>
        <p className="text-2xl md:text-3xl text-muted-foreground mb-10 max-w-2xl font-medium animate-fade-in-up delay-100">
          <span className="text-yellow-500 font-bold">Твое время — твоя валюта!</span> <br />
          Помогай, получай помощь, развивайся и экономь. <br />
          <span className="text-lg text-primary/80">Здесь каждый может стать экспертом и получить поддержку сообщества.</span>
        </p>
        <div className="flex gap-4 justify-center animate-fade-in-up delay-200">
          <Button size="lg" className="text-lg px-8 py-4 flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200 animate-bounce" asChild>
            <Link href="/auth">
              🚀 Начать путь эксперта <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform duration-200" asChild>
            <Link href="/services">
              Смотреть сервисы
            </Link>
          </Button>
        </div>
        <div className="mt-6 text-base text-muted-foreground animate-fade-in-up delay-300">
          <Sparkles className="inline w-6 h-6 text-yellow-400 animate-spin-slow mr-2" />
          <span>Уже более <b>1000</b> часов обменяно между участниками!</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mb-20 animate-fade-in-up delay-200">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Как это работает?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-8 bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-yellow-100 dark:border-yellow-900 animate-fade-in-up">
            <Users className="w-12 h-12 text-yellow-400 mb-4 animate-bounce" />
            <h3 className="font-semibold text-xl mb-2">1. Зарегистрируйся</h3>
            <p className="text-muted-foreground text-base">Создай аккаунт, расскажи о своих навыках и получи приветственный бонус!</p>
          </div>
          <div className="flex flex-col items-center p-8 bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-yellow-100 dark:border-yellow-900 animate-fade-in-up delay-100">
            <Clock className="w-12 h-12 text-yellow-400 mb-4 animate-spin-slow" />
            <h3 className="font-semibold text-xl mb-2">2. Обменивайся часами</h3>
            <p className="text-muted-foreground text-base">Выполняй задачи, зарабатывай часы и трать их на услуги других. Всё честно и прозрачно!</p>
          </div>
          <div className="flex flex-col items-center p-8 bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-yellow-100 dark:border-yellow-900 animate-fade-in-up delay-200">
            <Star className="w-12 h-12 text-yellow-400 mb-4 animate-pulse" />
            <h3 className="font-semibold text-xl mb-2">3. Развивайся и помогай</h3>
            <p className="text-muted-foreground text-base">Получай отзывы, прокачивай профиль, расширяй круг общения и становись частью комьюнити!</p>
          </div>
        </div>
      </section>

      {/* TASKS & SERVICES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-in-up delay-300">
        <Card className="shadow-lg hover:shadow-2xl transition-all border-2 border-yellow-100 dark:border-yellow-900 animate-fade-in-up">
          <CardHeader>
            <CardTitle>🔥 Недавние задачи</CardTitle>
            <CardDescription>Самые свежие задачи — выбери и заработай часы!</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="animate-pulse text-center">Загрузка задач...</div>}>
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 animate-fade-in">Пока нет задач — стань первым, кто предложит помощь!</div>
                ) : tasks.map((task) => (
                  <div key={task.id} className="border rounded-xl p-5 bg-muted/50 hover:bg-yellow-50 dark:hover:bg-yellow-900 transition-all flex flex-col gap-2 animate-fade-in-up">
                    <h3 className="font-semibold text-lg mb-1 truncate">{task.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-medium text-yellow-600 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full">{task.proposed_hours} ч.</span>
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

        <Card className="shadow-lg hover:shadow-2xl transition-all border-2 border-yellow-100 dark:border-yellow-900 animate-fade-in-up delay-100">
          <CardHeader>
            <CardTitle>✨ Последние услуги</CardTitle>
            <CardDescription>Открой для себя новые сервисы и предложения!</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="animate-pulse text-center">Загрузка сервисов...</div>}>
              <div className="space-y-4">
                {services.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 animate-fade-in">Пока нет услуг — добавь свою и получи первые отзывы!</div>
                ) : services.map((service) => (
                  <div key={service.id} className="border rounded-xl p-5 bg-muted/50 hover:bg-yellow-50 dark:hover:bg-yellow-900 transition-all flex flex-col gap-2 animate-fade-in-up">
                    <h3 className="font-semibold text-lg mb-1 truncate">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{service.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-medium text-yellow-600 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full">{service.hourly_rate} ч./час</span>
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