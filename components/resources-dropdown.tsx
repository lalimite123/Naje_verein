"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export function ResourcesDropdown() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative group">
      <button className="px-4 py-2 rounded-full text-white/80 hover:text-white flex items-center gap-2 transition-colors text-sm">
        Resources
        <ChevronDown className="w-4 h-4" />
      </button>
      <div className="absolute hidden group-hover:block top-full mt-2 left-0 bg-black/80 backdrop-blur border border-white/10 rounded-lg py-2 min-w-48 shadow-lg">
        <Link
          href="#docs"
          className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 text-sm transition-colors"
        >
          Documentation
        </Link>
        <Link
          href="#blog"
          className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 text-sm transition-colors"
        >
          Blog
        </Link>
        <Link
          href="#guides"
          className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 text-sm transition-colors"
        >
          Guides
        </Link>
      </div>
    </div>
  )
}
