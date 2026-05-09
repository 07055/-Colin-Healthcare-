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
  // ===== NMN / Anti-Aging =====
  {
    id: "nmn-1",
    name: "NMN Selected 30 capsules",
    slug: "nmn-selected-30-capsules",
    category: "NMN / Anti-Aging",
    description: "Premium NMN supplement for anti-aging and cellular health.",
    price: 15370,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: true,
  },
  {
    id: "nmn-2",
    name: "NMN Sharp Mind",
    slug: "nmn-sharp-mind",
    category: "NMN / Anti-Aging",
    description: "Brain health formula with NMN + Resveratrol for cognitive support.",
    price: 24830,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: true,
  },
  {
    id: "nmn-3",
    name: "NMN Duo Release",
    slug: "nmn-duo-release",
    category: "NMN / Anti-Aging",
    description: "Advanced NMN with controlled release technology for sustained benefits.",
    price: 15370,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "nmn-4",
    name: "NMN Coffee 2 sachets",
    slug: "nmn-coffee",
    category: "NMN / Anti-Aging",
    description: "NMN Coffee - 2 sachets, 100/sachet for daily energy boost.",
    price: 3885,
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },

  // ===== Immunity Boosting =====
  {
    id: "imm-1",
    name: "Luce X Broken Ganoderma Oil 60 Deluxe",
    slug: "luce-x-broken-ganoderma-oil-60",
    category: "Immunity Boosting",
    description: "60 capsules premium immunity supplement.",
    price: 19865,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: true,
  },
  {
    id: "imm-2",
    name: "Luce X Broken Ganoderma Spores TM 60 capsules",
    slug: "luce-x-ganoderma-spores-60",
    category: "Immunity Boosting",
    description: "Powerful spore-based immunity booster.",
    price: 12100,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "imm-3",
    name: "Refined Yunzhi Essence 60 capsules",
    slug: "refined-yunzhi-essence-60",
    category: "Immunity Boosting",
    description: "Refined essence for immune system support.",
    price: 14500,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "imm-4",
    name: "Quad Reishi Capsules 60 capsules",
    slug: "quad-reishi-capsules-60",
    category: "Immunity Boosting",
    description: "Quad Reishi for comprehensive health support.",
    price: 5000,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },

  // ===== Digestive Health =====
  {
    id: "dig-1",
    name: "Suma Fit TM 30 sachets",
    slug: "suma-fit-30-sachets",
    category: "Digestive Health",
    description: "30 sachets for digestive wellness.",
    price: 4500,
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "dig-2",
    name: "Constrelax TM 30 sachets",
    slug: "constrelax-30-sachets",
    category: "Digestive Health",
    description: "30 sachets for digestive relief.",
    price: 3100,
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "dig-3",
    name: "Robio 3 sachets",
    slug: "robio-3-sachets",
    category: "Digestive Health",
    description: "3 sachets digestive health supplement.",
    price: 3100,
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "dig-4",
    name: "Veggie Veggie TM 15 sachets",
    slug: "veggie-veggie-15-sachets",
    category: "Digestive Health",
    description: "15 sachets vegetable-based digestive aid.",
    price: 4650,
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "dig-5",
    name: "EZ-Xlim TM Tablets 90 tabs",
    slug: "ez-xlim-90-tabs",
    category: "Digestive Health",
    description: "90 tablets - 1 tab = 90 bob for weight management.",
    price: 8075,
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "dig-6",
    name: "Novel-Depile TM 60 capsules",
    slug: "novel-depile-60-capsules",
    category: "Digestive Health",
    description: "60 capsules - 1 cap = 60 bob.",
    price: 3450,
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },

  // ===== Women's Beauty / Better Life =====
  {
    id: "wom-1",
    name: "Feminergy TM 60 capsules",
    slug: "feminergy-60-capsules",
    category: "Women's Beauty",
    description: "60 capsules - 1 cap = 80 bob for women's health.",
    price: 4650,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "wom-2",
    name: "Prostat Relax Capsules 60 capsules",
    slug: "prostat-relax-60-capsules",
    category: "Women's Beauty",
    description: "60 capsules - 1 cap = 70 bob.",
    price: 3750,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "wom-3",
    name: "X Power Coffee for Men 8 sachets",
    slug: "x-power-coffee-men-8",
    category: "Women's Beauty",
    description: "8 sachets energy coffee for men.",
    price: 2350,
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "wom-4",
    name: "X Power Man Capsules NMN TM 30 capsules",
    slug: "x-power-man-nmn-30",
    category: "Women's Beauty",
    description: "30 capsules NMN power supplement for men.",
    price: 6530,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },

  // ===== Betta Beauty / Suma Grand =====
  {
    id: "sgr-1",
    name: "Suma Grand Set 1: Cleanser + Lotion + Toner",
    slug: "suma-grand-set-1",
    category: "Betta Beauty / Suma Grand",
    description: "Complete skincare set: Cleanser, Lotion, Toner.",
    price: 11500,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: true,
  },
  {
    id: "sgr-2",
    name: "Suma Grand Set 2: Full Set + Mask + Cream",
    slug: "suma-grand-set-2",
    category: "Betta Beauty / Suma Grand",
    description: "Complete set: Cleanser, Lotion, Toner, Facemask, Cream.",
    price: 19550,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: true,
  },
  {
    id: "sgr-3",
    name: "Youth Refreshing Facial Cleanser",
    slug: "youth-facial-cleanser",
    category: "Betta Beauty / Suma Grand",
    description: "Gentle facial cleanser for refreshed skin.",
    price: 3450,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "sgr-4",
    name: "Youth Essence Lotion",
    slug: "youth-essence-lotion",
    category: "Betta Beauty / Suma Grand",
    description: "Hydrating lotion for youthful skin.",
    price: 3885,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "sgr-5",
    name: "Youth Essence Toner",
    slug: "youth-essence-toner",
    category: "Betta Beauty / Suma Grand",
    description: "Refreshing toner for balanced skin.",
    price: 4250,
    images: ["https://images.unsplash.com/photo-1629198688000-ef743fdab0c8?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "sgr-6",
    name: "Youth Essence Facial Mask",
    slug: "youth-facial-mask",
    category: "Betta Beauty / Suma Grand",
    description: "Nourishing facial mask for deep care.",
    price: 2800,
    images: ["https://images.unsplash.com/photo-1596755389378-c31d21df4aae?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "sgr-7",
    name: "Youth Essence Facial Cream",
    slug: "youth-facial-cream",
    category: "Betta Beauty / Suma Grand",
    description: "Rich cream for anti-aging benefits.",
    price: 5200,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },

  // ===== Cardiovascular & Blood Health =====
  {
    id: "car-1",
    name: "Heart & Blood 100 tablets",
    slug: "heart-blood-100",
    category: "Cardiovascular & Blood Health",
    description: "100 tablets for heart and blood health support.",
    price: 3450,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "car-2",
    name: "MicrO2 TM Cycle 60 tablets",
    slug: "micro2-cycle-60",
    category: "Cardiovascular & Blood Health",
    description: "60 tablets - 1 sachet = 100 bob for oxygen support.",
    price: 2800,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "car-3",
    name: "Cerebrain TM Tablets 60 tablets",
    slug: "cerebrain-60",
    category: "Cardiovascular & Blood Health",
    description: "60 tablets - 1 cap = 100 bob for brain health.",
    price: 2835,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "car-4",
    name: "Belivia TM 120 - 20 sachets",
    slug: "belivia-120-20",
    category: "Cardiovascular & Blood Health",
    description: "120 tablets - 20 sachets for blood health.",
    price: 4000,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "car-5",
    name: "Detoxlive TM Capsules 60 capsules",
    slug: "detoxlive-60",
    category: "Cardiovascular & Blood Health",
    description: "60 capsules for detox and liver support.",
    price: 2350,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "car-6",
    name: "Gymeffect Capsule 60 capsules",
    slug: "gymeffect-60",
    category: "Cardiovascular & Blood Health",
    description: "60 capsules - 1 cap = 53 bob for general health.",
    price: 3200,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },

  // ===== Bone & Joint Care =====
  {
    id: "bon-1",
    name: "Arthrokha Tablets 60 tablets",
    slug: "arthrokha-60",
    category: "Bone & Joint Care",
    description: "60 tablets for joint health and mobility.",
    price: 6250,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "bon-2",
    name: "Zammocal Plus TM Capsules 60 capsules",
    slug: "zammocal-plus-60",
    category: "Bone & Joint Care",
    description: "60 capsules for bone and joint support.",
    price: 3550,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "bon-3",
    name: "Gluzo Joint + TM 60 capsules",
    slug: "gluzo-joint-plus-60",
    category: "Bone & Joint Care",
    description: "60 capsules advanced joint formula.",
    price: 14350,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "bon-4",
    name: "Gluzo Joint Ultra Pro 4 in 1 60 capsules",
    slug: "gluzo-ultra-pro-4in1-60",
    category: "Bone & Joint Care",
    description: "60 capsules 4-in-1 comprehensive joint support.",
    price: 6350,
    images: ["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },

  // ===== Suma Baby & Self Care =====
  {
    id: "bab-1",
    name: "SmartKids Vitamin C 100mg Chewable",
    slug: "smartkids-vitamin-c",
    category: "Suma Baby & Kids",
    description: "Chewable Vitamin C for children's immune support.",
    price: 1500,
    images: ["https://images.unsplash.com/photo-1598300042249-d99aafddd29d?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "bab-2",
    name: "Sharp Vision Eye Health Chewable Tablet",
    slug: "sharp-vision-eye-health",
    category: "Suma Baby & Kids",
    description: "Chewable tablets for children's eye health.",
    price: 1500,
    images: ["https://images.unsplash.com/photo-1598300042249-d99aafddd29d?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "bab-3",
    name: "L3 90 tablets",
    slug: "l3-90-tablets",
    category: "Suma Baby & Kids",
    description: "90 tablets for children's daily nutrition.",
    price: 3450,
    images: ["https://images.unsplash.com/photo-1598300042249-d99aafddd29d?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "bab-4",
    name: "Calcium & Vitamin D3 Strawberry",
    slug: "calcium-vitamin-d3-strawberry",
    category: "Suma Baby & Kids",
    description: "Milk tablets with Calcium & Vitamin D3 - Strawberry Flavor.",
    price: 3150,
    images: ["https://images.unsplash.com/photo-1598300042249-d99aafddd29d?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },

  // ===== Suma Living Self Care =====
  {
    id: "liv-1",
    name: "Pris Toothpaste",
    slug: "pris-toothpaste",
    category: "Suma Living Self Care",
    description: "Premium toothpaste for oral hygiene.",
    price: 855,
    images: ["https://images.unsplash.com/photo-1585307607486-f0f8d8184b25?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "liv-2",
    name: "Anachi Herbal Soap",
    slug: "anachi-herbal-soap",
    category: "Suma Living Self Care",
    description: "Herbal soap for natural body care.",
    price: 3145,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "liv-3",
    name: "FemiCare TM 50 Feminine Cleanser",
    slug: "femicare-50",
    category: "Suma Living Self Care",
    description: "Feminine cleanser for intimate hygiene.",
    price: 1750,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "liv-4",
    name: "Cool Roll On",
    slug: "cool-roll-on",
    category: "Suma Living Self Care",
    description: "Cooling roll-on for body refreshment.",
    price: 1840,
    images: ["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },

  // ===== 4-in-1 Coffee Products =====
  {
    id: "cof-1",
    name: "4 in 1 Reishi Coffee",
    slug: "4in1-reishi-coffee",
    category: "4-in-1 Coffee",
    description: "1055 - 1563 bottles/sachet Reishi coffee blend.",
    price: 2050,
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "cof-2",
    name: "4 in 1 Ginseng Coffee",
    slug: "4in1-ginseng-coffee",
    category: "4-in-1 Coffee",
    description: "1250 bottles/sachet Ginseng coffee blend.",
    price: 2150,
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800"],
    featured: false,
  },
  {
    id: "cof-3",
    name: "2 in 1 Conductors Coffee",
    slug: "2in1-conductors-coffee",
    category: "4-in-1 Coffee",
    description: "4250 bottles - 11,500/sachet premium blend.",
    price: 4250,
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800"],
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