import React from 'react'
import { Separator } from '../components/ui/separator'
import Navbar from '../components/LandingPageComponents/Navbar'
import CTA from '../components/LandingPageComponents/CTA'
import HeroSection from '../components/LandingPageComponents/HeroSection'
import Features from '../components/LandingPageComponents/Features'
import FAQ from '../components/LandingPageComponents/FAQ'
import Footer from '../components/LandingPageComponents/Footer'

const LandingPage = () => {
  return (
    <div className='w-full'>
      <Navbar />
      <HeroSection />
      <CTA />
      <Features />
      <FAQ />
      <div className='py-2 px-4 md:px-8'>
        <Separator />
      </div>
      <Footer />
    </div>
  )
}

export default LandingPage
