# Header lockup design QA

Reference: `mhsc-header-desktop-mockup.png` (1440 × 690) and `mhsc-header-mobile-mockup.png` (390 × 844), approved by Jeremy. Only the header treatment is in scope; the page body in the mockups is illustrative.

- Desktop at 1440px: the reversed logo is 257 × 54px, with one image in the header, a dark green bar, gold divider, centered navigation, and the gold quote button. The logo and nav share one vertical centerline.
- Mobile at 390px: the logo is 209 × 44px with clear space before the menu button. The open panel contains Home, Blog, Newsletter, and Contact in one column.
- The lockup is deterministically cropped and recolored from `images/mhsc-logo-official.png`. It preserves the approved art and gold, with the original green replaced by warm white. No text wordmark or stale `images/logo.png` remains in page headers.
- The homepage, a service page, and the blog were visually checked at mobile width. The newsletter archive uses the issue family photo rather than repeating the header logo. The October awareness logo within Issue No. 1 remains editorial content. No horizontal overflow or broken header image was observed. All 18 sitemap routes return one shared header with one lockup image and the same four navigation links in the local Pages runtime.

Final result: passed.
