import { NextRequest, NextResponse } from 'next/server';

/**
 * Stripe Webhook Handler
 * Processes subscription events from Stripe
 * 
 * POST /api/stripe-webhook
 */
export async function POST(request: NextRequest) {
  try {
    // Get the signature from headers
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // TODO: Initialize Stripe
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    // Verify webhook signature
    // const event = stripe.webhooks.constructEvent(
    //   await request.text(),
    //   signature,
    //   process.env.STRIPE_WEBHOOK_SECRET
    // );

    // Mock event parsing
    const body = await request.json();
    const event = { type: body.type, data: body.data };

    console.log('Stripe webhook received:', event.type);

    // TODO: Get KV instance
    // const kv = require('@vercel/kv');

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const installationId = session.metadata?.installation_id;
        
        if (installationId) {
          // Update installation to Pro plan
          // const installation = await kv.get(`installation:${installationId}`);
          // installation.plan = 'pro';
          // installation.stripe_customer_id = session.customer;
          // await kv.set(`installation:${installationId}`, installation);
          
          console.log(`Upgraded installation ${installationId} to Pro`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Find installation by customer ID
        // const installations = await kv.keys('installation:*');
        // for (const key of installations) {
        //   const installation = await kv.get(key);
        //   if (installation.stripe_customer_id === customerId) {
        //     installation.plan = 'free';
        //     installation.commits_this_month = 0;
        //     await kv.set(key, installation);
        //     console.log(`Downgraded installation to Free`);
        //     break;
        //   }
        // }
        
        console.log(`Subscription cancelled for customer ${customerId}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        
        console.log(`Payment failed for customer ${customerId}`);
        // Could send email notification here
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', message: error.message },
      { status: 400 }
    );
  }
}