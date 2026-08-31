"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

interface TimelineContentProps {
  as?: keyof typeof motion;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  customVariants?: Variants;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

export function TimelineContent({
  as = "div",
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  children,
  ...props
}: TimelineContentProps) {
  const MotionComponent = motion[as] as any;

  return (
    <MotionComponent
      className={className}
      variants={customVariants}
      custom={animationNum}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.2,
      }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}