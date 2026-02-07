"use client"

import { useState } from "react"
import { Check, ChevronDown, ChevronUp, RefreshCw } from "lucide-react"
import {
  FALLBACK_CONFIG,
  calculateInvestment,
  formatCurrency,
  formatNumber,
  type InvestmentConfig,
} from "@/lib/investment-utils"

interface StepTwoDetailsProps {
  initialAmount: number
  onBack: () => void
  onContinue: (amount: number) => void
  config?: InvestmentConfig
}

type Section = "investment" | "contact" | "confirmation" | "payment"

export function StepTwoDetails({ initialAmount, onBack, onContinue, config = FALLBACK_CONFIG }: StepTwoDetailsProps) {
  const [amount, setAmount] = useState(initialAmount)
  const [shares, setShares] = useState(() => {
    const calc = calculateInvestment(initialAmount, config)
    return calc.baseShares
  })
  const [expandedSection, setExpandedSection] = useState<Section>("investment")
  const [completedSections, setCompletedSections] = useState<Section[]>([])

  // Contact form state
  const [investorType] = useState("individual")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const calculation = calculateInvestment(amount, config)

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value.replace(/[,$]/g, "")) || 0
    setAmount(numValue)
    const calc = calculateInvestment(numValue, config)
    setShares(calc.baseShares)
  }

  const handleSharesChange = (value: string) => {
    const numValue = parseInt(value.replace(/,/g, "")) || 0
    setShares(numValue)
    const newAmount = numValue * config.sharePrice
    setAmount(newAmount)
  }

  const handleSectionContinue = (currentSection: Section) => {
    if (!completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection])
    }
    
    const sectionOrder: Section[] = ["investment", "contact", "confirmation", "payment"]
    const currentIndex = sectionOrder.indexOf(currentSection)
    if (currentIndex < sectionOrder.length - 1) {
      setExpandedSection(sectionOrder[currentIndex + 1])
    }
  }

  const toggleSection = (section: Section) => {
    setExpandedSection(expandedSection === section ? section : section)
  }

  const isSectionComplete = (section: Section) => completedSections.includes(section)

  return (
    <div className="step2-page min-h-screen flex items-start justify-center p-4 pt-8 pb-8 bg-[#f9fafb]">
      <div className="step2-container w-full max-w-xl">
        {/* Main Card */}
        <div className="step2-card bg-white rounded-3xl overflow-hidden shadow-sm border-2 border-[#c96b4b]">
          
          {/* Section 1: Investment Amount */}
          <div className="step2-section step2-section--investment border-b border-[#f3f4f6]">
            <button
              type="button"
              onClick={() => toggleSection("investment")}
              className="step2-section__header w-full px-6 py-4 flex items-center justify-between bg-transparent border-none cursor-pointer"
            >
              <div className="step2-section__title-group flex items-center gap-3">
                {isSectionComplete("investment") ? (
                  <Check className="step2-section__icon step2-section__icon--success w-5 h-5 text-green-500" />
                ) : (
                  <span className="step2-section__checkbox w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
                <span className="step2-section__title text-lg font-semibold text-[#1a1a1a]">1. Investment Amount</span>
              </div>
              {expandedSection === "investment" ? (
                <ChevronUp className="step2-section__chevron w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="step2-section__chevron w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {expandedSection === "investment" && (
              <div className="step2-section__content px-6 pb-6">
                {/* Share Price Info */}
                <div className="step2-share-price flex items-center gap-2 mb-2">
                  <RefreshCw className="step2-share-price__icon w-4 h-4 text-gray-400" />
                  <span className="step2-share-price__text text-gray-700">
                    1 {config.securityType || "Common Stock"} = <span className="step2-share-price__value font-semibold">${config.sharePrice.toFixed(2)} USD</span>
                  </span>
                </div>
                
                <p className="step2-share-price__note text-sm text-gray-500 mb-4">
                  Investment amount will be rounded up if required
                </p>

                {/* Amount Input */}
                <input
                  type="text"
                  value={`$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="step2-input step2-input--amount w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-lg mb-3 focus:outline-none focus:border-[#c96b4b] focus:ring-[3px] focus:ring-[#c96b4b]/15 transition-all"
                />

                {/* Shares Input */}
                <input
                  type="text"
                  value={formatNumber(shares)}
                  onChange={(e) => handleSharesChange(e.target.value)}
                  className="step2-input step2-input--shares w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-lg mb-3 focus:outline-none focus:border-[#c96b4b] focus:ring-[3px] focus:ring-[#c96b4b]/15 transition-all"
                />

                {/* Bonus Info */}
                {calculation.bonusPercent > 0 && (
                  <div className="step2-bonus-info bg-[#fff5f2] border border-[#f5c4b8] rounded-lg p-3 mb-4">
                    <p className="step2-bonus-info__text text-sm text-[#c96b4b]">
                      You qualify for <span className="step2-bonus-info__highlight font-semibold">{calculation.bonusPercent}% bonus</span> = +{formatNumber(calculation.bonusShares)} free shares!
                    </p>
                  </div>
                )}

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={() => handleSectionContinue("investment")}
                  className="step2-btn step2-btn--continue w-full py-3.5 rounded-lg text-lg font-semibold bg-[#c96b4b] text-white hover:bg-[#b85d40] transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Contact Information */}
          <div className="step2-section step2-section--contact border-b border-[#f3f4f6]">
            <button
              type="button"
              onClick={() => toggleSection("contact")}
              className="step2-section__header w-full px-6 py-4 flex items-center justify-between bg-transparent border-none cursor-pointer"
            >
              <div className="step2-section__title-group flex items-center gap-3">
                {isSectionComplete("contact") ? (
                  <Check className="step2-section__icon step2-section__icon--success w-5 h-5 text-green-500" />
                ) : (
                  <span className="step2-section__checkbox w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
                <span className="step2-section__title text-lg font-semibold text-[#1a1a1a]">2. Contact Information</span>
              </div>
              {expandedSection === "contact" ? (
                <ChevronUp className="step2-section__chevron w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="step2-section__chevron w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {expandedSection === "contact" && (
              <div className="step2-section__content px-6 pb-6">
                <p className="step2-contact__type font-semibold text-[#1a1a1a] mb-2">Individual Investor</p>
                
                <div className="step2-contact-fields space-y-4 mb-6">
                  <div className="step2-contact-field flex justify-between items-center py-2 border-b border-[#f3f4f6]">
                    <span className="step2-contact-field__label text-gray-500">Name</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name"
                      className="step2-contact-field__input text-right bg-transparent border-none text-[#1a1a1a] focus:outline-none"
                    />
                  </div>
                  <div className="step2-contact-field flex justify-between items-center py-2 border-b border-[#f3f4f6]">
                    <span className="step2-contact-field__label text-gray-500">Phone Number</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone"
                      className="step2-contact-field__input text-right bg-transparent border-none text-[#1a1a1a] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSectionContinue("contact")}
                  className="step2-btn step2-btn--continue w-full py-3.5 rounded-lg text-lg font-semibold bg-[#c96b4b] text-white hover:bg-[#b85d40] transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
            
            {/* Show summary when collapsed but completed */}
            {expandedSection !== "contact" && isSectionComplete("contact") && (
              <div className="step2-contact-summary px-6 pb-4">
                <p className="step2-contact-summary__type font-semibold text-[#1a1a1a] mb-2">Individual Investor</p>
                <div className="step2-contact-summary__rows space-y-1">
                  <div className="step2-contact-summary__row flex justify-between text-sm">
                    <span className="step2-contact-summary__label text-gray-500">Name</span>
                    <span className="step2-contact-summary__value text-[#1a1a1a]">{name || "—"}</span>
                  </div>
                  <div className="step2-contact-summary__row flex justify-between text-sm">
                    <span className="step2-contact-summary__label text-gray-500">Phone Number</span>
                    <span className="step2-contact-summary__value text-[#1a1a1a]">{phone || "—"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Investor Confirmation */}
          <div className="step2-section step2-section--confirmation border-b border-[#f3f4f6]">
            <button
              type="button"
              onClick={() => toggleSection("confirmation")}
              className="step2-section__header w-full px-6 py-4 flex items-center justify-between bg-transparent border-none cursor-pointer"
            >
              <div className="step2-section__title-group flex items-center gap-3">
                {isSectionComplete("confirmation") ? (
                  <Check className="step2-section__icon step2-section__icon--success w-5 h-5 text-green-500" />
                ) : (
                  <span className="step2-section__checkbox w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
                <span className="step2-section__title text-lg font-semibold text-[#1a1a1a]">3. Investor Confirmation</span>
              </div>
              {expandedSection === "confirmation" ? (
                <ChevronUp className="step2-section__chevron w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="step2-section__chevron w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {expandedSection === "confirmation" && (
              <div className="step2-section__content px-6 pb-6">
                <p className="step2-confirmation__text text-sm text-gray-500 mb-4">
                  By continuing, I confirm that I have reviewed the offering materials and understand
                  the risks associated with this investment.
                </p>
                
                <button
                  type="button"
                  onClick={() => handleSectionContinue("confirmation")}
                  className="step2-btn step2-btn--continue w-full py-3.5 rounded-lg text-lg font-semibold bg-[#c96b4b] text-white hover:bg-[#b85d40] transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Payment */}
          <div className="step2-section step2-section--payment">
            <button
              type="button"
              onClick={() => toggleSection("payment")}
              className="step2-section__header w-full px-6 py-4 flex items-center justify-between bg-transparent border-none cursor-pointer"
            >
              <div className="step2-section__title-group flex items-center gap-3">
                {isSectionComplete("payment") ? (
                  <Check className="step2-section__icon step2-section__icon--success w-5 h-5 text-green-500" />
                ) : (
                  <span className="step2-section__checkbox w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
                <span className="step2-section__title text-lg font-semibold text-[#1a1a1a]">4. Payment</span>
              </div>
              {expandedSection === "payment" ? (
                <ChevronUp className="step2-section__chevron w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="step2-section__chevron w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {expandedSection === "payment" && (
              <div className="step2-section__content px-6 pb-6">
                <p className="step2-payment__text text-sm text-gray-500 mb-4">
                  Complete your investment by selecting a payment method.
                </p>
                
                <button
                  type="button"
                  onClick={() => onContinue(amount)}
                  className="step2-btn step2-btn--complete w-full py-3.5 rounded-lg text-lg font-semibold bg-[#c96b4b] text-white hover:bg-[#b85d40] transition-colors"
                >
                  Complete Investment
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="step2-footer text-center mt-6">
          <div className="step2-footer__links flex items-center justify-center gap-2 text-sm">
            <a href="#" className="step2-footer__link text-[#c96b4b] hover:underline">Download Contract</a>
            <span className="step2-footer__separator text-gray-300">•</span>
            <a href="#" className="step2-footer__link text-[#c96b4b] hover:underline">Download Offering Circular</a>
            <span className="step2-footer__separator text-gray-300">•</span>
            <a href="#" className="step2-footer__link text-[#c96b4b] hover:underline">Additional documents</a>
          </div>
        </div>
      </div>
    </div>
  )
}
