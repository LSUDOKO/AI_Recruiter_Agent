import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Log the webhook data for debugging
    console.log("JotForm Webhook received:", body)

    // Here you can process the webhook data
    // For example, send notifications, update database, etc.

    // The webhook payload typically contains:
    // - submissionID: The ID of the submission
    // - formID: The ID of the form
    // - rawRequest: The raw form data
    // - pretty: Formatted form data

    // You can add your custom logic here
    // For example:
    // - Send email notifications
    // - Update your database
    // - Trigger AI processing
    // - Send to other services

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
    })
  } catch (error) {
    console.error("Error processing JotForm webhook:", error)
    return NextResponse.json({ success: false, error: "Failed to process webhook" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "JotForm webhook endpoint is active",
    timestamp: new Date().toISOString(),
  })
}
