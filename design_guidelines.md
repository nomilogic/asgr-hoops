# ASGR Basketball Scouting Website - Design Guidelines

## Design Approach

**Approach Selected:** Hybrid - Sports Database + E-Commerce Platform
- Drawing inspiration from sports platforms like ESPN, Rivals, 247Sports for data-heavy ranking tables
- E-commerce elements inspired by clean product showcases (Shopify-style card layouts)
- Professional sports scouting aesthetic with emphasis on information hierarchy and data readability

## Typography System

**Font Stack:**
- **Primary (Headings):** 'Inter', sans-serif - Strong, professional, excellent for data tables
- **Secondary (Body/Data):** 'Roboto', sans-serif - Highly legible for dense information
- **Accent (Numbers/Stats):** 'Roboto Mono', monospace - For rankings, stats, heights

**Type Scale:**
- Hero/Page Titles: text-4xl to text-5xl, font-bold
- Section Headers: text-3xl, font-semibold
- Product Titles: text-2xl, font-bold
- Table Headers: text-sm to text-base, font-semibold, uppercase tracking-wide
- Player Names: text-lg to text-xl, font-semibold
- Body Text: text-base
- Stats/Data: text-sm, font-medium
- Ratings/Descriptions: text-sm, leading-relaxed
- Navigation: text-base, font-medium

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Consistent padding: p-4, p-6, p-8
- Section spacing: py-2, py-16, py-20
- Card gaps: gap-6, gap-8
- Table cell padding: px-4, py-3

**Container Strategy:**
- Max width: max-w-7xl for main content
- Full-width tables: w-full with horizontal scroll on mobile
- Product grids: max-w-6xl centered

**Grid Systems:**
- Product Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Related Products: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
- Hero/Package Details: Two-column split on desktop (60/40)

## Component Library

### Navigation Header
- Sticky header with logo left-aligned
- Horizontal navigation menu with dropdown support for nested items
- Right-aligned: Cart icon with count badge, My Account link
- Mobile: Hamburger menu revealing full navigation
- Dropdowns: Player Rankings (by class year), HS Rankings, Circuit Rankings submenus
- Logo height: h-12 to h-16

### Product Package Cards
- Vertical card layout with product image at top
- Package name as prominent heading
- Bulleted feature list (Regional/National/Premium details)
- Quantity selector (number input with +/- buttons)
- Primary CTA button "Pay Now" or "Add to Cart"
- Related Products section below with 2-3 horizontal cards
- Card shadows: shadow-md, hover:shadow-lg transition

### Player Rankings Table
- Full-width responsive table with fixed header row
- Columns: Rank (bold), Player Photo (thumbnail 60x80), Name, Height, Position, Grad Year, High School, Circuit Program, College (logo), Rating Details
- Alternating row treatment for readability
- Player photos: rounded corners, consistent size
- College commitment: Logo image (40x40) or text
- Rating number: Large, bold (rating-96, rating-97 style indicators)
- Expandable rating description below each row (text-sm, italic)
- Sticky header on scroll
- Horizontal scroll on mobile with fixed first column (rank + photo)

### Product Detail Section
- Large product image: 600x523 aspect ratio, left side
- Right side: Product title, category badge, package details list
- Quantity selector with large +/- buttons
- Prominent "Pay Now" button
- "Back to all products" link above content
- Social sharing buttons: Facebook, Twitter icons

### Related Products Horizontal Cards
- Thumbnail image left (150x150)
- Product name and price stacked right
- Small "Add to Cart" button icon
- 3 products per row on desktop, stack on mobile

### Footer
- Multi-column layout: About, Quick Links, Newsletter Signup, Social Media
- Newsletter: Email input + Subscribe button
- Copyright and legal links bottom row
- Social icons: Facebook, Twitter, Instagram

### Breadcrumbs & Navigation Aids
- Breadcrumb trail: Home > Category > Product
- "View Rating System" modal trigger link
- Category tags/badges on products

## Images

**Hero/Banner Images:**
- Product pages: Large iPad/app mockup showing scouting interface (600x523)
- Use same image across product variations for consistency
- Position: Left side on desktop, full-width on mobile

**Player Photos:**
- Headshot thumbnails in table (60x80 portrait)
- High-quality action shots preferred
- Consistent framing across all players

**Logo Images:**
- ASGR Basketball logo: Transparent PNG, primary header
- College logos: 40x40 consistent sizing in table
- Nike/brand logos: Small endorsement badges where applicable

**Product Thumbnails:**
- Related products: 300x300 square format
- Maintain consistent mockup style (iPad showing app interface)

## Accessibility & Interaction

- Table rows: Hover state for entire row
- Buttons: Clear hover and active states with subtle scale/shadow
- Form inputs: Clear focus rings, large touch targets (min 44x44)
- Dropdown menus: Smooth expand/collapse with chevron indicators
- Cart badge: Animated count update on add-to-cart
- Modal overlays: Backdrop blur for rating system popup
- Keyboard navigation: Full support for tables and forms

## Key Page Structures

**Product Detail Page:**
- Breadcrumb navigation
- Product image + details (two-column)
- Related products grid below
- Back to products link

**Rankings Page:**
- Page title with class year
- Filter/sort controls (optional: by position, state, etc.)
- Full-width ranking table
- Load more or pagination controls

**Shop/Products Page:**
- Category filter sidebar or top bar
- Product grid (3 columns desktop)
- Each card: Image, title, price, add-to-cart button

**Cart Page:**
- Line items with thumbnail, name, quantity adjuster, price
- Subtotal and checkout button
- Continue shopping link