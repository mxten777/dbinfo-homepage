import { useRef, useEffect } from 'react';

interface FadeSlideInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
}

export default function FadeSlideIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 700,
}: FadeSlideInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    let translate = '';
    switch (direction) {
      case 'up':
        translate = 'translateY(40px)';
        break;
      case 'down':
        translate = 'translateY(-40px)';
        break;
      case 'left':
        translate = 'translateX(40px)';
        break;
      case 'right':
        translate = 'translateX(-40px)';
        break;
    }
    el.style.transform = translate;
    el.style.transition = `opacity ${duration}ms cubic-bezier(.4,0,.2,1) ${delay}ms, transform ${duration}ms cubic-bezier(.4,0,.2,1) ${delay}ms`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 30);
  }, [direction, delay, duration]);

  return (
    <div ref={ref} style={{ willChange: 'opacity, transform' }}>
      {children}
    </div>
  );
}
