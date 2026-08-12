BOMO My Travel + Travel Studio

Canonical entry:
- index.html

Structure:
- assets/account.js: unified guest/creator routing and interactions
- assets/app.js: shared theme, modal, upload, settings, and UI utilities
- assets/video-reviews.js: local demo CRUD store and moderation states
- assets/public-profile.js: standalone public profile viewer, sorting, and sharing
- assets/style.css: base Travel Studio layout
- assets/custom.css: dark mode, ratings, moderation viewer, CRUD, and settings UI
- pages/guest/: guest dashboard fragments
- pages/studio/: creator overview fragments
- components/: retained shared/legacy components

Video moderation states:
- draft
- pending (system approval)
- approved
- changes_requested
- rejected

Only approved video reviews are shown on the public creator profile. The local
prototype shares moderation state with the admin review queue through
localStorage key "bomo-video-reviews-v1". A production implementation should
replace localStorage and demo video URLs with authenticated API and media
storage services.

The public-profile.html entry is independent from the Travel Studio shell and
does not render creator navigation, private metrics, or management controls.

The root guest-dashboard.html is a compatibility redirect that preserves old
query parameters and opens travel-studio/index.html.
