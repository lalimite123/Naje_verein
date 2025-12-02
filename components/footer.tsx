"use client"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-20 border-t border-zinc-800 bg-black py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Organization Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">NaJe Verein</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Eine zivilgesellschaftliche Organisation, die sich weltweit für Migration, Bildung, Kultur und nachhaltige
              Entwicklung einsetzt.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-red-400 transition-colors">
                  Über uns
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-red-400 transition-colors">
                  Unsere Projekte
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-red-400 transition-colors">
                  Partner
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-red-400 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Work Areas */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Arbeitsbereiche</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-red-400 transition-colors">
                  Migration
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-red-400 transition-colors">
                  Bildung
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-red-400 transition-colors">
                  Kultur
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-red-400 transition-colors">
                  Entwicklung
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Kontakt</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:info@naje-verein.de"
                  className="text-sm text-zinc-400 hover:text-red-400 transition-colors"
                >
                  info@naje-verein.de
                </a>
              </li>
              <li className="text-sm text-zinc-400">Deutschland</li>
              <li className="pt-2">
                <div className="flex gap-4">
                  <a href="#" className="text-zinc-400 hover:text-red-400 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="#" className="text-zinc-400 hover:text-red-400 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 002.856-3.51 9.958 9.958 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                </div>
              </li>
          <li className="pt-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-donation"))}
              className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all duration-300"
            >
              Spenden
            </button>
          </li>
          <li className="pt-2">
            <a
              href="/login"
              className="px-5 py-2 inline-block rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-all duration-300"
            >
              Connexion
            </a>
          </li>
        </ul>
      </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-zinc-500">© {currentYear} NaJe Verein. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-400 transition-colors">
              Datenschutz
            </a>
            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-400 transition-colors">
              Impressum
            </a>
            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-400 transition-colors">
              Kontakt
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
