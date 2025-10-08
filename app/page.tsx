import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Website Into a Mobile App
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create native iOS and Android apps from your website in minutes.
            No coding required.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <Link
              href="/auth/signin"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold border-2 border-primary hover:bg-blue-50 transition"
            >
              View Dashboard
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-2">Enter Your URL</h3>
              <p className="text-gray-600">
                Simply provide your website URL and we'll handle the rest
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Customize</h3>
              <p className="text-gray-600">
                Add your app icon, splash screen, and branding
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Download</h3>
              <p className="text-gray-600">
                Get your ready-to-use mobile app for iOS and Android
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
