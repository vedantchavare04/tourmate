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
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;

  --tm-bg: #04081A;
  --tm-fg: #FFFFFF;
  --tm-accent: #CCFF00;
  --tm-accent-2: #0038FF;

  background: var(--tm-bg);
  color: var(--tm-fg);

  --pill-bg-1: color-mix(in oklch, var(--tm-fg) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--tm-fg) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--tm-bg) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--tm-fg) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--tm-bg) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--tm-fg) 8%, transparent);

  --pill-bg-1-hover: color-mix(in oklch, var(--tm-fg) 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--tm-fg) 2%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--tm-fg) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--tm-bg) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--tm-fg) 20%, transparent);
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
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px color-mix(in oklch, var(--tm-accent) 50%, transparent)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px color-mix(in oklch, var(--tm-accent) 80%, transparent)); }
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

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, color-mix(in oklch, var(--tm-fg) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--tm-fg) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, var(--tm-accent) 15%, transparent) 0%,
    color-mix(in oklch, var(--tm-accent-2) 15%, transparent) 40%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
      0 10px 30px -10px var(--pill-shadow),
      inset 0 1px 1px var(--pill-highlight),
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
      0 20px 40px -10px var(--pill-shadow-hover),
      inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--tm-fg);
}

/* Giant background wordmark -- sized to a compact footer now, not a full
   viewport-height one, so this is a fixed clamp instead of 26vw. */
.footer-giant-bg-text {
  font-size: clamp(4rem, 14vw, 11rem);
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--tm-fg) 5%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--tm-fg) 10%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, var(--tm-fg) 0%, color-mix(in oklch, var(--tm-fg) 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px color-mix(in oklch, var(--tm-fg) 15%, transparent));
}
`;


export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
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
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

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

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT -- normal in-flow footer, no fixed/h-screen/clip-path
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>AI Powered Exploration</span> <span className="text-[#0038FF]/60">✦</span>
    <span>Real Travel Buddies</span> <span className="text-[#CCFF00]/60">✦</span>
    <span>Landmark Recognition</span> <span className="text-[#0038FF]/60">✦</span>
    <span>24/7 Travel Companion</span> <span className="text-[#CCFF00]/60">✦</span>
    <span>Zero Sponsored Nonsense</span> <span className="text-[#0038FF]/60">✦</span>
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
        className="relative w-full overflow-hidden cinematic-footer-wrapper"
      >
        {/* Ambient Light & Grid Background */}
        <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
        <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

        {/* Giant background wordmark */}
        <div
          ref={giantTextRef}
          className="footer-giant-bg-text absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
        >
          TOURMATE
        </div>

        {/* Marquee */}
        <div className="relative z-10 w-full overflow-hidden border-y border-white/10 bg-[#04081A]/60 backdrop-blur-md py-4 -rotate-2 scale-110 shadow-2xl">
          <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.3em] text-white/50 uppercase">
            <MarqueeItem />
            <MarqueeItem />
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-20 md:py-28 w-full max-w-5xl mx-auto">
          <h2
            ref={headingRef}
            className="text-4xl md:text-7xl font-black footer-text-glow tracking-tighter mb-10 text-center"
          >
            Ready to roll?
          </h2>

          <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-wrap justify-center gap-4 w-full">
              <MagneticButton
                as="button"
                onClick={() => setShowDialog(true)}
                className="footer-glass-pill px-10 py-5 rounded-full text-white font-bold text-sm md:text-base flex items-center gap-3 group"
              >
                <GoogleMark />
                Continue with Google
              </MagneticButton>
            </div>

            <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mt-2">
              <MagneticButton as="a" href="/about" className="footer-glass-pill px-6 py-3 rounded-full text-white/50 font-medium text-xs md:text-sm hover:text-white">
                About Us
              </MagneticButton>
              <MagneticButton as="a" href="/how-it-works" className="footer-glass-pill px-6 py-3 rounded-full text-white/50 font-medium text-xs md:text-sm hover:text-white">
                How It Works
              </MagneticButton>
              <MagneticButton as="a" href="/ai-guide" className="footer-glass-pill px-6 py-3 rounded-full text-white/50 font-medium text-xs md:text-sm hover:text-white">
                AI Guide
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Bottom Bar / Credits */}
        <div className="relative z-10 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white/50 text-[10px] md:text-xs font-semibold tracking-widest uppercase order-2 md:order-1">
            © 2026 TourMate.AI. All rights reserved.
          </div>

          <div className="footer-glass-pill px-6 py-3 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default border-white/10">
            <span className="text-white/50 text-[10px] md:text-xs font-bold uppercase tracking-widest">Crafted with</span>
            <span className="animate-footer-heartbeat text-sm md:text-base text-[#ff0088]">❤</span>
            <span className="text-white/50 text-[10px] md:text-xs font-bold uppercase tracking-widest">by</span>
            <span className="text-white font-black text-xs md:text-sm tracking-normal ml-1">TourMate.AI</span>
          </div>

          <MagneticButton
            as="button"
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full footer-glass-pill flex items-center justify-center text-white/50 hover:text-white group order-3"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
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
    <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.616z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" />
    </svg>
  );
}