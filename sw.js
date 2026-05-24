// ============================================
// 都市浮生记 - Service Worker v51.2
// ============================================
const CACHE_NAME = 'city-drifters-v51.2';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './game-data.js',
    './game.js',
    './manifest.json'
];

// 安装：预缓存所有静态资源
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// 激活：清理旧版本缓存
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// 请求拦截：Cache First 策略
self.addEventListener('fetch', event => {
    // 只处理同源的 GET 请求
    if (event.request.method !== 'GET') return;
    // 跳过 Google Fonts 等第三方资源（让浏览器自己缓存）
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                // 缓存新资源
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            });
        }).catch(() => {
            // 离线回退：返回缓存的首页
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
        })
    );
});
