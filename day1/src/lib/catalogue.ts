export type Category = "men" | "women" | "kids" | "beauty";
export type Slot = "top" | "outer" | "bottom" | "full";
export type Garment = "coat" | "blazer" | "puffer" | "shirt" | "tee" | "knit" | "trouser" | "wide-trouser" | "slip-dress";

export interface Colour {
  id: string;
  name: string;
  hex: string;
}

export interface TryOn {
  enabled: boolean;
  slot?: Slot;
  /** Flat garment shape drawn for the overlay preview; recoloured per colour. */
  garment?: Garment;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  type: string;
  price: number;
  colours: Colour[];
  sizes: string[];
  soldOut?: string[];
  images: string[];
  isNew?: boolean;
  description: string;
  fabric: string;
  tryOn: TryOn;
}

const C = {
  oxblood: { id: "oxblood", name: "Oxblood", hex: "#5C1A1F" },
  camel: { id: "camel", name: "Camel", hex: "#B08A62" },
  black: { id: "black", name: "Black", hex: "#1C1A1A" },
  blush: { id: "blush", name: "Blush", hex: "#E9B9A4" },
  ink: { id: "ink", name: "Ink", hex: "#262033" },
  ecru: { id: "ecru", name: "Ecru", hex: "#E6DCCB" },
  white: { id: "white", name: "White", hex: "#F7F5F0" },
  stone: { id: "stone", name: "Stone", hex: "#CDBFA8" },
  navy: { id: "navy", name: "Navy", hex: "#23283A" },
  charcoal: { id: "charcoal", name: "Charcoal", hex: "#3A3A3C" },
  oat: { id: "oat", name: "Oat", hex: "#D8CBB5" },
  taupe: { id: "taupe", name: "Taupe", hex: "#8B7B6E" },
  sage: { id: "sage", name: "Sage", hex: "#8C9A82" },
  rust: { id: "rust", name: "Rust", hex: "#A04E2C" },
  cream: { id: "cream", name: "Cream", hex: "#EFE6D6" },
  garnet: { id: "garnet", name: "Garnet", hex: "#6B1E24" },
  rose: { id: "rose", name: "Rose", hex: "#B86B6B" },
} satisfies Record<string, Colour>;

const ADULT = ["XS", "S", "M", "L", "XL"];
const KIDS = ["4Y", "6Y", "8Y", "10Y", "12Y"];
const img = (id: string) => [`/images/products/${id}-1.webp`, `/images/products/${id}-2.webp`];

