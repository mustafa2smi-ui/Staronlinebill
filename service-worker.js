const CACHE_NAME = 'star-bill-app-v1.3';

// उन सभी फ़ाइलों की सूची जिन्हें ऑफ़लाइन उपयोग के लिए कैश किया जाना चाहिए
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // अपने CSS और JS फ़ाइलों को यहां जोड़ें
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', // External JS
  // यदि आप images फ़ोल्डर का उपयोग कर रहे हैं:

  'saral.jpeg'
];

// 1. सर्विस वर्कर इंस्टॉल करना और फ़ाइलें कैश करना
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // तुरंत सक्रिय करने के लिए (ज़रूरी नहीं, लेकिन तेज़ डिप्लॉयमेंट के लिए उपयोगी)
  self.skipWaiting();
});

// 2. कैश किए गए एसेट को फ़ेच करना (ऑफ़लाइन लॉजिक)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // यदि कैश में है, तो कैश से वापस करें
        if (response) {
          return response;
        }
        // यदि कैश में नहीं है, तो नेटवर्क से फ़ेच करें
        return fetch(event.request);
      })
  );
});

// 3. पुराने कैश को हटाना
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // पुराने कैश को हटाना
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
