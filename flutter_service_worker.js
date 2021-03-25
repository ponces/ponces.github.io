'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "6d450e1d61f04380f544b2ddf5a52f61",
"assets/assets/fonts/Inter-Black.otf": "44b1541a96341780b29112665c66ac67",
"assets/assets/fonts/Inter-BlackItalic.otf": "9d128192e4f29e2f3d8ecf95e9ce0cc3",
"assets/assets/fonts/Inter-Bold.otf": "fc6aff6f40099ca7468f88df9122ae31",
"assets/assets/fonts/Inter-Bold.ttf": "02f2973fc384793e24b3ecef3fbe0800",
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
"assets/assets/fonts/Inter-Regular.ttf": "9ab5822fd9582ad50ec73f8edac49aae",
"assets/assets/fonts/Inter-SemiBold.otf": "ba72a985a4994051b59e2b402d30aa82",
"assets/assets/fonts/Inter-SemiBoldItalic.otf": "98c80f4fd037b4845f6083a68057cb0f",
"assets/assets/fonts/Inter-Thin.otf": "7c82068d1ef6c091c54a5249ff32d771",
"assets/assets/fonts/Inter-ThinItalic.otf": "71b0f6d26d3a911e4c4b0ddccc3fea76",
"assets/assets/i18n/en.json": "c3510bae4953992273ec39c9bda44a40",
"assets/assets/i18n/pt.json": "1d0f29cf62b3e653f31091156e6dccd2",
"assets/assets/images/icon-192x192.png": "ef7f1cfccf537f49c8059da4edf5b9a0",
"assets/assets/images/icon-512x512-square.png": "a5c34741595dcb703f7dd4a75ad8cf54",
"assets/assets/images/icon-512x512.png": "a75fa29931dcae08df6c2d2baf684c96",
"assets/assets/images/icon-foreground-432x432.png": "60ae729f0f2b85ca8a4e00d024cd4efc",
"assets/FontManifest.json": "40deab813c922dfb16e42e6ccbef4172",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "4a2ee0a11724723ede7617eeea7af42a",
"assets/packages/line_icons/lib/assets/fonts/LineIcons.ttf": "23621397bc1906a79180a918e98f35b2",
"favicon.png": "7d671c258d13091fd08538757482bb90",
"icons/Icon-192.png": "ef7f1cfccf537f49c8059da4edf5b9a0",
"icons/Icon-512.png": "a75fa29931dcae08df6c2d2baf684c96",
"index.html": "053dea7f6b714b56ae021eea0ba3009b",
"/": "053dea7f6b714b56ae021eea0ba3009b",
"main.dart.js": "9bd189345e29d7186b85154b411d26a1",
"manifest.json": "604c49b29a5e8bceae107d1cc900be2b"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
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
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
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
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }
  if (event.message === 'downloadOffline') {
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
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
