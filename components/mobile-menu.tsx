"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="text-white p-2 hover:bg-white/5 rounded-full transition-colors">
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 bg-black/80 backdrop-blur border border-white/10 rounded-lg py-4 min-w-56 shadow-lg">
          <Link
            href="#resources"
            className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
          >
            Resources
          </Link>
          <Link
            href="#tools"
            className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
          >
            Tools
          </Link>
          <Link
            href="/contact"
            className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
          >
            Contact
          </Link>
        </div>
      )}
    </div>
  )
}
