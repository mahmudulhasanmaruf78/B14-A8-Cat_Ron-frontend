'use client';

import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    id: 1,
    heading: 'Discover Your Next Favorite Book',
    description: 'Explore a world of stories, knowledge, and inspiration. Find books that move you, teach you, and stay with you forever.',
    bg: 'from-amber-900/80 via-amber-800/60 to-zinc-900/90',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80&fit=crop',
  },
  {
    id: 2,
    heading: 'Every Book Has a New Journey',
    description: 'Find interesting books and share your reading experience. Begin a new adventure with every page you turn.',
    bg: 'from-zinc-900/85 via-blue-900/50 to-zinc-900/90',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80&fit=crop',
  },
  {
    id: 3,
    heading: 'Read More, Learn More',
    description: 'Build your reading habit with BookNook. Access a curated library of books across every genre and discipline.',
    bg: 'from-emerald-900/80 via-zinc-900/60 to-zinc-900/90',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&q=80&fit=crop',
  },
];

export function HeroSlider() {
  return (
    <section className="relative w-full overflow-hidden" aria-label="Featured books slider">
      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
          background: rgba(0,0,0,0.3);
          width: 44px !important;
          height: 44px !important;
          border-radius: 50%;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.15);
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 16px !important;
          font-weight: 700;
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5 !important;
          width: 8px !important;
          height: 8px !important;
        }
        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          width: 24px !important;
          border-radius: 4px !important;
          transition: width 0.3s ease !important;
        }
      `}</style>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        effect="fade"
        className="w-full"
        style={{ height: 'clamp(420px, 65vh, 680px)' }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
                aria-hidden="true"
              />
              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`} aria-hidden="true" />

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
                  <div className="max-w-2xl space-y-6">
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                      BookNook Library
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                      {slide.heading}
                    </h1>
                    <p className="text-base sm:text-lg text-zinc-200 leading-relaxed max-w-xl">
                      {slide.description}
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/books"
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 transition-all duration-200 hover:scale-105 hover:shadow-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-transparent"
                      >
                        Browse Books
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
