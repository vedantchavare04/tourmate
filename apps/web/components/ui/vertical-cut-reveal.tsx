"use client";

import { motion, type Transition } from "framer-motion";
import React from "react";

interface VerticalCutRevealProps {
  children: React.ReactNode;
  splitBy?: "words" | "characters";
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center";
  reverse?: boolean;
  transition?: Transition;
  className?: string;
}

export function VerticalCutReveal({
  children,
  splitBy = "words",
  staggerDuration = 0.1,
  staggerFrom = "first",
  reverse = false,
  transition = {
    type: "spring",
    stiffness: 250,
    damping: 30,
  },
  className,
}: VerticalCutRevealProps) {
  const text = typeof children === "string" ? children : "";

  const items =
    splitBy === "words" ? text.split(" ") : Array.from(text);

  const getDelay = (index: number) => {
    let position = index;

    if (staggerFrom === "last") {
      position = items.length - 1 - index;
    }

    if (staggerFrom === "center") {
      position = Math.abs(items.length / 2 - index);
    }

    return position * staggerDuration;
  };

  return (
    <span className={className}>
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{
              y: reverse ? "-100%" : "100%",
              opacity: 0,
            }}
            whileInView={{
              y: 0,
              opacity: 1,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              ...transition,
              delay: getDelay(index),
            }}
          >
            {item}
          </motion.span>

          {splitBy === "words" && index < items.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}