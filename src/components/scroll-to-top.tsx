import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTopImmediate } from '@/lib/motion/smoothScroll';

/** Springt beim Routenwechsel sofort nach oben; bricht dabei eine laufende Lenis-Animation ab. */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTopImmediate();
  }, [pathname]);

  return null;
}

export default ScrollToTop;
