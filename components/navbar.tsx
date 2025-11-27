"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navItems = [
    { label: "Projekte", href: "#" },
    { label: "Stadtteilfest Rothenburgsorgt", href: "#" },
    { label: "NaJe Festival", href: "#" },
    { label: "Über NaJe", href: "#" },
    { label: "Mach Mit", href: "#" },
  ]

  return (
    <nav
      className={`fixed left-1/2 -translate-x-1/2 z-50 px-4 md:px-6 w-full max-w-7xl transition-all duration-700 ease-in-out ${
        isVisible ? "top-4 md:top-8 opacity-100" : "-top-24 opacity-0"
      }`}
    >
      <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-full px-4 md:px-8 py-2 md:py-3 flex items-center justify-between shadow-lg w-full">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Image src="/logo-naje.png" alt="NaJe e.V." width={120} height={40} className="h-8 md:h-10 w-auto" />
        </div>

        {/* Desktop Menu Links */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 hover:text-red-600 transition-colors duration-300 font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Donate Button - Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="#donate"
            onClick={(e) => {
              e.preventDefault()
              window.dispatchEvent(new CustomEvent("open-donation"))
            }}
            className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            Spenden
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex items-center justify-center p-2 text-gray-700 hover:text-red-600 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl p-4 shadow-lg">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-300 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2">
              <Link
                href="#donate"
                className="block w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all duration-300 text-center"
                onClick={(e) => {
                  e.preventDefault()
                  window.dispatchEvent(new CustomEvent("open-donation"))
                  setIsMobileMenuOpen(false)
                }}
              >
                Spenden
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
