/* eslint-disable no-unused-vars */
import React from 'react'
import { Separator } from '../components/ui/separator'
import Navbar from '../components/LandingPageComponents/Navbar'
import CTA from '../components/LandingPageComponents/CTA'
import HeroSection from '../components/LandingPageComponents/HeroSection'
import Features from '../components/LandingPageComponents/Features'
import FAQ from '../components/LandingPageComponents/FAQ'
import Footer from '../components/LandingPageComponents/Footer'
import { BackgroundLines } from '@/components/ui/background-lines'
import { SparklesCore } from '@/components/ui/sparkles'

const LandingPage = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#171717] text-white">
      <div className="fixed inset-0 -z-10">
        </div>
      <div className="relative z-10 w-full">
        <Navbar />
        <HeroSection />
        <CTA />
        <Features />
        <FAQ />
        <div className="py-2 px-4 md:px-8">
          <Separator />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default LandingPage
