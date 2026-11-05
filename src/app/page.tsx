import React from 'react';
import type { Metadata } from 'next';
import { HeroSlider } from '../components/home/HeroSlider';
import { NewArrivals } from '../components/home/NewArrivals';
import { HowItWorks } from '../components/home/HowItWorks';
import { BookCategories } from '../components/home/BookCategories';

export const metadata: Metadata = {
  title: 'BookNook - Your Online Library',
  description: 'Welcome to BookNook - Discover classics, modern treatises, science, and history in our digital library collection.',
};

export default function HomePage() {
  return (
    <>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Dynamic New Arrivals */}
      <NewArrivals />

      {/* How Borrowing Works */}
      <HowItWorks />

      {/* Book Categories */}
      <BookCategories />
    </>
  );
}
