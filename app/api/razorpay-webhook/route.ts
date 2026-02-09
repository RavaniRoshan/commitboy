import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function verifySignature(body: string, signature: string, secret: string) {
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

/**
 * Razorpay Webhook Handler
 * Processes payment events from Razorpay
 *
 * POST /api/razorpay-webhook
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return NextResponse.json(
        { error: "Missing webhook signature or secret" },
        { status: 400 }
      );
    }

    const body = await request.text();
    if (!verifySignature(body, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const paymentEntity =
      event?.payload?.payment?.entity || event?.payload?.order?.entity;
    const installationId = paymentEntity?.notes?.installation_id;
    const plan = paymentEntity?.notes?.plan;

    console.log("Razorpay webhook received:", event?.event || "unknown");

    if (installationId) {
      // TODO: Update KV to Pro plan for this installation
      // const kv = require('@vercel/kv');
      // const installation = await kv.get(`installation:${installationId}`);
      // installation.plan = 'pro';
      // installation.razorpay_payment_id = paymentEntity?.id;
      // await kv.set(`installation:${installationId}`, installation);
      console.log(`Upgrade installation ${installationId} to Pro (${plan})`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed", message: error.message },
      { status: 400 }
    );
  }
}
