import { defaultCache } from '@serwist/next/browser';
import { installSerwist } from '@serwist/sw';

declare let self: ServiceWorkerGlobalScope;

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        matcher: /.*/i,
        url: '/offline.html', // Crie uma página offline.html em public/ se quiser
      },
    ],
  },
});