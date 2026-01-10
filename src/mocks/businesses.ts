import type { Business } from '@/types/domain'

export const mockBusinesses: Business[] = [
  {
    id: 'biz_claudio_barber',
    slug: 'claudios-barber',
    name: "Claudio's Barber",
    category: 'Barbershop',
    shortDescription: 'Clean fades, sharp beards, no drama. Book in under a minute.',
    rating: {
      score: 4.8,
      count: 412,
    },
    contact: {
      phone: '+34 600 123 456',
      email: 'hello@claudiosbarber.test',
    },
    address: {
      line1: 'Calle Real 21',
      city: 'Barcelona',
      region: 'Cataluña',
      postalCode: '08002',
      country: 'ES',
    },
    timezone: 'Europe/Madrid',
    workingHours: [
      { weekday: 1, start: '10:00', end: '19:00' },
      { weekday: 2, start: '10:00', end: '19:00' },
      { weekday: 3, start: '10:00', end: '19:00' },
      { weekday: 4, start: '10:00', end: '19:00' },
      { weekday: 5, start: '10:00', end: '18:00' },
    ],
    services: [
      {
        id: 'haircut',
        name: 'Haircut',
        durationMin: 30,
        priceCents: 1800,
        description: 'Consultation + cut + styling finish.',
        notes: 'Arrive 5 minutes early.',
      },
      {
        id: 'beard-trim',
        name: 'Beard trim',
        durationMin: 20,
        priceCents: 1400,
        description: 'Shape, line-up and hot towel finish.',
        notes: null,
      },
      {
        id: 'haircut-beard',
        name: 'Haircut + Beard',
        durationMin: 50,
        priceCents: 2900,
        description: 'Full combo service with detail work.',
        notes: 'Recommended for first-time clients.',
      },
    ],
    reviews: [
      {
        id: 'rev_1',
        quote: 'Best fade I had in years.',
        author: 'Alex M.',
      },
      {
        id: 'rev_2',
        quote: 'Quick, clean, and friendly.',
        author: 'Sara P.',
      },
      {
        id: 'rev_3',
        quote: 'Beard trim was spot on.',
        author: 'Jon D.',
      },
    ],
    theme: {
      colors: {
        primary: '188 85% 42%',
        background: '210 40% 98%',
        foreground: '222 47% 11%',
        surface: '0 0% 100%',
        border: '214 32% 91%',
        muted: '210 40% 96%',
      },
      radius: '14px',
      fontSansKey: 'manrope',
      buttonStyle: 'soft',
    },
    heroImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=600&fit=crop',
    gallery: [
      {
        id: 'img_1',
        src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
        alt: 'Modern barbershop interior with vintage chairs',
      },
      {
        id: 'img_2',
          src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop',
          alt: 'Barber working on a customer haircut',
      },
      {
        id: 'img_3',
        src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=300&fit=crop',
        alt: 'Close-up of professional barbering tools',
      },
    ],
    about: {
      title: 'Where craft meets conversation',
      description:
        "We're a neighborhood barbershop built on precision cuts and good vibes. No rush, no gimmicks—just solid work from barbers who care about the details. Walk-ins welcome, but booking ahead means you skip the wait.",
    },
    highlights: [
      {
        id: 'h1',
        label: 'Expert barbers',
        icon: 'scissors',
      },
      {
        id: 'h2',
        label: 'Premium products',
        icon: 'sparkles',
      },
      {
        id: 'h3',
        label: 'Walk-ins welcome',
        icon: 'clock',
      },
      {
        id: 'h4',
        label: 'Clean & safe',
        icon: 'shield',
      },
    ],
    social: {
      instagram: 'https://instagram.com/claudiosbarber',
    },
    loyalty: {
      enabled: true,
      target: 8,
      rewardLabel: 'Free haircut',
    },
    googleReviewUrl: 'https://g.page/r/claudiosbarber/review',
  },
  {
    id: 'biz_lumen_physio',
    slug: 'lumen-physio',
    name: 'Lumen Physio Clinic',
    category: 'Physiotherapy',
    shortDescription: 'Recover faster with evidence-based treatment and calm care.',
    rating: {
      score: 4.9,
      count: 198,
    },
    contact: {
      phone: '+34 611 987 654',
      email: 'contact@lumenphysio.test',
    },
    address: {
      line1: 'Avenida del Sol 8',
      city: 'Valencia',
      region: 'Comunidad Valenciana',
      postalCode: '46001',
      country: 'ES',
    },
    timezone: 'Europe/Madrid',
    workingHours: [
      { weekday: 1, start: '09:00', end: '18:00' },
      { weekday: 2, start: '09:00', end: '18:00' },
      { weekday: 3, start: '09:00', end: '18:00' },
      { weekday: 4, start: '09:00', end: '18:00' },
    ],
    services: [
      {
        id: 'initial-assessment',
        name: 'Initial assessment',
        durationMin: 45,
        priceCents: 5500,
        description: 'Full evaluation + treatment plan.',
        notes: null,
      },
      {
        id: 'follow-up',
        name: 'Follow-up session',
        durationMin: 30,
        priceCents: 4200,
        description: 'Targeted therapy + guided exercises.',
        notes: 'Wear comfortable clothing.',
      },
    ],
    reviews: [
      {
        id: 'rev_1',
        quote: 'Felt better after the first session.',
        author: 'Laura G.',
      },
      {
        id: 'rev_2',
        quote: 'Professional and calming experience.',
        author: 'Miguel T.',
      },
    ],
    theme: {
      colors: {
        primary: '220 75% 50%',
        background: '210 40% 98%',
        foreground: '222 47% 11%',
        surface: '0 0% 100%',
        border: '214 32% 91%',
        muted: '210 40% 96%',
      },
      radius: '10px',
      fontSansKey: 'inter',
      buttonStyle: 'solid',
    },
  },
]

export const getBusinessBySlug = (slug: string): Business | null => {
  return mockBusinesses.find((b) => b.slug === slug) ?? null
}

export const getAllBusinessSlugs = (): string[] => {
  return mockBusinesses.map((b) => b.slug)
}
