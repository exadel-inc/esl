const CACHE = 'esl-sw-cache';

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE);
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise }) => {
  // Try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) return responseFromCache;

  // Try to use the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info('using preload response', preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request.clone());
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
};

self.addEventListener('install', (event) => {
  event.waitUntil(addResourcesToCache(['/']));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse
    })
  );
});
