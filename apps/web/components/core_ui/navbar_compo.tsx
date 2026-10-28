"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  type Variants,
} from "framer-motion";
import { Navigation, Menu } from "lucide-react";
import { cn } from "@/src/lib/utils";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "How It Works?", href: "/how-it-works" },
  { name: "Travel Guide", href: "/ai-guide" },
];

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants: Variants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
    transition: {
      y: { type: "spring", damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring",
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3rem",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const logoVariants: Variants = {
  expanded: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { type: "spring", damping: 15 },
  },
  collapsed: {
    opacity: 0,
    x: -25,
    rotate: -180,
    transition: { duration: 0.3 },
  },
};

const itemVariants: Variants = {
  expanded: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", damping: 15 },
  },
  collapsed: {
    opacity: 0,
    x: -20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const collapsedIconVariants: Variants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300,
      delay: 0.15,
    },
  },
};

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;

    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } else if (
      !isExpanded &&
      latest < previous &&
      scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD
    ) {
      setExpanded(true);
    }

    lastScrollY.current = latest;
  });

  const handleNavClick = (event: React.MouseEvent) => {
    if (!isExpanded) {
      event.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.1 } : {}}
        whileTap={!isExpanded ? { scale: 0.95 } : {}}
        onClick={handleNavClick}
        className={cn(
          "relative flex h-12 items-center overflow-hidden rounded-full border border-[var(--tourmate-line)] bg-background/90 text-foreground shadow-lg backdrop-blur-sm",
          !isExpanded && "cursor-pointer justify-center"
        )}
      >
        <motion.div
          variants={logoVariants}
          className="flex flex-shrink-0 items-center pl-4 pr-2 font-semibold text-[var(--tourmate-coral)]"
        >
          <Navigation className="h-6 w-6" />
        </motion.div>

        <motion.div
          className={cn(
            "flex items-center gap-1 pr-4 sm:gap-4",
            !isExpanded && "pointer-events-none"
          )}
        >
          {navItems.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              variants={itemVariants}
              onClick={(event) => event.stopPropagation()}
              className="px-2 py-1 text-sm font-medium text-[var(--tourmate-dim)] transition-colors hover:text-foreground"
            >
              {item.name}
            </motion.a>
          ))}
        </motion.div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div
            variants={collapsedIconVariants}
            animate={isExpanded ? "expanded" : "collapsed"}
            className="text-[var(--tourmate-coral)]"
          >
            <Menu className="h-6 w-6" />
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
}
