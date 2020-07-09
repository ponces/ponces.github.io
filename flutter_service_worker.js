'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "161f5b8a5abf90aed11a87022c196008",
"assets/assets/fonts/Arial-Bold.ttf": "142301adf4e0699237f9e11a77761d0d",
"assets/assets/fonts/Arial.ttf": "5995c725ca5a13be62d3dc75c2fc59fc",
"assets/assets/fonts/Inter-Black.otf": "44b1541a96341780b29112665c66ac67",
"assets/assets/fonts/Inter-BlackItalic.otf": "9d128192e4f29e2f3d8ecf95e9ce0cc3",
"assets/assets/fonts/Inter-Bold.otf": "fc6aff6f40099ca7468f88df9122ae31",
"assets/assets/fonts/Inter-BoldItalic.otf": "1b276d75b6b9ee8048d443b103b99bfa",
"assets/assets/fonts/Inter-ExtraBold.otf": "33ddc61574b7fa7df6258a3489fe7e5c",
"assets/assets/fonts/Inter-ExtraBoldItalic.otf": "d4ce84aa7d1e84c6101bee45eab8c5ca",
"assets/assets/fonts/Inter-ExtraLight.otf": "7da42304043705bc1e6886a42e8ba5cc",
"assets/assets/fonts/Inter-ExtraLightItalic.otf": "72a3fc9cc56c532f347782bded4d3d06",
"assets/assets/fonts/Inter-Italic.otf": "0bc0855334f9c92c83facdd4e04c5926",
"assets/assets/fonts/Inter-Light.otf": "33bcc59c5a5f480212806c7c5ecedbd5",
"assets/assets/fonts/Inter-LightItalic.otf": "07133dafe0d37ae3bec787614832a2db",
"assets/assets/fonts/Inter-Medium.otf": "1f56c18a246ac983b3aea635cdbd6ad9",
"assets/assets/fonts/Inter-MediumItalic.otf": "0c02e6501e0652f134839d941ff57db1",
"assets/assets/fonts/Inter-Regular.otf": "5c522d2004c3279549bd88222823776f",
"assets/assets/fonts/Inter-SemiBold.otf": "ba72a985a4994051b59e2b402d30aa82",
"assets/assets/fonts/Inter-SemiBoldItalic.otf": "98c80f4fd037b4845f6083a68057cb0f",
"assets/assets/fonts/Inter-Thin.otf": "7c82068d1ef6c091c54a5249ff32d771",
"assets/assets/fonts/Inter-ThinItalic.otf": "71b0f6d26d3a911e4c4b0ddccc3fea76",
"assets/assets/i18n/en.json": "223e1e155cbdef4eb71efa6b218f8536",
"assets/assets/i18n/pt.json": "b471b6210e283117fa26b5b5c925c86a",
"assets/assets/images/icon-192x192.png": "ef7f1cfccf537f49c8059da4edf5b9a0",
"assets/assets/images/icon-512x512-square.png": "a5c34741595dcb703f7dd4a75ad8cf54",
"assets/assets/images/icon-512x512.png": "a75fa29931dcae08df6c2d2baf684c96",
"assets/assets/images/icon-foreground-432x432.png": "60ae729f0f2b85ca8a4e00d024cd4efc",
"assets/assets/images/splash-en.png": "484ec33d3e4637b15888aba884d753b0",
"assets/assets/images/splash-pt.png": "0d0fae69b463b29075987b2e6b4d075f",
"assets/FontManifest.json": "4a4446ecd0cb528bb584553ba526f528",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/NOTICES": "85624386a2c3804718db787a925b056f",
"assets/packages/line_icons/lib/assets/fonts/LineIcons.ttf": "cbbafe11733101c7a8e47d5e701ddba4",
"favicon.png": "7d671c258d13091fd08538757482bb90",
"icons/Icon-192.png": "ef7f1cfccf537f49c8059da4edf5b9a0",
"icons/Icon-592.png": "a75fa29931dcae08df6c2d2baf684c96",
"index.html": "a1f29842b1b5e425378366235bb16256",
"/": "a1f29842b1b5e425378366235bb16256",
"main.dart.js": "254ba9a8825aea2c03f49598f79b9b8e",
"manifest.json": "c8165d37801c656ba1fdc7adff6484e6"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/LICENSE",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a no-cache param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'no-cache'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'no-cache'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.message == 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message = 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.add(resourceKey);
    }
  }
  return Cache.addAll(resources);
}
