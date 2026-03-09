'use client';

import { useEffect } from 'react';

export function RegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('SW registrado!', reg))
        .catch((err) => console.log('Erro no SW:', err));
    }
  }, []);

  return null;
}