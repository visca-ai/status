import type { NextPage } from 'next'
import Image from 'next/image'
import IncidentsSection from "../src/incidents"
import ServicesSection from "../src/services"

const Home: NextPage = () => {
  return (
    <div className='min-h-screen bg-white dark:bg-black'>
      {/* Minimal Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Image src="/wirtual-icon.png" width={32} height={32} className="w-8 h-8 rounded-md" alt="Visca AI" />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Visca AI Systems Status</h1>
          </div>
        </div>
      </header>

      {/* Clean Content */}
      <main className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <ServicesSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">Powered by GitHub Actions • Updated every 7 minutes</p>
        </div>
      </footer>
    </div>
  )
}

export default Home;
