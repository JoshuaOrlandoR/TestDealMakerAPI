import { NextResponse } from "next/server"
import {
  createIndividualProfile,
  createDealInvestor,
  updateDealInvestor,
  isDealmakerConfigured,
} from "@/lib/dealmaker"

export async function POST(request: Request) {
  if (!isDealmakerConfigured()) {
    return NextResponse.json(
      { error: "DealMaker is not configured. Add API credentials to proceed." },
      { status: 503 }
    )
  }

  const dealId = process.env.DEALMAKER_DEAL_ID!
  const body = await request.json()

  try {
    const profile = await createIndividualProfile({
      email: body.email,
      first_name: body.firstName,
      last_name: body.lastName,
      phone_number: body.phone,
    })

    const investor = await createDealInvestor(dealId, {
      email: body.email,
      investor_profile_id: profile.id,
      investment_value: body.investmentAmount,
      allocation_unit: "amount",
    })

    return NextResponse.json({
      profileId: profile.id,
      investorId: investor.id,
      subscriptionId: investor.subscription_id,
      state: investor.state,
    })
  } catch (error) {
    console.error("Failed to create investor:", error)
    return NextResponse.json(
      { error: "Failed to create investor record" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  if (!isDealmakerConfigured()) {
    return NextResponse.json(
      { error: "DealMaker is not configured" },
      { status: 503 }
    )
  }

  const dealId = process.env.DEALMAKER_DEAL_ID!
  const body = await request.json()

  try {
    const updated = await updateDealInvestor(dealId, body.investorId, {
      current_step: body.currentStep,
    })

    return NextResponse.json({
      investorId: updated.id,
      state: updated.state,
      currentStep: updated.current_step,
    })
  } catch (error) {
    console.error("Failed to update investor:", error)
    return NextResponse.json(
      { error: "Failed to update investor record" },
      { status: 500 }
    )
  }
}
