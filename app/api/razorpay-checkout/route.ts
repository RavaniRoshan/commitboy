import { NextRequest, NextResponse } from "next/server";

type CheckoutRequest = {
  installation_id?: string;
  plan?: "monthly" | "annual";
};

function getAmount(plan: "monthly" | "annual") {
  const monthly = Number(process.env.RAZORPAY_PRO_MONTHLY_AMOUNT || 90000);
  const annual = Number(process.env.RAZORPAY_PRO_ANNUAL_AMOUNT || 860000);
  return plan === "annual" ? annual : monthly;
}

/**
 * Razorpay Checkout Handler
 * Creates an order for Pro plan upgrade
 *
 * POST /api/razorpay-checkout
 * Body: { installation_id: string, plan?: "monthly" | "annual" }
 */
export async function POST(request: NextRequest) {
  try {
    const { installation_id, plan = "monthly" } =
      (await request.json()) as CheckoutRequest;

    if (!installation_id) {
      return NextResponse.json(
        { error: "Installation ID is required" },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const currency = process.env.RAZORPAY_CURRENCY || "INR";

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials are missing" },
        { status: 500 }
      );
    }

    const amount = getAmount(plan);
    const receipt = `commitboy_${installation_id}_${Date.now()}`;

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt,
        notes: {
          installation_id,
          plan,
        },
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      return NextResponse.json(
        { error: "Failed to create Razorpay order", message },
        { status: 500 }
      );
    }

    const order = await response.json();

    return NextResponse.json({
      success: true,
      key_id: keyId,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      installation_id,
      plan,
    });
  } catch (error: any) {
    console.error("Razorpay checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order", message: error.message },
      { status: 500 }
    );
  }
}
