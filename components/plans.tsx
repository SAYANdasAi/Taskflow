"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

export default function Plans() {
  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out Taskflow",
      price: "$0",
      duration: "forever",
      features: [
        "5 document comparisons per month",
        "Basic text analysis",
        "PDF and JPG support",
        "Single user account",
        "Community support",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      description: "For professionals and educators",
      price: "$19",
      duration: "per month",
      features: [
        "Unlimited document comparisons",
        "Advanced analytics and visualizations",
        "All file formats supported",
        "OCR for image-based documents",
        "Priority email support",
        "Export results in multiple formats",
      ],
      buttonText: "Subscribe Now",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For organizations and institutions",
      price: "$49",
      duration: "per month",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Advanced security features",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 priority support",
        "Bulk document processing",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false,
    },
  ]

  return (
    <section className="container py-12 md:py-24" id="pricing">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">Simple, Transparent Pricing</h2>
        <p className="max-w-[85%] text-muted-foreground sm:text-lg">
          Choose the plan that's right for you and start comparing documents today.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className={`flex h-full flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}>
              <CardHeader>
                {plan.popular && (
                  <div className="mb-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary w-fit">
                    Most Popular
                  </div>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground"> / {plan.duration}</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={plan.buttonVariant} className="w-full">
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

