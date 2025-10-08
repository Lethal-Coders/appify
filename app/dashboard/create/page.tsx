import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Header from '@/components/Header'
import CreateProjectForm from '@/components/CreateProjectForm'

export default async function CreateProject() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/create')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={session.user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New App
          </h1>
          <p className="text-gray-600 mb-8">
            Fill in the details below to generate your mobile app
          </p>

          <CreateProjectForm userId={session.user?.id} />
        </div>
      </main>
    </div>
  )
}
