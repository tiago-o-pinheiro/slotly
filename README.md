# Booking Platform - Multi-Tenant Landing Module

A modern, customer-facing landing page module for a multi-tenant booking SaaS. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Multi-tenant Architecture**: Each business has its own landing page accessible via `/b/[slug]`
- **Service Showcase**: Expandable service cards with pricing and duration
- **Business Information**: Contact details, address, and opening hours
- **Social Proof**: Customer reviews and testimonials
- **Responsive Design**: Mobile-first approach with sticky CTA on mobile
- **Accessible**: Semantic HTML and keyboard-friendly interactions
- **Type-Safe**: Full TypeScript support with no `any` types
- **Mock Data**: Runs entirely frontend with mock business data

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge
- **Validation**: Zod (ready for future API integration)
- **Package Manager**: pnpm

## Project Structure

```
src/
├── app/
│   ├── b/[slug]/
│   │   ├── book/page.tsx    # Booking placeholder page
│   │   └── page.tsx          # Business landing page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page (business listing)
│   ├── not-found.tsx         # 404 page
│   └── globals.css           # Global styles
├── components/
│   ├── ServiceCard.tsx       # Expandable service card component
│   └── WorkingHoursDisplay.tsx # Opening hours component
├── lib/
│   ├── classNames.ts         # clsx + tailwind-merge utility
│   └── format.ts             # Price and duration formatters
├── mocks/
│   └── businesses.ts         # Mock business data
└── types/
    └── domain.ts             # TypeScript domain types
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Available Routes

- `/` - Home page listing all demo businesses
- `/b/[slug]` - Business landing page (try `/b/barber-shop-downtown`)
- `/b/[slug]/book` - Booking placeholder page
- Deep linking: `/b/[slug]?service=service-id` - Highlights specific service

## Demo Businesses

The application includes 3 demo businesses:

1. **Downtown Barber Studio** (`/b/barber-shop-downtown`)
2. **Uptown Beauty Lounge** (`/b/beauty-salon-uptown`)
3. **Serenity Wellness & Spa** (`/b/wellness-spa-center`)

## Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Code Standards

- **No `any` types**: All TypeScript must be explicitly typed
- **Arrow functions only**: No `function` declarations
- **ESLint + Prettier**: Single quotes, no semicolons, 100 char width
- **Absolute imports**: Use `@/*` for imports
- **Avoid 'new' keyword**: Do not use 'new' in variable/function names

## Acceptance Criteria

✅ Running `pnpm dev` renders index page with links to businesses
✅ Visiting `/b/[slug]` shows correct landing content from mock data
✅ Services expand/collapse and display duration + price + description
✅ CTA 'Book now' links to `/b/[slug]/book` (placeholder page)
✅ Unknown slug shows friendly 404 page
✅ No TypeScript `any`, arrow functions only
✅ Responsive design with Tailwind CSS

## Future Enhancements

- Full booking flow implementation
- Real API integration (backend)
- Payment processing
- Email notifications
- Calendar integration
- User authentication
- Business dashboard (admin panel)

## License

This is a demo project for educational purposes.
