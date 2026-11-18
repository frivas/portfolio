# Which icon files and tags each browser actually uses

Ticket: [#2](https://github.com/frivas/portfolio/issues/2). Researched 2026-11-18.
Targets: Chrome, Brave, Edge, Firefox, Safari (macOS and iOS), Android home screen.

## Answer

Seven files at the site root (`sites/portfolio/`) and five `<head>` lines.

| File | Size | Who uses it |
|---|---|---|
| `favicon.ico` | 32x32 (16 optional inside) | Safari before 26, Google Search results, feed readers and tools that probe `/favicon.ico` |
| `icon.svg` | vector | Tab icon in Chrome, Brave, Edge, Firefox, and Safari 26+ |
| `apple-touch-icon.png` | 180x180, solid background | iOS/iPadOS Home Screen, macOS Dock web apps |
| `icon-192.png` | 192x192 | Manifest, Android launcher (required by Chromium) |
| `icon-512.png` | 512x512 | Manifest, Android splash/install (required by Chromium) |
| `icon-mask.png` | 512x512, content inside the center 80% circle | Manifest `maskable`, Android adaptive icon |
| `manifest.webmanifest` | — | Android home screen icon/name |

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#0b0d10">
```

```json
{
  "name": "Francisco Rivas",
  "short_name": "frivas",
  "start_url": "/",
  "display": "browser",
  "background_color": "#0b0d10",
  "theme_color": "#0b0d10",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-mask.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

No `mask-icon`, no `shortcut icon`, no `msapplication-*` tags, no per-size PNG favicons.

**Design shortcut for this site:** draw the SVG as a solid `#0b0d10` square with the `#7ee787` mark on it. A self-contained tile reads on light and dark browser chrome alike, so the SVG needs no `prefers-color-scheme` block. This also sidesteps Safari ignoring that block (see below). The same artwork, flattened, becomes every PNG.

**S3 gotcha:** upload with correct `Content-Type`, or icons silently fail. `icon.svg` must be `image/svg+xml` (caniuse note: required for SVG favicons), `manifest.webmanifest` `application/manifest+json`, `favicon.ico` `image/x-icon`. `aws s3 sync` guesses these from extension but `.webmanifest` may come through as `binary/octet-stream`; set it explicitly.

## Findings

### SVG favicon support: universal as of Safari 26 (changed recently)
- caniuse `link-icon-svg`: Chrome/Edge 80+, Firefox 41+, Safari and iOS Safari **26.0+**; Safari 18.x and earlier "n". Note 3: "Requires the served mime-type to be `image/svg+xml`." ([caniuse data](https://raw.githubusercontent.com/Fyrd/caniuse/main/features-json/link-icon-svg.json))
- WebKit, Safari 26.0 release post: "Safari 26.0 now supports the SVG file format for icons everyplace there are icons in the interface, including favicons." Data-URL icons are also supported now. ([WebKit blog](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/))
- Brave follows Chromium.

### Dark variant inside the SVG: works in Chromium and Firefox, not Safari
- WebKit bug 309949 "SVG favicons don't respect media query overrides, notably for dark mode", status NEW, reproduced on Safari 26.3, last touched 2026-07-04. Safari always shows the light (default) styles. ([bug](https://bugs.webkit.org/show_bug.cgi?id=309949))
- Firefox evaluates the SVG's `prefers-color-scheme` against the browser theme, not the page (bug 1764354, fixed in 100). `media` attributes on `<link rel=icon>` are not honored by Firefox (bugs 1790109, 1862015), so the in-SVG query is the only approach that works there. ([1764354](https://bugzilla.mozilla.org/show_bug.cgi?id=1764354), [1862015](https://bugzilla.mozilla.org/show_bug.cgi?id=1862015))
- Firefox bug 1936587 (open): a color-scheme-switching SVG can disappear on the New Tab page. ([bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1936587))
- Conclusion: if you use the dark query, make the default (light) styles legible on both backgrounds. Simpler: a solid-background tile, no query.

### favicon.ico at root: still worth one file
- Google Search favicon formats: "BMP, GIF, ICO, PNG, JPEG, PPM, and TIFF." No SVG. Must be square, at least 8x8, larger than 48x48 recommended. ([Google Search Central](https://developers.google.com/search/docs/appearance/favicon-in-search))
- Safari 18 and earlier (still on older macOS/iOS installs) cannot use the SVG.
- Browsers that see multiple `rel=icon` choose by `type`/`sizes`/`media`, and fall through to the next if a format is unsupported ([MDN rel](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel)). Declaring the ICO with `sizes="32x32"` (not `any`) keeps Chromium from preferring it over the SVG.
- MDN: `shortcut` "is non-conforming, ignored and web authors must not use it anymore."
- A 48x48 ICO would match Google's "larger than 48" advice more closely; 32x32 is fine for tabs. Optional.

### apple-touch-icon: 180x180, solid background
- Apple: a PNG named `apple-touch-icon.png` in the root is picked up site-wide even without a link tag; with several sizes, the closest match (or smallest larger) wins. iOS does not use `rel=icon` sizes for Home Screen icons. ([Apple Safari Web Content Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html), [MDN rel](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel))
- 180x180 is the iPhone retina size in Apple's own example; one file covers iPad too (it downscales).
- Transparency is filled with black on the Home Screen ([Apple Developer Forums](https://developer.apple.com/forums/thread/713895)). Flatten onto `#0b0d10`; ship a full square, iOS rounds the corners.
- iOS 26: "By default, every website added to the Home Screen opens as a web app", manifest or not; manifest icons are used if present ([WebKit blog](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)). The post does not state precedence between manifest icons and `apple-touch-icon`, so keep both and use the same artwork.

### Web manifest
- Chromium: "must provide at least a 192x192 pixel icon and a 512x512 pixel icon", plus `name`/`short_name` and `start_url`; `background_color` feeds the splash. ([web.dev](https://web.dev/articles/add-manifest))
- Maskable: safe zone is a center circle of radius 40% of the width. "We don't recommend using multiple purposes for maskable icons", so use a separate `maskable` entry, not `"any maskable"`. ([web.dev maskable](https://web.dev/articles/maskable-icon), [MDN icons](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons))
- `display: "browser"` keeps it a bookmark-style shortcut; switch to `standalone` only if an app-like launch is wanted.

### mask-icon: drop it
- Safari 12+ uses the regular favicon for pinned tabs; Safari 26 renders SVG favicons directly. No Apple or WebKit doc still recommends `mask-icon`. (Supporting secondary source: [Evil Martians, "How to Favicon"](https://evilmartians.com/chronicles/how-to-favicon-in-six-files-that-fit-most-needs).)

## Gaps
- No caniuse/MDN data on whether Safari 26 prefers `icon.svg` over `favicon.ico` when both are linked; expected to pick SVG per the HTML selection rules, unverified on a device.
- Apple's statement on transparency is a forum answer, not reference docs.
