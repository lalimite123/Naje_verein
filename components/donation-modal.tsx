"use client"

import { useState } from "react"
import { X, Heart } from "lucide-react"

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"paypal" | "card">("paypal")
  const [amount, setAmount] = useState("50")

  if (!isOpen) return null

  const handleDonate = () => {
    if (selectedMethod === "paypal") {
      // PayPal integration would go here
      window.open(`https://www.paypal.com/donate?hosted_button_id=YOUR_BUTTON_ID&amount=${amount}`, "_blank")
    } else if (selectedMethod === "card") {
      // Stripe integration would go here
      console.log("Processing card donation:", amount)
    }
  }

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 px-6 md:px-8 py-6 md:py-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 md:w-7 md:h-7 text-white fill-white" />
              <h2 className="text-xl md:text-2xl font-bold text-white">Spenden</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-500/50 rounded-full transition-colors duration-300"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Description */}
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Ihre Spende unterstützt unsere Arbeit in Migration, Bildung, Kultur und Entwicklungspolitik weltweit.
            </p>

            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Spendenbetrag (€)</label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((value) => (
                  <button
                    key={value}
                    onClick={() => setAmount(value.toString())}
                    className={`py-2 px-3 rounded-lg font-medium transition-all duration-300 text-sm md:text-base ${
                      amount === value.toString()
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    €{value}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-500/20 text-sm md:text-base"
                placeholder="Benutzerdefinierten Betrag eingeben"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Zahlungsmethode</label>
              <div className="space-y-3">
                {/* PayPal */}
                <button
                  onClick={() => setSelectedMethod("paypal")}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${
                    selectedMethod === "paypal"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedMethod === "paypal" ? "border-red-600 bg-red-600" : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === "paypal" && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="font-semibold text-gray-900 text-sm md:text-base">PayPal</span>
                </button>

                {/* Credit Card */}
                <button
                  onClick={() => setSelectedMethod("card")}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${
                    selectedMethod === "card"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedMethod === "card" ? "border-red-600 bg-red-600" : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === "card" && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="font-semibold text-gray-900 text-sm md:text-base">Kreditkarte</span>
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleDonate}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 md:py-4 px-4 rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95 text-sm md:text-base"
            >
              €{amount} Spenden
            </button>

            {/* Footer Info */}
            <p className="text-xs md:text-sm text-gray-500 text-center leading-relaxed">
              Deine Spende ist sicher verschlüsselt. Der NaJe Verein ist eine gemeinnützige Organisation.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
