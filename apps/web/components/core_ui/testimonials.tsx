"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "Found three hidden viewpoints in Lisbon just by pointing my phone at a wall. It's basically a local friend in my pocket.",
    by: "Maya, solo backpacker",
    imgSrc: "https://i.pravatar.cc/150?img=21"
  },
  {
    tempId: 1,
    testimonial: "Signed in with Google, was planning my Kyoto trip in under a minute. No forms, no fuss.",
    by: "Priya, first-time solo traveler",
    imgSrc: "https://i.pravatar.cc/150?img=22"
  },
  {
    tempId: 2,
    testimonial: "Snapped a photo of a random church in Porto and got its whole 800-year history back instantly.",
    by: "Lucas, self-proclaimed history nerd",
    imgSrc: "https://i.pravatar.cc/150?img=23"
  },
  {
    tempId: 3,
    testimonial: "The group finder matched me with two travelers doing the same Balkans route. We split three Airbnbs together.",
    by: "Theo, budget traveler",
    imgSrc: "https://i.pravatar.cc/150?img=24"
  },
  {
    tempId: 4,
    testimonial: "We planned a family trip to Rome and my kids actually wanted to read the landmark facts. That never happens.",
    by: "Grace, mom of three",
    imgSrc: "https://i.pravatar.cc/150?img=25"
  },
  {
    tempId: 5,
    testimonial: "Discovering the story behind a place changes how you see it. Every stop on my trip felt deliberate instead of random.",
    by: "Sam, photographer",
    imgSrc: "https://i.pravatar.cc/150?img=26"
  },
  {
    tempId: 6,
    testimonial: "24/7 means 24/7 -- I used it at 2am in a Bangkok night market and it didn't miss a beat.",
    by: "Marcus, certified night owl",
    imgSrc: "https://i.pravatar.cc/150?img=27"
  },
  {
    tempId: 7,
    testimonial: "My travel buddy bailed two weeks before Peru. The group finder had me a new one by the weekend.",
    by: "Noah, adventure traveler",
    imgSrc: "https://i.pravatar.cc/150?img=28"
  },
  {
    tempId: 8,
    testimonial: "It's rare that a travel app survives past day one on my phone. This one's been open every trip since.",
    by: "Bianca, travel blogger",
    imgSrc: "https://i.pravatar.cc/150?img=29"
  },
  {
    tempId: 9,
    testimonial: "Three core modules, one app, zero other tabs open while I'm exploring. That's the whole pitch and it delivers.",
    by: "Felix, ex-product manager turned nomad",
    imgSrc: "https://i.pravatar.cc/150?img=30"
  },
  {
    tempId: 10,
    testimonial: "Booked nothing, planned nothing, just wandered Prague with this open. Best trip I've had in years.",
    by: "Elena, spontaneous traveler",
    imgSrc: "https://i.pravatar.cc/150?img=31"
  },
  {
    tempId: 11,
    testimonial: "Honestly didn't expect an AI travel app to feel this personal. It knows what I actually care about.",
    by: "Aisha, content creator",
    imgSrc: "https://i.pravatar.cc/150?img=32"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 bg-[#0038FF] text-white border-[#0038FF]"
          : "z-0 bg-white text-black border-black/10 hover:border-[#0038FF]/40"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px #CCFF00" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-black/10"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        className="mb-4 h-14 w-12 bg-gray-200 object-cover object-top"
        style={{
          boxShadow: "3px 3px 0px #FFFFFF"
        }}
      />
      <h3 className={cn(
        "text-base sm:text-xl font-medium",
        isCenter ? "text-white" : "text-black"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
        isCenter ? "text-white/80" : "text-black/60"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <section className="w-full bg-[#F8F9FA] py-8">

      {/* Section heading */}
      <div className="px-4 pb-4 text-center">
        <span className="inline-block -rotate-2 rounded-full bg-[#CCFF00] px-4 py-1.5 text-xs font-black uppercase tracking-wide text-black">
          no cap, just facts
        </span>
        <h2
          className="mt-4 text-3xl font-black uppercase leading-[1.05] text-black sm:text-4xl md:text-5xl"
          style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
        >
          Hear From Our Users
        </h2>
        <p className="mt-3 text-sm font-bold text-black/60 md:text-base">
          real trips, real people, zero sponsored nonsense
        </p>
      </div>

      {/* Carousel */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 600 }}
      >
        {testimonialsList.map((testimonial, index) => {
          const position = testimonialsList.length % 2
            ? index - (testimonialsList.length + 1) / 2
            : index - testimonialsList.length / 2;
          return (
            <TestimonialCard
              key={testimonial.tempId}
              testimonial={testimonial}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          <button
            onClick={() => handleMove(-1)}
            className={cn(
              "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
              "bg-white border-2 border-black/10 hover:bg-[#0038FF] hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF] focus-visible:ring-offset-2"
            )}
            aria-label="Previous testimonial"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => handleMove(1)}
            className={cn(
              "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
              "bg-white border-2 border-black/10 hover:bg-[#0038FF] hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF] focus-visible:ring-offset-2"
            )}
            aria-label="Next testimonial"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};