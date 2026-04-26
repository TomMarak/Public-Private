# Battle Owl Eshop — Project Context

## O projektu
Vlastní eshop pro značku Battle Owl (battleowl.com). Žádná krabicová řešení — plná kontrola nad designem a funkcionalitou. Primární trh CZ, dvě jazykové mutace CZ/EN.

## Tech Stack
- **Frontend & API** — Next.js (App Router, Server Components)
- **Lokalizace** — next-intl (CZ/EN)
- **CMS & Admin** — Payload CMS (TypeScript, stejný Node.js server)
- **Databáze** — PostgreSQL
- **Cache & Session** — Redis
- **Platby** — Stripe (karty) + GoPay (CZ platební metody)
- **Email** — Resend nebo SendGrid
- **Storage** — Cloudflare R2
- **Hosting** — Hetzner VPS za Cloudflare (DDoS, CDN, WAF)

## Sortiment & URL Struktura
- `/pece-o-vousy/[slug]` — kosmetická řada SOVOUS (olej, balzám, šampon, sada)
- `/pece-o-vlasy/sampony/[slug]` — šampony SOVOUS
- `/pece-o-vlasy/balzamy/[slug]` — balzámy SOVOUS (připravované)
- `/obleceni/[slug]` — trička, ponožky
- `/knihy/[slug]` — Battle Owl universe
- `/brno-neexistuje/[slug]` — speciální kolekce

## SEO & Redirecty
- Slugy vždy manuální pole — admin zadává ručně, systém pouze navrhne z názvu
- 301 redirecty ze starých Shoptet URL (/14-obleceni/, /12-comics/, /damska-kosmetika/)

## Payload CMS Collections
- **Products** — slug manuální, name lokalizované, price, category, images, variants (stock + SKU), status (draft/published/sold_out), SEO pole lokalizovaná
- **Categories** — slug manuální, name + description lokalizované, parent pro podkategorie, SEO pole
- **Homepage Sections** — Payload Global, drag & drop reordering (featured_products / category_banner / promo_banner)
- **Redirects** — from, to, typ 301/302, isActive
- **Users** — role admin/customer, základní údaje, adresy jako array
- **Orders** — orderNumber auto-generovaný, customer relationship nebo guestEmail, items snapshot s priceAtPurchase, status (pending/paid/processing/shipped/delivered/cancelled), shippingAddress snapshot, paymentMethod, paymentId

## Košík
- Onepager checkout — žádné mezikroky
- Přehled položek + úprava množství
- Výběr dopravy: Zásilkovna, PPL, osobní odběr
- Výběr platby: karta, bankovní převod, dobírka
- Sticky shrnutí vpravo s živým přepočtem, na mobilu na konci
- Zustand store + localStorage — přežije refresh, nevyžaduje přihlášení

## Nákup bez registrace
- Host zadá jen kontaktní údaje + adresu
- Po zaplacení: potvrzovací email + nabídka vytvořit účet jedním klikem (zadá jen heslo)
- Jednorázový token s expirací 24h vázaný na orderId + email
- Objednávky hosta se po registraci zpětně přiřadí podle emailu

## Bezpečnost
- JWT (access token 15 min, refresh token 7 dní v httpOnly cookie)
- bcrypt nebo Argon2 na hesla
- Rate limiting na auth endpointech i globálně
- CORS whitelist, Helmet.js
- Zod validace na každém endpointu
- Parametrizované SQL queries
- Stripe webhook signature verification
- HTTPS přes Let's Encrypt
- Databáze nepřístupná z internetu, pravidelné zálohy
- Principle of least privilege na DB uživateli

## Konvence
- TypeScript všude — žádný plain JS
- Komentáře a názvy proměnných: anglicky
- Commit messages: anglicky
- Slug je vždy manuální pole — nikdy auto-generovaný bez potvrzení adminem
- Každá komponenta má vlastní složku s index.ts pro čistý import
- Žádné obří soubory — vše komponentně rozdělené

