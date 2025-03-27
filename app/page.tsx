import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import AppPreview from "@/components/app-preview"
import Features from "@/components/features"
import Reviews from "@/components/reviews"
import Team from "@/components/team"
import Newsletter from "@/components/newsletter"
import Footer from "@/components/footer"

import styles from "@/styles/home.module.css"

export const dynamic = "force-static"
export const revalidate = 3600 // Revalidate every hour

export default function Home() {
  return (
    <div className={styles.homePage}>
      <Navbar />
      <Hero />
      <AppPreview />
      <Features />
      <Reviews />
      <Team />
      <Newsletter />
      <Footer />
    </div>
  )
}

