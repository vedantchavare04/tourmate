"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/src/lib/utils";
import { AuthDialog } from "@/components/auth/AuthDialog";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
.cinematic-footer-wrapper {
  font-family: var(--font-geist-sans), Arial, sans-serif;
  -webkit-font-smoothing: antialiased;

  --tm-bg: var(--tourmate-ink);
  --tm-fg: #ffffff;
  --tm-accent: var(--tourmate-gold);
  --tm-accent-2: var(--tourmate-coral);

  background: var(--tm-bg);
  color: var(--tm-fg);

  --pill-bg: rgba(255, 255, 255, 0.08);
  --pill-bg-hover: rgba(255, 255, 255, 0.14);
  --pill-border: rgba(255, 255, 255, 0.16);
  --pill-border-hover: rgba(255, 255, 255, 0.3);
  --pill-shadow: rgba(18, 33, 58, 0.5);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 5px rgba(255, 201, 60, 0.5));
  }
  15%, 45% {
    transform: scale(1.2);
    filter: drop-shadow(0 0 10px rgba(255, 201, 60, 0.8));
  }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

.footer-glass-pill {
  background: var(--pill-bg);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease,
    transform 0.25s ease;
}

.footer-glass-pill:hover {
  background: var(--pill-bg-hover);
  border-color: var(--pill-border-hover);
  color: var(--tm-fg);
}

.footer-giant-bg-text {
  font-size: clamp(4rem, 14vw, 11rem);
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.14);
}

.footer-text-glow {
  color: var(--tm-fg);
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.15));
}
`;

export type MagneticButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      as?: React.ElementType;
    };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;

      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (event: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const halfWidth = rect.width / 2;
          const halfHeight = rect.height / 2;
          const x = event.clientX - rect.left - halfWidth;
          const y = event.clientY - rect.top - halfHeight;

          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove as any);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove as any);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

MagneticButton.displayName = "MagneticButton";

const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>AI Powered Exploration</span>
    <span className="text-[var(--tourmate-coral)]">✦</span>
    <span>Real Travel Buddies</span>
    <span className="text-[var(--tourmate-gold)]">✦</span>
    <span>Landmark Recognition</span>
    <span className="text-[var(--tourmate-coral)]">✦</span>
    <span>24/7 Travel Companion</span>
    <span className="text-[var(--tourmate-gold)]">✦</span>
    <span>Zero Sponsored Nonsense</span>
    <span className="text-[var(--tourmate-coral)]">✦</span>
  </div>
);

export function CinematicFooter() {
  const footerRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !footerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 75%",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <footer
        ref={footerRef}
        className="cinematic-footer-wrapper relative w-full overflow-hidden"
      >
        <div
          ref={giantTextRef}
          className="footer-giant-bg-text pointer-events-none absolute bottom-0 left-1/2 z-0 select-none -translate-x-1/2 whitespace-nowrap"
        >
          TOURMATE
        </div>

        <div className="relative z-10 w-full -rotate-2 scale-110 overflow-hidden border-y border-white/15 bg-[var(--tourmate-ink)]/95 py-4 shadow-2xl backdrop-blur-md">
          <div className="animate-footer-scroll-marquee flex w-max text-xs font-bold uppercase tracking-[0.3em] text-white/60 md:text-sm">
            <MarqueeItem />
            <MarqueeItem />
          </div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 py-20 md:py-28">
          <h2
            ref={headingRef}
            className="footer-text-glow mb-10 text-center text-4xl font-black tracking-tighter md:text-7xl"
          >
            Ready to roll?
          </h2>

          <div ref={linksRef} className="flex w-full flex-col items-center gap-6">
            <div className="flex w-full flex-wrap justify-center gap-4">
              <MagneticButton
                as="button"
                onClick={() => setShowDialog(true)}
                className="footer-glass-pill group flex items-center gap-3 rounded-full px-10 py-5 text-sm font-bold text-white md:text-base"
              >
                <GoogleMark />
                Continue with Google
              </MagneticButton>
            </div>

            <div className="mt-2 flex w-full flex-wrap justify-center gap-3 md:gap-6">
              <MagneticButton
                as="a"
                href="/about"
                className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-white/70 hover:text-white md:text-sm"
              >
                About Us
              </MagneticButton>

              <MagneticButton
                as="a"
                href="/how-it-works"
                className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-white/70 hover:text-white md:text-sm"
              >
                How It Works
              </MagneticButton>

              <MagneticButton
                as="a"
                href="/ai-guide"
                className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-white/70 hover:text-white md:text-sm"
              >
                AI Guide
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex w-full flex-col items-center justify-between gap-6 px-6 pb-8 md:flex-row md:px-12">
          <div className="order-2 text-[10px] font-semibold uppercase tracking-widest text-white/60 md:order-1 md:text-xs">
            © 2026 TourMate.AI. All rights reserved.
          </div>

          <div className="footer-glass-pill order-1 flex cursor-default items-center gap-2 rounded-full border-white/15 px-6 py-3 md:order-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 md:text-xs">
              Crafted with
            </span>
            <span className="animate-footer-heartbeat text-sm text-[var(--tourmate-gold)] md:text-base">
              ❤
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 md:text-xs">
              by
            </span>
            <span className="ml-1 text-xs font-black tracking-normal text-white md:text-sm">
              TourMate.AI
            </span>
          </div>

          <MagneticButton
            as="button"
            onClick={scrollToTop}
            className="footer-glass-pill group order-3 flex h-12 w-12 items-center justify-center rounded-full text-white/70 hover:text-white"
            aria-label="Scroll to top"
          >
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </MagneticButton>
        </div>
      </footer>

      <AuthDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </>
  );
}

function GoogleMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className="shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
