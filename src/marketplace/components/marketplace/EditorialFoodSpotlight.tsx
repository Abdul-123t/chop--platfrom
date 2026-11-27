import React, { useState } from 'react';
import { ArrowRight, Sparkles, BookOpen, Heart, Flame } from 'lucide-react';
import { EDITORIAL_STORIES } from '../../lib/constants';
import { EditorialFoodStory } from '../../types';

export const EditorialFoodSpotlight: React.FC = () => {
  const [activeStory, setActiveStory] = useState<EditorialFoodStory>(EDITORIAL_STORIES[0]);

  const handleScrollToCategories = () => {
    const el = document.getElementById('food-categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuredStory = EDITORIAL_STORIES[0];
  const supportingStories = EDITORIAL_STORIES.slice(1);

  return (
    <section
      id="chop-food-stories"
      className="py-16 sm:py-24 bg-[#F7F6F2] border-t border-[#E6E2DA]/80 relative overflow-hidden"
      aria-label="CHOP Food Stories Editorial Spotlight"
    >
      {/* Subtle background paper texture accent */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#141414_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Editorial Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 sm:pb-16 border-b border-[#E6E2DA]">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E6E2DA] text-[11px] font-bold uppercase tracking-widest text-[#C45B3A] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C45B3A]" />
              <span>CHOP FOOD STORIES</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#141414] tracking-tight leading-[1.1]">
              A taste of Ijebu. <br className="hidden sm:inline" />
              <span className="text-[#C45B3A]">A world of flavour.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#77736C] font-normal leading-relaxed pt-1">
              Discover the dishes, traditions and food experiences that make our local food culture special.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              type="button"
              onClick={handleScrollToCategories}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#141414] hover:text-[#C45B3A] bg-white hover:bg-[#F0EEE8] border border-[#E6E2DA] px-5 py-3 rounded-full shadow-xs transition-all active:scale-95 group"
            >
              <span>Explore Food Categories</span>
              <ArrowRight className="w-4 h-4 text-[#C45B3A] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── Subtle Distinction & Food Culture Integrity Banner ── */}
        <div className="py-4 text-center sm:text-left flex items-center justify-between border-b border-[#E6E2DA]/60 mb-10 text-[11px] text-[#77736C]">
          <span className="flex items-center gap-1.5 mx-auto sm:mx-0 italic font-medium">
            <BookOpen className="w-3.5 h-3.5 text-[#C45B3A] shrink-0" />
            Food inspiration, celebrating the flavours and traditions that inspire CHOP.
          </span>
          <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider text-[#77736C]/70">
            Editorial Feature &bull; Vol. 1
          </span>
        </div>

        {/* ── Editorial Layout: Large Featured Story + 3 Supporting Stories ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

          {/* ── LEFT: Story 01 — Featured Story ── */}
          <article
            className="lg:col-span-7 bg-white rounded-3xl border border-[#E6E2DA] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#141414]/20 transition-all group relative overflow-hidden"
            aria-labelledby="featured-story-title"
          >
            {/* Top Badge & Number */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#141414] text-white">
                {featuredStory.editorialCategory}
              </span>
              <span className="font-display text-xs font-bold text-[#77736C] tracking-widest">
                STORY {featuredStory.number}
              </span>
            </div>

            {/* Featured Image with Editorial Framing */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6 bg-[#F0EEE8]">
              <img
                src={featuredStory.imageUrl}
                alt={featuredStory.imageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-[#C45B3A]" />
                <span>{featuredStory.culturalNote || 'Culinary Inspiration'}</span>
              </div>
            </div>

            {/* Headline & Description */}
            <div className="space-y-3">
              <h3
                id="featured-story-title"
                className="font-display text-2xl sm:text-3xl font-extrabold text-[#141414] tracking-tight group-hover:text-[#C45B3A] transition-colors leading-snug"
              >
                {featuredStory.title}
              </h3>

              <p className="text-sm sm:text-base text-[#77736C] leading-relaxed">
                {featuredStory.description}
              </p>
            </div>

            {/* Editorial Footer Cue */}
            <div className="pt-6 mt-6 border-t border-[#E6E2DA] flex items-center justify-between text-xs text-[#77736C]">
              <span className="font-semibold text-[#141414]">Celebration &amp; Gatherings</span>
              <button
                type="button"
                onClick={handleScrollToCategories}
                className="text-[#C45B3A] font-bold inline-flex items-center gap-1 hover:underline"
              >
                Discover related categories &rarr;
              </button>
            </div>
          </article>

          {/* ── RIGHT: Supporting Stories 02, 03, 04 ── */}
          <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
            {supportingStories.map((story) => (
              <article
                key={story.id}
                className="bg-white rounded-3xl border border-[#E6E2DA] p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center shadow-xs hover:border-[#141414]/20 transition-all group"
                aria-label={story.title}
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-32 sm:h-32 aspect-video sm:aspect-square rounded-2xl overflow-hidden shrink-0 bg-[#F0EEE8] relative">
                  <img
                    src={story.imageUrl}
                    alt={story.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 sm:hidden px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-bold">
                    {story.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#C45B3A]">
                      {story.editorialCategory}
                    </span>
                    <span className="hidden sm:inline font-display text-[10px] font-bold text-[#77736C]">
                      {story.number}
                    </span>
                  </div>

                  <h4 className="font-display text-base sm:text-lg font-bold text-[#141414] group-hover:text-[#C45B3A] transition-colors leading-snug">
                    {story.title}
                  </h4>

                  <p className="text-xs text-[#77736C] line-clamp-2 leading-relaxed">
                    {story.description}
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleScrollToCategories}
                      className="text-[11px] font-semibold text-[#141414] group-hover:text-[#C45B3A] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Explore category</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>

        {/* ── Bottom Section Banner for Food Stories ── */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#141414] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C45B3A]">
              Local Culinary Pride
            </span>
            <h4 className="font-display text-lg sm:text-xl font-extrabold text-white">
              Every neighbourhood has its signature taste.
            </h4>
            <p className="text-xs text-white/70 max-w-lg">
              From Folagbade street eateries to TASUED campus favourites, CHOP is building the platform to connect you to honest food artisans across Ijebu.
            </p>
          </div>

          <button
            type="button"
            onClick={handleScrollToCategories}
            className="shrink-0 py-3 px-6 rounded-full bg-white text-[#141414] text-xs sm:text-sm font-bold hover:bg-[#F0EEE8] transition-all shadow-xs active:scale-95"
          >
            Explore Food Categories &rarr;
          </button>
        </div>

      </div>
    </section>
  );
};
