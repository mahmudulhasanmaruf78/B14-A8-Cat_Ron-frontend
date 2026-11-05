import React from 'react';

const steps = [
  {
    step: '01',
    title: 'Discover a Book',
    description: 'Explore our curated collection and find a book you love. Filter by genre, author, or category to narrow your search.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    color: 'from-amber-500 to-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800/50',
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    step: '02',
    title: 'Borrow Your Book',
    description: 'Choose a book and complete the simple borrowing process. Keep track of due dates and manage your reading list easily.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'from-blue-500 to-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800/50',
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    step: '03',
    title: 'Enjoy and Return',
    description: 'Read your book at your own pace and return it when you are done. Leave a review to help other readers discover great books.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    color: 'from-emerald-500 to-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white dark:bg-zinc-950" aria-labelledby="how-it-works-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Simple Process
          </span>
          <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            How Borrowing Works
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Getting your next great read is just three simple steps away.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {steps.map((step) => (
            <div
              key={step.step}
              className={`relative z-10 rounded-2xl border ${step.border} ${step.bg} p-8 space-y-5 hover:shadow-lg transition-shadow duration-300`}
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 rounded-2xl ${step.iconBg} flex items-center justify-center`}>
                  {step.icon}
                </div>
                <span className={`text-5xl font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent opacity-30`}>
                  {step.step}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
