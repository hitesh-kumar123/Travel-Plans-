---
name: "📦 Pull Request"
about: Submit changes for review
title: "PR: Premium UI Redesign — Navbar, Animations & Quiz Modal"
labels: "enhancement, ui/ux"
assignees: ""
---

## 📌 Linked Issue

<!-- Use "Closes #123" to auto-close the issue when PR is merged -->

Closes #issue_number

---

## 🛠 Changes Made

### Added
- Created shared `Navbar` component (`client/src/components/Navbar.js` + `Navbar.css`) with premium modern UI, extracted from inline code in Home.js and About.js
- Added coral "horizon line" signature design element at the bottom of the navbar
- Added slide-in mobile navigation panel with spring animation and backdrop overlay
- Added framer-motion scroll-triggered fade-up animations to all major sections on Home page (hero, search, destinations, features, testimonials, CTA)
- Added staggered entrance animations for hero content and destination/feature card grids
- Added hero visual slide-in animation from right
- Converted `TravelQuiz` from static inline component to a popup modal triggered by "Get Recommendation" button in navbar
- Added modal overlay with backdrop blur, scale-in animation, and close button
- Added quiz trigger button in both desktop navbar actions and mobile menu
- Added new CSS design tokens (`--coral-glow`, `--ocean-soft`) for consistent theming

### Fixed
- Removed duplicated inline navbar code across Home.js (~210 lines) and About.js (~20 lines), replaced with shared component
- Removed unused scroll event listeners and state variables from Home.js (now handled by Navbar)
- Removed unused `Link` import in About.js

### Updated
- **Home.css**: Refined destination card hover (`translateY(-6px) scale(1.01)` + deeper shadow), feature card hover (coral border accent), stat box hover (coral border + glow), button transitions (cubic-bezier easing), CTA section (dual radial gradient decor), section padding (5rem → 6rem)
- **theme.js**: Aligned MUI palette with Wander brand (ocean primary `#1a4a6b`, coral secondary `#e8735a`), updated typography to use Playfair Display for headings and DM Sans for body, refined shadow palette with navy-tinted shadows, added hover lift to MuiCard and focus glow to MuiTextField, changed borderRadius from 8 → 12
- **TravelQuiz.jsx**: Rewritten as modal with `open`/`onClose` props, added AnimatePresence, close button, badge header, description text, and state reset on close

---

## 🧪 Testing

- [ ] Ran unit tests (`npm test`)
- [ ] Tested manually (describe below):
  - Test case 1: Navbar scrolls and applies shadow on scroll — works correctly
  - Test case 2: "Get Recommendation" button opens quiz modal with animation — opens correctly
  - Test case 3: Quiz modal close button and overlay click dismiss the modal — dismisses correctly
  - Test case 4: Quiz modal mobile trigger in hamburger menu — opens and closes menu correctly
  - Test case 5: Hero section staggered entrance animation on page load — animations play smoothly
  - Test case 6: Scroll-triggered animations on destinations, features, testimonials sections — reveal on scroll as expected
  - Test case 7: Mobile responsive layout (900px breakpoint) — all elements stack correctly
  - Test case 8: Build compiles with no warnings or errors — verified clean build

---

## 📸 UI Changes (if applicable)

| Before | After |
| ------- | ------- |
| Inline navbar duplicated in Home.js and About.js with basic styles | Shared Navbar component with premium glassmorphism, coral horizon line, refined hover states |
| TravelQuiz rendered statically inline in the navbar link | TravelQuiz opens as an animated modal popup on button click |
| No scroll animations on page sections | framer-motion fade-up and stagger animations on all major sections |
| Basic card hover effects (simple translateY) | Enhanced hover with scale, deeper shadows, and coral accent borders |
| Default MUI theme colors | Updated MUI theme aligned with Wander brand palette |

---

## 📝 Documentation Updates

- [ ] Updated README/docs
- [x] Added code comments (component-level JSDoc in Navbar.js)

---

## ✅ Checklist

- [x] Created a new branch for PR
- [ ] Have starred the repository ⭐
- [x] Follows [JavaScript Styleguide](CONTRIBUTING.md#javascript-styleguide)
- [x] No console warnings/errors
- [x] Commit messages follow [Git Guidelines](CONTRIBUTING.md#git-commit-messages)

## 💡 Additional Notes (If any)

### Files Changed
| File | Action |
|------|--------|
| `client/src/components/Navbar.js` | **New** — Shared navbar component |
| `client/src/components/Navbar.css` | **New** — Navbar styles |
| `client/src/components/TravelQuiz.jsx` | **Modified** — Converted to modal |
| `client/src/pages/Home.js` | **Modified** — Uses shared Navbar, framer-motion animations |
| `client/src/pages/Home.css` | **Modified** — Refined hover states, modal styles, spacing |
| `client/src/pages/About.js` | **Modified** — Uses shared Navbar, framer-motion animations |
| `client/src/theme.js` | **Modified** — Aligned MUI theme with brand palette |

### Design Decisions
- **Signature Element**: Thin coral gradient line at navbar bottom — a visual thread tying the navbar to coral accents throughout the page
- **Typography**: Playfair Display for display headings, DM Sans for body — editorial travel magazine feel
- **Motion**: framer-motion used for orchestrated reveal sequences; `prefers-reduced-motion` respected via existing App.css media query
- **Navbar**: Glassmorphism backdrop blur, 72px height, max-width 1400px centered layout
