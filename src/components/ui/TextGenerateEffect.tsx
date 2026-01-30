"use client";
import { useEffect, useRef } from "react";
import { motion, stagger, useAnimate, useInView } from "motion/react";

export const TextGenerateEffect = ({
  words,
  className = "",
  filter = true,
  duration = 0.5,
  delay = 0,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  delay?: number;
}) => {
  const [scope, animate] = useAnimate();
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(triggerRef, { once: true, margin: "-10% 0px" });

  const wordsArray = words.split(" ");

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration ?? 0.5,
          delay: stagger(0.2, { startDelay: delay }),
        }
      );
    }
  }, [isInView, animate, filter, duration, delay]);

  return (
    <motion.span
      ref={(node) => {
        (scope as any).current = node;
        triggerRef.current = node;
      }}
      className={className}
    >
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className="opacity-0"
          style={{ filter: filter ? "blur(10px)" : "none" }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.span>
  );
};
