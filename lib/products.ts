export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  featured?: boolean;
  ingredients?: string;
  benefits?: string;
  usage?: string;
  stockUnit?: string;
}

export const products: Product[] = [
  // ===== SKINCARE =====
  {
    id: "1",
    name: "Suma Grand Cleanser",
    slug: "suma-grand-cleanser",
    category: "Skincare",
    description: "Gentle facial cleanser suitable for all skin types.",
    price: 3450,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "2",
    name: "Suma Grand Face Mask",
    slug: "suma-grand-face-mask",
    category: "Skincare",
    description: "Youth Essence Facial Mask for deep nourishment.",
    price: 2800,
    images: ["https://images.unsplash.com/photo-1596755389378-c31d21df4aae?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "3",
    name: "Suma Grand Toner",
    slug: "suma-grand-toner",
    category: "Skincare",
    description: "Refreshing toner that balances skin.",
    price: 3885,
    images: ["https://images.unsplash.com/photo-1629198688000-ef743fdab0c8?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "4",
    name: "Suma Grand Lotion",
    slug: "suma-grand-lotion",
    category: "Skincare",
    description: "Lightweight moisturizing lotion for daily hydration.",
    price: 4250,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "5",
    name: "Suma Grand Cream",
    slug: "suma-grand-cream",
    category: "Skincare",
    description: "Rich anti-aging cream that nourishes skin.",
    price: 5300,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: true,
  },
  // ===== NMN COLLECTION =====
  {
    id: "6",
    name: "NMN Sharp Mind Capsules",
    slug: "nmn-sharp-mind-capsules",
    category: "NMN Collection",
    description: "Premium brain health formula with NMN + Resveratrol.",
    price: 24830,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: true,
  },
  {
    id: "7",
    name: "NMN Duo Release CR Tablets",
    slug: "nmn-duo-release-cr-tablets",
    category: "NMN Collection",
    description: "Advanced NMN with controlled release technology.",
    price: 17280,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "8",
    name: "NMN 4500 Capsules",
    slug: "nmn-4500-capsules",
    category: "NMN Collection",
    description: "Premium NMN 4500 for anti-aging DNA repair.",
    price: 22450,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: true,
  },
  {
    id: "9",
    name: "NMN Coffee",
    slug: "nmn-coffee",
    category: "NMN Collection",
    description: "No-sugar-added coffee with NMN for longevity.",
    price: 3880,
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bc323340?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "10",
    name: "YouthEver Sachets",
    slug: "youthever-sachets",
    category: "NMN Collection",
    description: "Antioxidant formula with Resveratrol and NMN.",
    price: 4650,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  // ===== IMMUNE SUPPORT =====
  {
    id: "11",
    name: "Refined Yunzhi Essence Capsules",
    slug: "refined-yunzhi-essence-capsules",
    category: "Immune Support",
    description: "Premium Yunzhi extract with 300mg PSP per capsule.",
    price: 14500,
    images: ["https://images.unsplash.com/photo-1611241923585-91b4d5fa05b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "12",
    name: "Pure & Broken Ganoderma Spores Capsules",
    slug: "pure-broken-ganoderma-spores-capsules",
    category: "Immune Support",
    description: "Organic Ganoderma spores with 99% extraction.",
    price: 12100,
    images: ["https://images.unsplash.com/photo-1611241923585-91b4d5fa05b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "13",
    name: "Pure & Broken Ganoderma Spores Oil Deluxe",
    slug: "ganoderma-spores-oil-deluxe",
    category: "Immune Support",
    description: "Premium Ganoderma Spore Oil for immunity.",
    price: 19865,
    images: ["https://images.unsplash.com/photo-1611241923585-91b4d5fa05b?auto=format&fit=crop&q=80&w=800"],
    featured: true,
  },
  {
    id: "14",
    name: "Ganoderma Spores Oil Deluxe 3X",
    slug: "ganoderma-spores-oil-deluxe-3x",
    category: "Immune Support",
    description: "3X concentrated Ganoderma Spores Oil.",
    price: 19865,
    images: ["https://images.unsplash.com/photo-1611241923585-91b4d5fa05b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  // ===== MEN'S HEALTH =====
  {
    id: "15",
    name: "Xpower Man Plus Capsules",
    slug: "xpower-man-plus-capsules",
    category: "Men's Health",
    description: "US Patent formula for men's vitality and performance.",
    price: 6530,
    images: ["https://images.unsplash.com/photo-1544005313-94ddf0286cd2?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "16",
    name: "Xpower Coffee for Men",
    slug: "xpower-coffee-for-men",
    category: "Men's Health",
    description: "US Patent coffee blend for men's vitality.",
    price: 2350,
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bc323340?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "17",
    name: "ProstatRelax Capsules",
    slug: "prostatrelax-capsules",
    category: "Men's Health",
    description: "US Patent prostate health capsules for men 45+.",
    price: 3750,
    images: ["https://images.unsplash.com/photo-1544005313-94ddf0286cd2?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  // ===== WOMEN'S HEALTH =====
  {
    id: "18",
    name: "FemiCare Feminine Cleanser",
    slug: "femicare-feminine-cleanser",
    category: "Women's Health",
    description: "Antibacterial feminine cleanser for women.",
    price: 1840,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "19",
    name: "Feminergy Capsules",
    slug: "feminergy-capsules",
    category: "Women's Health",
    description: "Premium grape seed extract for skin beauty.",
    price: 6250,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  // ===== CHILDREN'S HEALTH =====
  {
    id: "20",
    name: "SmartKids Calcium & Vitamin D3",
    slug: "smartkids-calcium-vitamin-d3",
    category: "Children's Health",
    description: "Strawberry flavored calcium tablets for bone growth.",
    price: 3150,
    images: ["https://images.unsplash.com/photo-1598300042249-d99aafddd29d?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "21",
    name: "SmartKids Sharp Vision Tablets",
    slug: "smartkids-sharp-vision-tablets",
    category: "Children's Health",
    description: "Blueberry chewable tablets for eye health.",
    price: 3150,
    images: ["https://images.unsplash.com/photo-1598300042249-d99aafddd29d?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "22",
    name: "SmartKids Vitamin C 100mg",
    slug: "smartkids-vitamin-c-100mg",
    category: "Children's Health",
    description: "Orange-flavored Vitamin C tablets for immunity.",
    price: 2850,
    images: ["https://images.unsplash.com/photo-1598300042249-d99aafddd29d?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured);
}

export function getLatestProducts(count: number = 8): Product[] {
  return products.slice(0, count);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}

export function getCategories(): string[] {
  return [...new Set(products.map(p => p.category))];
}
