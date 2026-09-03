"use client"

import { HeroComponent } from "@/components/core_ui/hero_compo";
import { StaggerTestimonials } from "@/components/core_ui/testimonials";
import { CinematicFooter } from "@/components/core_ui/footer_compo";

export default function Hero() {
  return (
    <div className="relative w-full overflow-x-hidden">
      <HeroComponent />
      <StaggerTestimonials />
      <CinematicFooter />
    </div>
  );
}

