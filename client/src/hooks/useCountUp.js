import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from './useReducedMotion.js';

/**
 * Animate a numeric value from 0 up to target over 0.8s using GSAP power3.out.
 * @param {number} targetValue
 * @param {number} duration
 * @returns {number}
 */
export function useCountUp(targetValue = 0, duration = 0.8) {
  const prefersReduced = useReducedMotion();
  const target = Number(targetValue) || 0;
  const [displayValue, setDisplayValue] = useState(0);
  const objRef = useRef({ val: 0 });

  useEffect(() => {
    if (prefersReduced) return;

    objRef.current.val = 0;
    const tween = gsap.to(objRef.current, {
      val: target,
      duration,
      ease: 'power3.out',
      onUpdate: () => {
        setDisplayValue(Math.round(objRef.current.val));
      },
      onComplete: () => {
        setDisplayValue(target);
      },
    });

    return () => {
      tween.kill();
    };
  }, [target, duration, prefersReduced]);

  if (prefersReduced) {
    return target;
  }

  return displayValue;
}
