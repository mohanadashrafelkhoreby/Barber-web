import { useCallback } from 'react';

export function useScrollTo() {
  const scrollTo = useCallback((targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return { scrollTo };
}