## File Struktura
```
battle-owl/
├── CLAUDE.md
├── .env.local
├── .env.example
├── next.config.ts
├── payload.config.ts
├── tsconfig.json
├── package.json
│
├── public/
│   └── images/
│
├── src/
│   ├── app/
│   │   ├── (frontend)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── pece-o-vousy/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── pece-o-vlasy/
│   │   │   │   ├── sampony/
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── balzamy/
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx
│   │   │   ├── obleceni/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── knihy/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── brno-neexistuje/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── kosik/
│   │   │   │   └── page.tsx
│   │   │   └── ucet/
│   │   │       ├── page.tsx
│   │   │       ├── objednavky/
│   │   │       │   └── page.tsx
│   │   │       └── nastaveni/
│   │   │           └── page.tsx
│   │   │
│   │   ├── (payload)/
│   │   │   └── admin/
│   │   │       └── [[...segments]]/
│   │   │           └── page.tsx
│   │   │
│   │   └── api/
│   │       ├── [...payload]/
│   │       │   └── route.ts
│   │       ├── cart/
│   │       │   └── route.ts
│   │       ├── checkout/
│   │       │   └── route.ts
│   │       ├── webhooks/
│   │       │   ├── stripe/
│   │       │   │   └── route.ts
│   │       │   └── gopay/
│   │       │       └── route.ts
│   │       └── auth/
│   │           ├── login/
│   │           │   └── route.ts
│   │           ├── logout/
│   │           │   └── route.ts
│   │           ├── refresh/
│   │           │   └── route.ts
│   │           └── register/
│   │               └── route.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Badge/
│   │   │   ├── Modal/
│   │   │   └── Spinner/
│   │   │
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Nav.tsx
│   │   │   │   ├── CartIcon.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── index.ts
│   │   │   └── MobileMenu/
│   │   │       ├── MobileMenu.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── product/
│   │   │   ├── ProductCard/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ProductGrid/
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ProductDetail/
│   │   │   │   ├── ProductDetail.tsx
│   │   │   │   ├── ProductImages.tsx
│   │   │   │   ├── ProductVariants.tsx
│   │   │   │   ├── AddToCart.tsx
│   │   │   │   └── index.ts
│   │   │   └── ProductBadge/
│   │   │
│   │   ├── cart/
│   │   │   ├── CartDrawer/
│   │   │   │   ├── CartDrawer.tsx
│   │   │   │   └── index.ts
│   │   │   ├── CartItem/
│   │   │   │   ├── CartItem.tsx
│   │   │   │   └── index.ts
│   │   │   └── CartSummary/
│   │   │       ├── CartSummary.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── checkout/
│   │   │   ├── CheckoutForm/
│   │   │   │   ├── CheckoutForm.tsx
│   │   │   │   ├── ContactFields.tsx
│   │   │   │   ├── AddressFields.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ShippingSelector/
│   │   │   │   ├── ShippingSelector.tsx
│   │   │   │   └── index.ts
│   │   │   ├── PaymentSelector/
│   │   │   │   ├── PaymentSelector.tsx
│   │   │   │   └── index.ts
│   │   │   └── OrderSummary/
│   │   │       ├── OrderSummary.tsx
│   │   │       └── index.ts
│   │   │
│   │   └── homepage/
│   │       ├── FeaturedProducts/
│   │       │   ├── FeaturedProducts.tsx
│   │       │   └── index.ts
│   │       ├── CategoryBanner/
│   │       │   ├── CategoryBanner.tsx
│   │       │   └── index.ts
│   │       └── PromoBanner/
│   │           ├── PromoBanner.tsx
│   │           └── index.ts
│   │
│   ├── payload/
│   │   ├── collections/
│   │   │   ├── Products.ts
│   │   │   ├── Categories.ts
│   │   │   ├── Orders.ts
│   │   │   ├── Users.ts
│   │   │   └── Redirects.ts
│   │   ├── globals/
│   │   │   └── HomepageSections.ts
│   │   └── hooks/
│   │       ├── beforeChange/
│   │       └── afterChange/
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   └── index.ts
│   │   ├── redis/
│   │   │   └── index.ts
│   │   ├── stripe/
│   │   │   └── index.ts
│   │   ├── gopay/
│   │   │   └── index.ts
│   │   ├── email/
│   │   │   └── index.ts
│   │   ├── r2/
│   │   │   └── index.ts
│   │   └── auth/
│   │       ├── jwt.ts
│   │       └── tokens.ts
│   │
│   ├── store/
│   │   ├── cartStore.ts
│   │   └── userStore.ts
│   │
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useAuth.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── types/
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── cart.ts
│   │   └── user.ts
│   │
│   ├── validators/
│   │   ├── checkout.ts
│   │   ├── auth.ts
│   │   └── product.ts
│   │
│   ├── i18n/
│   │   ├── routing.ts
│   │   ├── request.ts
│   │   └── messages/
│   │       ├── cs.json
│   │       └── en.json
│   │
│   └── middleware.ts
```