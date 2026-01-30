"use client";
import { useEffect, useRef } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export default function AnimatedCounter({
  end,
  duration = 2.5,
  suffix = "",
  prefix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <span ref={ref}>
      {inView && (
        <CountUp
          end={end}
          duration={duration}
          suffix={suffix}
          prefix={prefix}
          decimals={decimals}
          separator=","
        />
      )}
    </span>
  );
}