export const products: Product[] = [
  {
    id: "w-coat",
    name: "Oxblood Wool Coat",
    category: "women",
    type: "Coat",
    price: 12990,
    colours: [C.oxblood, C.camel, C.black],
    sizes: ADULT,
    images: img("w-coat"),
    isNew: true,
    description: "A long, single-breasted coat cut from double-faced wool. Clean lines, notch lapels and a knee-length fall.",
    fabric: "80% wool, 20% polyamide. Dry clean only.",
    tryOn: { enabled: true, slot: "outer", garment: "coat" },
  },
  {
    id: "w-dress",
    name: "Bias Satin Slip Dress",
    category: "women",
    type: "Dress",
    price: 6490,
    colours: [C.blush, C.ink, C.garnet],
    sizes: ADULT,
    soldOut: ["XS"],
    images: img("w-dress"),
    isNew: true,
    description: "Cut on the bias so it moves with you. Midi length, cowl neck and thin adjustable straps.",
    fabric: "100% viscose satin. Hand wash cold.",
    tryOn: { enabled: true, slot: "full", garment: "slip-dress" },
  },
  {
    id: "w-trouser",
    name: "Wide-Leg Pleated Trouser",
    category: "women",
    type: "Trousers",
    price: 5490,
    colours: [C.ecru, C.black],
    sizes: ADULT,
    images: img("w-trouser"),
    description: "High waist, front pleats and a pressed crease that runs to a floor-grazing hem.",
    fabric: "68% wool, 30% polyester, 2% elastane. Dry clean.",
    tryOn: { enabled: true, slot: "bottom", garment: "wide-trouser" },
  },
  {
    id: "w-shirt",
    name: "Oversized Poplin Shirt",
    category: "women",
    type: "Shirt",
    price: 3990,
    colours: [C.white, C.blush],
    sizes: ADULT,
    images: img("w-shirt"),
    isNew: true,
    description: "A crisp, boxy shirt with dropped shoulders and a classic point collar. Wear it tucked or loose.",
    fabric: "100% organic cotton poplin. Machine wash 30°.",
    tryOn: { enabled: true, slot: "top", garment: "shirt" },
  },
  {
    id: "w-bag",
    name: "Leather Shoulder Bag",
    category: "women",
    type: "Accessory",
    price: 7990,
    colours: [C.oxblood, C.black],
    sizes: ["One size"],
    images: img("w-bag"),
    description: "A small structured bag in smooth leather with a front flap and adjustable strap.",
    fabric: "100% bovine leather. Wipe clean.",
    tryOn: { enabled: false },
  },
  {
    id: "m-blazer",
    name: "Unstructured Linen Blazer",
    category: "men",
    type: "Blazer",
    price: 9490,
    colours: [C.stone, C.navy],
    sizes: ADULT,
    images: img("m-blazer"),
    isNew: true,
    description: "Soft shoulders, no lining, natural creases. Made for warm days and easy evenings.",
    fabric: "100% European linen. Dry clean.",
    tryOn: { enabled: true, slot: "outer", garment: "blazer" },
  },
  {
    id: "m-knit",
    name: "Merino Crew Sweater",
    category: "men",
    type: "Sweater",
    price: 4990,
    colours: [C.oxblood, C.charcoal, C.oat],
    sizes: ADULT,
    soldOut: ["XL"],
    images: img("m-knit"),
    description: "Fine-gauge extra-fine merino with ribbed neck, cuffs and hem. Regular fit.",
    fabric: "100% extra-fine merino wool. Hand wash cold.",
    tryOn: { enabled: true, slot: "top", garment: "knit" },
  },
  {
    id: "m-trouser",
    name: "Tapered Wool Trouser",
    category: "men",
    type: "Trousers",
    price: 5990,
    colours: [C.charcoal, C.taupe],
    sizes: ADULT,
    images: img("m-trouser"),
    description: "Mid-rise, single pleat and a slightly cropped, tapered leg.",
    fabric: "98% wool, 2% elastane. Dry clean.",
    tryOn: { enabled: true, slot: "bottom", garment: "trouser" },
  },
  {
    id: "m-tee",
    name: "Heavyweight Cotton Tee",
    category: "men",
    type: "T-shirt",
    price: 1990,
    colours: [C.white, C.black],
    sizes: ADULT,
    images: img("m-tee"),
    description: "Dense 240 gsm jersey with a thick ribbed collar and a relaxed, boxy fit.",
    fabric: "100% cotton. Machine wash 30°.",
    tryOn: { enabled: true, slot: "top", garment: "tee" },
  },
  {
    id: "k-jacket",
    name: "Quilted Kids Jacket",
    category: "kids",
    type: "Jacket",
    price: 3990,
    colours: [C.oxblood, C.sage],
    sizes: KIDS,
    images: img("k-jacket"),
    isNew: true,
    description: "Warm, light and easy to zip. Stitched channels and a stand-up collar.",
    fabric: "Shell 100% recycled polyester. Machine wash 30°.",
    // Try-on uses an adult's own photo (18+ consent), so kidswear is not tried on.
    tryOn: { enabled: false, slot: "outer" },
  },
  {
    id: "k-dungaree",
    name: "Cord Dungarees",
    category: "kids",
    type: "Dungarees",
    price: 2990,
    colours: [C.rust, C.cream],
    sizes: KIDS,
    images: img("k-dungaree"),
    description: "Soft wide-wale corduroy with a bib pocket and adjustable buckled straps.",
    fabric: "100% cotton corduroy. Machine wash 30°.",
    tryOn: { enabled: false, slot: "bottom" },
  },
  {
    id: "b-lipstick",
    name: "Satin Lipstick",
    category: "beauty",
    type: "Beauty",
    price: 1490,
    colours: [C.oxblood, C.rose],
    sizes: ["One size"],
    images: img("b-lipstick"),
    description: "A creamy satin finish with rich, even colour in one swipe.",
    fabric: "3.5 g. Vegan formula.",
    tryOn: { enabled: false },
  },
  {
    id: "b-perfume",
    name: "Rose Garnet Eau de Parfum",
    category: "beauty",
    type: "Beauty",
    price: 4490,
    colours: [C.blush],
    sizes: ["50 ml"],
    images: img("b-perfume"),
    isNew: true,
    description: "Damask rose over warm amber and a trace of pink pepper.",
    fabric: "50 ml. Alcohol-based fragrance.",
    tryOn: { enabled: false },
  },
];

export const categories: { id: Category; name: string; line: string; image?: string }[] = [
  { id: "men", name: "Men", line: "Soft tailoring and fine knits.", image: "/images/editorial/category-men.webp" },
  { id: "women", name: "Women", line: "Coats, satin and sharp shirting.", image: "/images/editorial/category-women.webp" },
  { id: "kids", name: "Kids", line: "Warm layers made to play in.", image: "/images/editorial/category-kids.webp" },
  { id: "beauty", name: "Beauty", line: "Colour and scent, in oxblood and rose." },
];

export const bestOf = ["w-coat", "m-knit", "w-dress", "m-blazer"];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const canTryOn = (p: Product) => p.tryOn.enabled && !!p.tryOn.garment;

/** Half-body photos can only show tops and outerwear (PRD §9). */
export const fitsMode = (p: Product, mode: "full" | "half") =>
  mode === "full" || p.tryOn.slot === "top" || p.tryOn.slot === "outer";

export const FREE_DELIVERY_THRESHOLD = 2999;
export const DELIVERY_FEE = 149;

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const formatPrice = (n: number) => inr.format(n);
