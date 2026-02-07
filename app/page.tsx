"use client"

import { useState, useEffect } from "react"
import { StepOneInvest } from "@/components/step-one-invest"
import { StepTwoDetails } from "@/components/step-two-details"
import { FALLBACK_CONFIG, type InvestmentConfig } from "@/lib/investment-utils"

export default function InvestmentPage() {
  const [step, setStep] = useState(1)
  const [config, setConfig] = useState<InvestmentConfig>(FALLBACK_CONFIG)
  const [configLoaded, setConfigLoaded] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(FALLBACK_CONFIG.presetAmounts[0])

  useEffect(() => {
    fetch("/api/deal")
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setConfig(data.config)
          setSelectedAmount(data.config.presetAmounts[0])
        }
      })
      .catch(() => {})
      .finally(() => setConfigLoaded(true))
  }, [])

  const handleContinueFromStepOne = (amount: number) => {
    setSelectedAmount(amount)
    setStep(2)
  }

  const handleBackToStepOne = () => {
    setStep(1)
  }

  const handleContinueToPayment = (amount: number) => {
    // Payment flow
  }

  if (step === 1) {
    return (
      <StepOneInvest
        initialAmount={selectedAmount}
        onContinue={handleContinueFromStepOne}
        config={config}
      />
    )
  }

  return (
    <StepTwoDetails
      initialAmount={selectedAmount}
      onBack={handleBackToStepOne}
      onContinue={handleContinueToPayment}
      config={config}
    />
  )
}
