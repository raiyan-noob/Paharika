"use client";
import FeaturedDestinations from '@/components/FeaturedDestinations';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';

import Testimonials from '@/components/Testimonials';
import WhyChooseUs from '@/components/WhyChooseUs';
import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content selection:bg-emerald-500 selection:text-white">
      <HeroSection />
      <FeaturedDestinations />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      
    </div>
  );
};

export default Home;
