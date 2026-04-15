import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for teams of all sizes.",
};

const tiers = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for small training centers",
    features: [
      "Up to 50 students",
      "5 trainers",
      "Attendance tracking",
      "Basic reports",
      "Email support",
    ],
  },
  {
    name: "Professional",
    price: "$79",
    description: "For growing organizations",
    features: [
      "Up to 500 students",
      "Unlimited trainers",
      "Advanced analytics",
      "Grade management",
      "Priority support",
      "API access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale operations",
    features: [
      "Unlimited students",
      "Unlimited trainers",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "On-premise option",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Choose the plan that fits your organization. Upgrade anytime.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col rounded-2xl p-8 shadow-lg ring-1 ${
              tier.popular
                ? "ring-indigo-600 bg-white scale-105"
                : "ring-slate-200 bg-white"
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-semibold">{tier.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{tier.description}</p>
            <p className="mt-6">
              <span className="text-4xl font-bold">{tier.price}</span>
              {tier.price !== "Custom" && (
                <span className="text-sm text-slate-500">/month</span>
              )}
            </p>
            <ul className="mt-8 space-y-3 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <span className="text-indigo-600">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="/signup"
              className={`mt-8 block rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors ${
                tier.popular
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : "bg-slate-50 text-slate-900 hover:bg-slate-100 ring-1 ring-slate-200"
              }`}
            >
              {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
