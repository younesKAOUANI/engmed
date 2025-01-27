import About from '@/components/pages/LandingPage/About'
import ContactUs from '@/components/pages/LandingPage/ContactUs'
import FeaturedCourses from '@/components/pages/LandingPage/FeaturedCourses'
import Hero from '@/components/pages/LandingPage/Hero'
import LandingFooter from '@/components/pages/LandingPage/LandingFooter'
import LandingHeader from '@/components/pages/LandingPage/LandingHeader'
import Testimonials from '@/components/pages/LandingPage/Testimonials'
import React from 'react'

export default function index() {
  return (
    <>
      <LandingHeader />
      <Hero />
      <About />
      <FeaturedCourses />
      <Testimonials />
      <ContactUs />
      <LandingFooter />
    </>
  )
}

