"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CreditCard, Loader2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

type CheckoutResponse = {
  success: boolean;
  key_id: string;
  order_id: string;
  amount: number;
  currency: string;
  installation_id: string;
  plan: "monthly" | "annual";
};

export default function BillingPage() {
  const searchParams = useSearchParams();
  const [installationId, setInstallationId] = useState("");
  const [plan, setPlan] = useState<"monthly" | "annual">("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialPlan = searchParams.get("plan");
    const initialInstall = searchParams.get("installation_id");
    if (initialPlan === "annual" || initialPlan === "monthly") {
      setPlan(initialPlan);
    }
    if (initialInstall) {
      setInstallationId(initialInstall);
    }
  }, [searchParams]);

  useEffect(() => {
    const existing = document.querySelector("script[data-razorpay]");
    if (existing) {
      setIsReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpay = "true";
    script.onload = () => setIsReady(true);
    script.onerror = () => setError("Failed to load Razorpay checkout.");
    document.body.appendChild(script);
  }, []);

  const priceLabel = useMemo(() => {
    return plan === "annual" ? "₹8,600 / year" : "₹900 / month";
  }, [plan]);

  const handlePay = async () => {
    setError(null);
    if (!installationId.trim()) {
      setError("Installation ID is required to start checkout.");
      return;
    }
    if (!isReady) {
      setError("Checkout is still loading. Try again in a moment.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/razorpay-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          installation_id: installationId.trim(),
          plan,
        }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to start checkout");
      }

      const data = (await response.json()) as CheckoutResponse;

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Commitboy Pro",
        description:
          plan === "annual"
            ? "Annual subscription — unlimited commits"
            : "Monthly subscription — unlimited commits",
        order_id: data.order_id,
        handler: (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
        }) => {
          window.location.href = `/upgrade-success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`;
        },
        notes: {
          installation_id: data.installation_id,
          plan: data.plan,
        },
        theme: { color: "#0ea5e9" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-white">
      <section className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="surface px-8 py-10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Commitboy Billing
            </p>
            <h1 className="text-3xl md:text-4xl mt-4">Upgrade to Pro</h1>
            <p className="text-slate-300 mt-4">
              Unlock unlimited commits and remove the watermark in minutes.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="panel p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Installation ID
                </p>
                <input
                  value={installationId}
                  onChange={(event) => setInstallationId(event.target.value)}
                  placeholder="Paste your GitHub installation ID"
                  className="mt-3 w-full rounded-lg bg-slate-950/60 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <p className="text-xs text-slate-500 mt-3">
                  You get this after installing the GitHub App.
                </p>
              </div>
              <div className="panel p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Plan
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setPlan("monthly")}
                    className={`ghost-button ${
                      plan === "monthly" ? "border-sky-400 text-white" : ""
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlan("annual")}
                    className={`ghost-button ${
                      plan === "annual" ? "border-emerald-400 text-white" : ""
                    }`}
                  >
                    Annual (20% off)
                  </button>
                </div>
                <p className="text-slate-300 mt-4 text-lg">{priceLabel}</p>
              </div>
            </div>

            {error && (
              <div className="mt-6 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <button
                onClick={handlePay}
                disabled={isLoading}
                className="cta-button disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Opening checkout
                  </>
                ) : (
                  <>
                    Pay with Razorpay <CreditCard size={18} />
                  </>
                )}
              </button>
              <a
                href="https://razorpay.me/@commitboy"
                className="ghost-button"
                target="_blank"
                rel="noreferrer"
              >
                Pay via Razorpay link <ArrowRight size={18} />
              </a>
              <a href="/" className="ghost-button">
                Back to landing <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
