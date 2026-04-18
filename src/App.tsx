import { useEffect, useMemo, useRef, useState } from "react";

type ThemeKey = "hacker" | "cyberpunk" | "ultrasonic" | "quantum" | "nova";
type PageKey = "home" | "about" | "careers" | "contact" | "shipping" | "returns" | "warranty" | "faqs" | "privacy" | "terms";

type Product = {
  id: string;
  name: string;
  brand: string;
  category: "earbuds" | "headphones" | "mobile" | "skincare";
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  features: string[];
  for?: "male" | "female" | "unisex";
  stock: number;
  badge?: string;
};

type CartItem = { product: Product; qty: number };

const THEMES: Record<ThemeKey, {
  name: string;
  bg: string;
  bg2: string;
  surface: string;
  surface2: string;
  text: string;
  textDim: string;
  primary: string;
  accent: string;
  danger: string;
  border: string;
  ring: string;
  gradient: string;
  font: string;
}> = {
  hacker: {
    name: "Hacker",
    bg: "#000805",
    bg2: "#00140a",
    surface: "#03160e",
    surface2: "#042116",
    text: "#d1ffe0",
    textDim: "#7bdba0",
    primary: "#00ff41",
    accent: "#00e676",
    danger: "#ff3b3b",
    border: "rgba(0,255,65,0.25)",
    ring: "rgba(0,255,65,0.5)",
    gradient: "linear-gradient(135deg,#00ff41 0%,#00b248 100%)",
    font: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  cyberpunk: {
    name: "Cyberpunk",
    bg: "#0a0014",
    bg2: "#17002e",
    surface: "#1a0033",
    surface2: "#250042",
    text: "#ffe4ff",
    textDim: "#c9a6ff",
    primary: "#ff00d6",
    accent: "#00f0ff",
    danger: "#ff3d71",
    border: "rgba(255,0,214,0.3)",
    ring: "rgba(0,240,255,0.5)",
    gradient: "linear-gradient(135deg,#ff00d6 0%,#7c3aed 50%,#00f0ff 100%)",
    font: "Outfit, Inter, system-ui, sans-serif",
  },
  ultrasonic: {
    name: "Ultrasonic",
    bg: "#001320",
    bg2: "#002640",
    surface: "#002e4f",
    surface2: "#003a63",
    text: "#e0f7ff",
    textDim: "#7dd3fc",
    primary: "#00d4ff",
    accent: "#38bdf8",
    danger: "#fb7185",
    border: "rgba(0,212,255,0.25)",
    ring: "rgba(56,189,248,0.5)",
    gradient: "linear-gradient(135deg,#00d4ff 0%,#0284c7 100%)",
    font: "Inter, system-ui, sans-serif",
  },
  quantum: {
    name: "Quantum",
    bg: "#0b001a",
    bg2: "#14002e",
    surface: "#1e0b38",
    surface2: "#2a154d",
    text: "#f3e8ff",
    textDim: "#c4b5fd",
    primary: "#a855f7",
    accent: "#6366f1",
    danger: "#f43f5e",
    border: "rgba(168,85,247,0.3)",
    ring: "rgba(99,102,241,0.5)",
    gradient: "linear-gradient(135deg,#a855f7 0%,#6366f1 100%)",
    font: "Space Grotesk, Inter, system-ui, sans-serif",
  },
  nova: {
    name: "Nova",
    bg: "#f8fafc",
    bg2: "#ffffff",
    surface: "#ffffff",
    surface2: "#f1f5f9",
    text: "#0f172a",
    textDim: "#475569",
    primary: "#0ea5e9",
    accent: "#0284c7",
    danger: "#ef4444",
    border: "rgba(148,163,184,0.25)",
    ring: "rgba(14,165,233,0.4)",
    gradient: "linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)",
    font: "Inter, system-ui, -apple-system, sans-serif",
  },
};

const PRODUCTS: Product[] = [
  // Earbuds
  {
    id: "e1",
    name: "AirPods Pro (2nd Gen) USB-C",
    brand: "Apple",
    category: "earbuds",
    price: 249,
    originalPrice: 279,
    rating: 4.8,
    reviews: 18432,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format",
    features: ["Active Noise Cancellation", "Adaptive Audio", "USB-C"],
    stock: 42,
    badge: "Best Seller",
  },
  {
    id: "e2",
    name: "WF-1000XM5",
    brand: "Sony",
    category: "earbuds",
    price: 299,
    rating: 4.7,
    reviews: 9211,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format",
    features: ["Industry-leading ANC", "8.4g buds", "Hi-Res Audio"],
    stock: 28,
  },
  {
    id: "e3",
    name: "Galaxy Buds2 Pro",
    brand: "Samsung",
    category: "earbuds",
    price: 229,
    originalPrice: 249,
    rating: 4.6,
    reviews: 7543,
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?q=80&w=800&auto=format",
    features: ["24-bit Hi-Fi", "360 Audio", "IPX7"],
    stock: 56,
  },
  {
    id: "e4",
    name: "Ear (2)",
    brand: "Nothing",
    category: "earbuds",
    price: 149,
    rating: 4.5,
    reviews: 4120,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=800&auto=format",
    features: ["Transparent design", "LHDC", "Personal sound"],
    stock: 71,
    badge: "New",
  },
  {
    id: "e5",
    name: "Beats Fit Pro",
    brand: "Beats",
    category: "earbuds",
    price: 199,
    rating: 4.6,
    reviews: 6834,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format",
    features: ["Secure-fit wingtips", "Spatial Audio", "Apple H1"],
    stock: 33,
  },
  // Headphones
  {
    id: "h1",
    name: "WH-1000XM5",
    brand: "Sony",
    category: "headphones",
    price: 399,
    originalPrice: 429,
    rating: 4.9,
    reviews: 15420,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format",
    features: ["30h battery", "8 mics ANC", "Multipoint"],
    stock: 19,
    badge: "Editors' Choice",
  },
  {
    id: "h2",
    name: "QuietComfort Ultra",
    brand: "Bose",
    category: "headphones",
    price: 429,
    rating: 4.7,
    reviews: 8732,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format",
    features: ["Immersive Audio", "CustomTune", "24h"],
    stock: 24,
  },
  {
    id: "h3",
    name: "AirPods Max",
    brand: "Apple",
    category: "headphones",
    price: 549,
    rating: 4.6,
    reviews: 11290,
    image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=800&auto=format",
    features: ["Computational audio", "Aluminum cups", "Spatial Audio"],
    stock: 15,
  },
  {
    id: "h4",
    name: "Momentum 4 Wireless",
    brand: "Sennheiser",
    category: "headphones",
    price: 379,
    originalPrice: 399,
    rating: 4.7,
    reviews: 5431,
    image: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?q=80&w=800&auto=format",
    features: ["60h battery", "Adaptive ANC", "Audiophile tuning"],
    stock: 31,
  },
  {
    id: "h5",
    name: "Studio Pro",
    brand: "Beats",
    category: "headphones",
    price: 349,
    rating: 4.5,
    reviews: 4321,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format",
    features: ["Lossless USB-C", "ANC", "40h"],
    stock: 44,
    badge: "Sale",
  },
  // Mobile
  {
    id: "m1",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "mobile",
    price: 1199,
    rating: 4.8,
    reviews: 22100,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format",
    features: ["A17 Pro", "Titanium", "5x Telephoto"],
    stock: 12,
    badge: "Flagship",
  },
  {
    id: "m2",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "mobile",
    price: 1299,
    rating: 4.7,
    reviews: 18450,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format",
    features: ["200MP", "Snapdragon 8 Gen 3", "S Pen"],
    stock: 18,
  },
  {
    id: "m3",
    name: "Pixel 8 Pro",
    brand: "Google",
    category: "mobile",
    price: 999,
    originalPrice: 1099,
    rating: 4.6,
    reviews: 9320,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format",
    features: ["Tensor G3", "AI camera", "7yr updates"],
    stock: 27,
  },
  {
    id: "m4",
    name: "Phone (2)",
    brand: "Nothing",
    category: "mobile",
    price: 699,
    rating: 4.5,
    reviews: 5120,
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=800&auto=format",
    features: ["Glyph Interface", "120Hz OLED", "Clean OS"],
    stock: 39,
    badge: "Trending",
  },
  {
    id: "m5",
    name: "OnePlus 12",
    brand: "OnePlus",
    category: "mobile",
    price: 799,
    rating: 4.6,
    reviews: 6780,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=800&auto=format",
    features: ["Snapdragon 8 Gen 3", "100W", "Hasselblad"],
    stock: 22,
  },
  // Skincare
  {
    id: "s1",
    name: "LUNA 4 Facial Cleansing Device",
    brand: "FOREO",
    category: "skincare",
    price: 219,
    rating: 4.8,
    reviews: 3421,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=800&auto=format",
    features: ["Swedish tech", "2-min routine", "Waterproof"],
    for: "unisex",
    stock: 64,
  },
  {
    id: "s2",
    name: "Spectralite FaceWare Pro LED Mask",
    brand: "Dr. Dennis Gross",
    category: "skincare",
    price: 435,
    rating: 4.7,
    reviews: 1893,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format",
    features: ["3min treatment", "Red + Blue LED", "FDA-cleared"],
    for: "female",
    stock: 11,
    badge: "Pro",
  },
  {
    id: "s3",
    name: "TheraFace PRO 4-in-1",
    brand: "Therabody",
    category: "skincare",
    price: 399,
    originalPrice: 449,
    rating: 4.6,
    reviews: 2104,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format",
    features: ["Percussive + LED + Microcurrent", "6 attachments"],
    for: "unisex",
    stock: 29,
  },
  {
    id: "s4",
    name: "Purifying Charcoal Cleanser",
    brand: "Brickell",
    category: "skincare",
    price: 25,
    rating: 4.5,
    reviews: 5422,
    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=800&auto=format",
    features: ["Jojoba + Aloe", "Oil control", "Natural"],
    for: "male",
    stock: 120,
  },
  {
    id: "s5",
    name: "Hyalu B5 Serum",
    brand: "La Roche-Posay",
    category: "skincare",
    price: 45,
    rating: 4.8,
    reviews: 8930,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format",
    features: ["2x hyaluronic", "Vitamin B5", "Dermatologist tested"],
    for: "female",
    stock: 88,
    badge: "Dermatologist",
  },
];

function cn(...s: (string | false | undefined)[]) {
  return s.filter(Boolean).join(" ");
}

export default function App() {
  const [theme, setTheme] = useState<ThemeKey>(() => (localStorage.getItem("oxin-theme") as ThemeKey) || "quantum");
  const [isAuthed, setIsAuthed] = useState(() => localStorage.getItem("oxin-auth") === "1");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | Product["category"]>("all");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("oxin-cart") || "[]"); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("oxin-wish") || "[]"); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<PageKey | "home">("home");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"form"|"success">("form");
  const [checkoutForm, setCheckoutForm] = useState({ name:"", email:"", address:"", city:"", card:"", expiry:"", cvv:"" });

  const t = THEMES[theme];

  useEffect(() => { localStorage.setItem("oxin-theme", theme); }, [theme]);
  useEffect(() => { localStorage.setItem("oxin-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("oxin-wish", JSON.stringify(wishlist)); }, [wishlist]);

  useEffect(() => {
    document.documentElement.style.setProperty("--ox-bg", t.bg);
    document.documentElement.style.setProperty("--ox-bg2", t.bg2);
    document.documentElement.style.setProperty("--ox-surface", t.surface);
    document.documentElement.style.setProperty("--ox-surface2", t.surface2);
    document.documentElement.style.setProperty("--ox-text", t.text);
    document.documentElement.style.setProperty("--ox-text-dim", t.textDim);
    document.documentElement.style.setProperty("--ox-primary", t.primary);
    document.documentElement.style.setProperty("--ox-accent", t.accent);
    document.documentElement.style.setProperty("--ox-border", t.border);
    document.documentElement.style.setProperty("--ox-ring", t.ring);
    document.body.style.background = t.bg;
    document.body.style.color = t.text;
    document.body.style.fontFamily = t.font;
  }, [t]);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p => category === "all" || p.category === category);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.features.some(f => f.toLowerCase().includes(q)));
    }
    switch (sort) {
      case "price-asc": list.sort((a,b)=>a.price-b.price); break;
      case "price-desc": list.sort((a,b)=>b.price-a.price); break;
      case "rating": list.sort((a,b)=>b.rating-a.rating); break;
    }
    return list;
  }, [category, query, sort]);

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.product.price * i.qty, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (!email.includes("@") || password.length < 6) {
      setLoginError("Enter a valid email and password (min 6 chars).");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsAuthed(true);
      localStorage.setItem("oxin-auth", "1");
      showToast(`Welcome to Oxin, ${email.split("@")[0]}!`);
    }, 900);
  }

  function addToCart(p: Product) {
    setCart(c => {
      const ex = c.find(i => i.product.id === p.id);
      if (ex) return c.map(i => i.product.id === p.id ? {...i, qty: i.qty+1} : i);
      return [...c, { product: p, qty: 1 }];
    });
    showToast(`Added ${p.name} to cart`);
  }
  function toggleWish(id: string) {
    setWishlist(w => w.includes(id) ? w.filter(x=>x!==id) : [...w, id]);
  }

  function navigate(page: PageKey | "home") {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToCategory(cat: "all" | Product["category"]) {
    setCategory(cat);
    setCurrentPage("home");
    setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  const productsRef = useRef<HTMLElement>(null);

  // Matrix rain for hacker theme
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (theme !== "hacker" || !isAuthed) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const cols = Math.floor(w / 14);
    const ypos = Array(cols).fill(0);
    const chars = "OXIN01";
    let raf = 0;
    function draw() {
      ctx.fillStyle = "rgba(0,8,5,0.08)";
      ctx.fillRect(0,0,w,h);
      ctx.fillStyle = "#00ff41";
      ctx.font = "14px JetBrains Mono";
      ypos.forEach((y, i) => {
        const text = chars[Math.floor(Math.random()*chars.length)];
        ctx.fillText(text, i*14, y);
        ypos[i] = y > h + Math.random()*10000 ? 0 : y + 14;
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [theme, isAuthed]);

  if (!isAuthed) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden" style={{ background: `radial-gradient(1200px 800px at 80% -10%, ${t.bg2}, transparent), radial-gradient(800px 600px at -10% 20%, ${t.surface2}, transparent), ${t.bg}` }}>
        {/* animated grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: `linear-gradient(${t.border} 1px, transparent 1px), linear-gradient(90deg, ${t.border} 1px, transparent 1px)`,
          backgroundSize: "48px 48px"
        }} />
        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
            {/* Brand panel */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-10 blur-3xl opacity-30" style={{ background: t.gradient }} />
                <div className="relative rounded-[2rem] border p-10 backdrop-blur-xl" style={{ background: `${t.surface}cc`, borderColor: t.border }}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: t.gradient, boxShadow: `0 0 40px ${t.ring}` }}>
                      <span className="text-black font-black text-xl">O</span>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold tracking-tight">Oxin.com</div>
                      <div className="text-sm" style={{ color: t.textDim }}>Futuristic Tech Store</div>
                    </div>
                  </div>
                  <h1 className="text-4xl xl:text-5xl font-semibold leading-tight mb-4">
                    The future, simplified.<br/>
                  </h1>
                  <p className="text-base mb-8 max-w-md" style={{ color: t.textDim }}>
                    Earbuds, headphones, mobiles, and pro skincare tech. Built for speed, crafted for pros.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(THEMES).map(([k, th]) => (
                      <button key={k} onClick={()=>setTheme(k as ThemeKey)} className={cn("group rounded-2xl border p-3 text-left transition", theme===k && "ring-2")} style={{ background: th.surface, borderColor: th.border, ...(theme===k?{boxShadow:`0 0 0 2px ${th.ring}`} : {}) }}>
                        <div className="h-8 w-full rounded-lg mb-2" style={{ background: th.gradient }} />
                        <div className="text-xs font-medium">{th.name}</div>
                        <div className="text-[10px] opacity-70">{k}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Login card */}
            <div className="w-full max-w-md mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 rounded-[2rem] blur-2xl opacity-40" style={{ background: t.gradient }} />
                <div className="relative rounded-[2rem] border shadow-2xl backdrop-blur-xl overflow-hidden" style={{ background: `${t.surface}ee`, borderColor: t.border }}>
                  <div className="px-8 pt-8 pb-4 border-b" style={{ borderColor: t.border, background: `linear-gradient(180deg, ${t.surface2}, transparent)` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl grid place-items-center" style={{ background: t.gradient }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v6c0 5-3.5 9.74-8 10-4.5-.26-8-5-8-10V6l8-4z" stroke="black" strokeWidth="1.5" fill="white" fillOpacity="0.9"/></svg>
                        </div>
                        <div>
                          <div className="font-semibold leading-none">Secure Login</div>
                          <div className="text-xs" style={{ color: t.textDim }}>Oxin ID • Encrypted</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border" style={{ borderColor: t.border, color: t.textDim }}>
                        <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: t.primary }}/>
                        TLS 1.3
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleLogin} className="p-8 space-y-5">
                    <div>
                      <label className="text-xs mb-1.5 block" style={{ color: t.textDim }}>Email</label>
                      <div className="relative">
                        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@oxin.com" className="w-full rounded-xl border bg-transparent px-3.5 py-3 outline-none transition" style={{ borderColor: t.border, background: t.bg }} onFocus={e=>e.currentTarget.style.boxShadow=`0 0 0 3px ${t.ring}`} onBlur={e=>e.currentTarget.style.boxShadow="none"} />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs" style={{ color: t.textDim }}>Password</label>
                        <button type="button" onClick={()=>setShowPass(s=>!s)} className="text-xs hover:underline" style={{ color: t.primary }}>{showPass?"Hide":"Show"}</button>
                      </div>
                      <div className="relative">
                        <input value={password} onChange={e=>setPassword(e.target.value)} type={showPass?"text":"password"} placeholder="••••••••" className="w-full rounded-xl border bg-transparent px-3.5 py-3 pr-10 outline-none transition" style={{ borderColor: t.border, background: t.bg }} onFocus={e=>e.currentTarget.style.boxShadow=`0 0 0 3px ${t.ring}`} onBlur={e=>e.currentTarget.style.boxShadow="none"} />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                        </div>
                      </div>
                    </div>
                    {loginError && <div className="text-xs px-3 py-2 rounded-lg border" style={{ borderColor: t.danger, color: t.danger, background: `${t.danger}15` }}>{loginError}</div>}
                    <button disabled={loading} className="group relative w-full overflow-hidden rounded-xl py-3.5 font-medium text-black transition active:scale-[0.99] disabled:opacity-60" style={{ background: t.gradient }}>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black"/>}
                        {loading ? "Authenticating..." : "Enter Store"}
                      </span>
                      <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition" style={{ background: "rgba(255,255,255,0.15)" }}/>
                    </button>
                    <div className="flex items-center justify-between text-xs" style={{ color: t.textDim }}>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" className="accent-current" defaultChecked/>
                        Remember me
                      </label>
                      <button type="button" className="hover:underline">Forgot password?</button>
                    </div>
                    <div className="pt-4 border-t grid grid-cols-2 gap-2" style={{ borderColor: t.border }}>
                      <button type="button" onClick={()=>{setEmail("demo@oxin.com"); setPassword("oxin123");}} className="rounded-xl border py-2.5 text-sm transition hover:translate-y-[-1px]" style={{ borderColor: t.border, background: t.surface2 }}>Use demo</button>
                      <button type="button" onClick={()=>showToast("Passkeys coming soon")} className="rounded-xl border py-2.5 text-sm transition hover:translate-y-[-1px]" style={{ borderColor: t.border, background: t.surface2 }}>Passkey</button>
                    </div>
                  </form>
                  <div className="px-8 pb-8">
                    <div className="grid grid-cols-3 gap-3 text-[11px]" style={{ color: t.textDim }}>
                      {["SOC2 Ready", "256-bit AES", "Zero-trust"].map(b=>(
                        <div key={b} className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.primary }}/>
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs" style={{ color: t.textDim }}>
                <span>© {new Date().getFullYear()} Oxin.com</span>
                <span>•</span>
                <span>5 themes • Hacker • Cyberpunk • Ultrasonic • Quantum • Nova</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated store
  return (
    <div className="min-h-screen w-full" style={{ background: t.bg, color: t.text }}>
      {theme==="hacker" && <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 opacity-[0.12]" />}
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: `${t.bg}cc`, borderColor: t.border }}>
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 h-[68px] flex items-center gap-3">
          <button onClick={() => navigate("home")} className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 rounded-xl grid place-items-center shrink-0" style={{ background: t.gradient, boxShadow: `0 8px 24px ${t.ring}` }}>
              <span className="text-black font-black">O</span>
            </div>
            <div className="min-w-0 text-left">
              <div className="font-semibold tracking-tight leading-none">Oxin<span className="opacity-70">.com</span></div>
              <div className="text-[10px]" style={{ color: t.textDim }}>Futuristic Store</div>
            </div>
          </button>
          <div className="hidden md:flex items-center gap-2 ml-4">
            {(["all","earbuds","headphones","mobile","skincare"] as const).map(c=>(
              <button key={c} onClick={()=>goToCategory(c)} className={cn("px-3 py-1.5 rounded-full text-sm border transition", category===c && "text-black")} style={{ borderColor: t.border, background: category===c ? t.primary : "transparent", color: category===c ? "black" : t.text }}>
                {c[0].toUpperCase()+c.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="hidden lg:flex items-center gap-2 w-[360px] max-w-[40vw]">
            <div className="relative w-full">
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products, brands, features…" className="w-full rounded-full border pl-10 pr-3 py-2.5 text-sm outline-none" style={{ background: t.surface, borderColor: t.border }} />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="hidden sm:flex items-center gap-0.5 p-1 rounded-full border" style={{ borderColor: t.border, background: t.surface }}>
              {(Object.keys(THEMES) as ThemeKey[]).map(k=>(
                <button key={k} onClick={()=>setTheme(k)} title={THEMES[k].name} className="h-7 w-7 rounded-full grid place-items-center transition" style={{ background: THEMES[k].gradient, ...(theme===k?{boxShadow:`0 0 0 2px ${THEMES[k].ring}`, outline: `2px solid ${THEMES[k].primary}`} : {}) }}>
                  <span className="sr-only">{k}</span>
                </button>
              ))}
            </div>
            <button onClick={()=>setCartOpen(true)} className="relative h-10 w-10 grid place-items-center rounded-full border transition hover:scale-105" style={{ borderColor: t.border, background: t.surface }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {cartCount>0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full text-[10px] font-bold text-black" style={{ background: t.primary }}>{cartCount}</span>}
            </button>
            <button onClick={()=>{localStorage.removeItem("oxin-auth"); setIsAuthed(false);}} className="h-10 w-10 grid place-items-center rounded-full border" style={{ borderColor: t.border, background: t.surface }} title="Logout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
        {/* mobile search */}
        <div className="lg:hidden px-4 pb-2">
          <div className="relative">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search…" className="w-full rounded-xl border pl-9 pr-3 py-2.5 text-sm" style={{ background: t.surface, borderColor: t.border }} />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
        {/* mobile theme switcher */}
        <div className="sm:hidden px-4 pb-3 flex items-center gap-2">
          <span className="text-xs shrink-0" style={{ color: t.textDim }}>Theme:</span>
          <div className="flex items-center gap-1.5 p-1 rounded-full border" style={{ borderColor: t.border, background: t.surface }}>
            {(Object.keys(THEMES) as ThemeKey[]).map(k=>(
              <button key={k} onClick={()=>setTheme(k)} title={THEMES[k].name} className="h-6 w-6 rounded-full transition" style={{ background: THEMES[k].gradient, ...(theme===k?{boxShadow:`0 0 0 2px ${THEMES[k].ring}`, outline: `2px solid ${THEMES[k].primary}`} : {}) }}>
                <span className="sr-only">{k}</span>
              </button>
            ))}
          </div>
          <span className="text-xs ml-1" style={{ color: t.primary }}>{THEMES[theme].name}</span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30" style={{ background: `radial-gradient(800px 400px at 20% -10%, ${t.primary}22, transparent), radial-gradient(600px 300px at 90% 0%, ${t.accent}22, transparent)` }} />
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs mb-4" style={{ borderColor: t.border, background: `${t.surface}aa` }}>
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: t.primary }}/>
                Live inventory • Ships in 24h
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-semibold leading-[1.05] tracking-tight">
                The tech you want.
                <br />
                <span style={{ background: t.gradient, WebkitBackgroundClip: "text", color: "transparent" }}>Five futuristic themes.</span>
              </h1>
              <p className="mt-4 max-w-xl text-[15px]" style={{ color: t.textDim }}>
                Oxin.com delivers premium earbuds, headphones, mobiles, and skincare tech. Switch themes instantly — Hacker, Cyberpunk, Ultrasonic, Quantum, Nova.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {["Free 30-day returns", "2-year warranty", "Secure checkout"].map(x=>(
                  <div key={x} className="px-3 py-1.5 rounded-full border text-xs" style={{ borderColor: t.border, background: t.surface }}>{x}</div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-6 blur-3xl opacity-40" style={{ background: t.gradient }} />
                <div className="relative grid grid-cols-3 gap-3">
                  {PRODUCTS.slice(0,6).map((p,i)=>(
                    <div key={p.id} className={cn("aspect-[4/5] rounded-2xl overflow-hidden border", i===1 && "translate-y-3", i===4 && "-translate-y-2")} style={{ borderColor: t.border, background: t.surface }}>
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2.5 py-4 border-y" style={{ borderColor: t.border }}>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: t.textDim }}>
            <span>Sort:</span>
            <select value={sort} onChange={e=>setSort(e.target.value as any)} className="rounded-lg border px-2.5 py-1.5 text-xs outline-none" style={{ background: t.surface, borderColor: t.border, color: t.text }}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            {["all","earbuds","headphones","mobile","skincare"].map(c=>(
              <button key={c} onClick={()=>goToCategory(c as any)} className="md:hidden px-2.5 py-1 rounded-full text-xs border" style={{ background: category===c ? t.primary : t.surface, color: category===c ? "black" : t.text, borderColor: t.border }}>{c}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Banner */}
      {currentPage === "home" && (
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative rounded-[2rem] overflow-hidden border" style={{ background: `linear-gradient(135deg, ${t.surface2}, ${t.surface})`, borderColor: t.border }}>
            <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 30% 50%, ${t.primary}22, transparent 50%), radial-gradient(circle at 70% 50%, ${t.accent}22, transparent 50%)` }} />
            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-4" style={{ background: `${t.primary}22`, color: t.primary, border: `1px solid ${t.primary}44` }}>⚡ New Collection 2024</div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Upgrade Your <span style={{ color: t.primary }}>Tech</span></h2>
                <p className="text-lg mb-6 max-w-lg mx-auto md:mx-0" style={{ color: t.textDim }}>Discover the latest earbuds, headphones, mobile devices, and skincare tech. Premium quality, unbeatable prices.</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <button onClick={() => navigate("home")} className="px-6 py-3 rounded-xl font-medium text-black" style={{ background: t.gradient }}>Shop Now</button>
                  <button onClick={() => navigate("about")} className="px-6 py-3 rounded-xl font-medium border" style={{ borderColor: t.border }}>Learn More</button>
                </div>
              </div>
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center relative" style={{ background: `${t.primary}11` }}>
                <div className="text-7xl md:text-9xl font-black opacity-30" style={{ color: t.primary }}>O</div>
                <div className="absolute inset-0 animate-pulse rounded-full" style={{ border: `2px dashed ${t.primary}44` }} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      {currentPage === "home" && (
      <main ref={productsRef} className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {filtered.map(p => {
            const wished = wishlist.includes(p.id);
            return (
              <div key={p.id} className="group relative rounded-[1.5rem] border overflow-hidden flex flex-col" style={{ background: `linear-gradient(180deg, ${t.surface2}, ${t.surface})`, borderColor: t.border }}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition" style={{ background: `linear-gradient(to top, ${t.bg}aa, transparent)` }} />
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    {p.badge && <span className="px-2 py-1 rounded-full text-[10px] font-semibold text-black" style={{ background: t.primary }}>{p.badge}</span>}
                    {p.originalPrice && <span className="px-2 py-1 rounded-full text-[10px] font-medium border backdrop-blur" style={{ borderColor: t.border, background: `${t.bg}99` }}>-{Math.round((1-p.price/p.originalPrice)*100)}%</span>}
                  </div>
                  <button onClick={()=>toggleWish(p.id)} className="absolute top-2.5 right-2.5 h-8 w-8 grid place-items-center rounded-full border backdrop-blur transition hover:scale-110" style={{ background: `${t.bg}66`, borderColor: t.border }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" style={{ color: wished ? t.primary : t.text }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                  <button onClick={()=>setActiveProduct(p)} className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-medium border opacity-0 group-hover:opacity-100 transition" style={{ background: t.surface, borderColor: t.border }}>Quick view</button>
                </div>
                <div className="p-3.5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px]" style={{ color: t.textDim }}>{p.brand}</div>
                      <div className="font-medium leading-snug line-clamp-2 min-h-[2.6rem]">{p.name}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-semibold">${p.price}</div>
                      {p.originalPrice && <div className="text-[11px] line-through opacity-60">${p.originalPrice}</div>}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px]" style={{ color: t.textDim }}>
                    <div className="flex">
                      {Array.from({length:5}).map((_,i)=>(
                        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < Math.round(p.rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" style={{ color: i < Math.round(p.rating) ? t.primary : t.textDim, opacity: i < Math.round(p.rating) ? 1 : 0.4 }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      ))}
                    </div>
                    <span>{p.rating}</span>
                    <span>•</span>
                    <span>{p.reviews.toLocaleString()}</span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {p.features.slice(0,2).map(f=>(
                      <span key={f} className="px-2 py-0.5 rounded-full text-[10px] border" style={{ borderColor: t.border, background: t.bg2, color: t.textDim }}>{f}</span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={()=>addToCart(p)} className="flex-1 rounded-xl py-2 text-sm font-medium text-black transition hover:translate-y-[-1px] active:translate-y-[0px]" style={{ background: t.gradient }}>Add to cart</button>
                    <button onClick={()=>{addToCart(p); setCartOpen(true);}} className="h-9 w-9 grid place-items-center rounded-xl border" style={{ borderColor: t.border, background: t.surface2 }} title="Buy now">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty */}
        {filtered.length===0 && (
          <div className="py-24 text-center">
            <div className="text-6xl mb-4">⊘</div>
            <div className="text-lg font-medium">No matches</div>
            <div className="text-sm mt-1" style={{ color: t.textDim }}>Try another search or category</div>
          </div>
        )}
      </main>
      )}

      {/* Page Content - About, Careers, Contact, etc. */}
      {currentPage !== "home" && (
        <div className="min-h-screen pt-24 pb-12 px-4">
          <div className="mx-auto max-w-4xl">
            {currentPage === "about" && (
              <div>
                <h1 className="text-4xl font-bold mb-6">About <span style={{ color: t.primary }}>Oxin.com</span></h1>
                <div className="rounded-2xl border p-6" style={{ borderColor: t.border, background: t.surface }}>
                  <p className="text-lg mb-4" style={{ color: t.textDim }}>Oxin.com is your destination for cutting-edge technology and premium skincare tech. Founded in 2024, we curate the finest gadgets and beauty devices from world-renowned brands.</p>
                  <p className="mb-4" style={{ color: t.textDim }}>Our mission is to bring futuristic technology to your doorstep with lightning-fast delivery, unbeatable prices, and exceptional customer service.</p>
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 rounded-xl border" style={{ borderColor: t.border, background: t.bg2 }}>
                      <div className="text-2xl font-bold" style={{ color: t.primary }}>500K+</div>
                      <div className="text-sm" style={{ color: t.textDim }}>Happy Customers</div>
                    </div>
                    <div className="p-4 rounded-xl border" style={{ borderColor: t.border, background: t.bg2 }}>
                      <div className="text-2xl font-bold" style={{ color: t.primary }}>50+</div>
                      <div className="text-sm" style={{ color: t.textDim }}>Premium Brands</div>
                    </div>
                    <div className="p-4 rounded-xl border" style={{ borderColor: t.border, background: t.bg2 }}>
                      <div className="text-2xl font-bold" style={{ color: t.primary }}>24/7</div>
                      <div className="text-sm" style={{ color: t.textDim }}>Customer Support</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentPage === "careers" && (
              <div>
                <h1 className="text-4xl font-bold mb-6">Join Our <span style={{ color: t.primary }}>Team</span></h1>
                <div className="space-y-4">
                  {[
                    { t: "Senior Frontend Developer", l: "Remote • Full-time", d: "Build the future of e-commerce with React, TypeScript, and cutting-edge tech." },
                    { t: "UX/UI Designer", l: "New York • Hybrid", d: "Design beautiful, intuitive interfaces that delight millions of users." },
                    { t: "Customer Success Manager", l: "London • Full-time", d: "Help our customers get the most out of their tech purchases." },
                    { t: "DevOps Engineer", l: "San Francisco • Remote", d: "Scale our infrastructure to handle millions of requests." },
                  ].map(job => (
                    <div key={job.t} className="p-5 rounded-xl border cursor-pointer hover:scale-[1.01] transition-transform" style={{ borderColor: t.border, background: t.surface }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-lg">{job.t}</div>
                          <div className="text-sm mt-1" style={{ color: t.textDim }}>{job.l}</div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: t.primary, color: "black" }}>Apply</span>
                      </div>
                      <p className="mt-3 text-sm" style={{ color: t.textDim }}>{job.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentPage === "contact" && (
              <div>
                <h1 className="text-4xl font-bold mb-6">Contact <span style={{ color: t.primary }}>Us</span></h1>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-2xl border p-6" style={{ borderColor: t.border, background: t.surface }}>
                    <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg grid place-items-center" style={{ background: t.surface2 }}>📧</div>
                        <div>
                          <div className="text-sm" style={{ color: t.textDim }}>Email</div>
                          <div className="font-medium">support@oxin.com</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg grid place-items-center" style={{ background: t.surface2 }}>📞</div>
                        <div>
                          <div className="text-sm" style={{ color: t.textDim }}>Phone</div>
                          <div className="font-medium">+1 (888) OXIN-888</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg grid place-items-center" style={{ background: t.surface2 }}>📍</div>
                        <div>
                          <div className="text-sm" style={{ color: t.textDim }}>Address</div>
                          <div className="font-medium">123 Tech Avenue, San Francisco, CA</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border p-6" style={{ borderColor: t.border, background: t.surface }}>
                    <h3 className="font-semibold text-lg mb-4">Send a Message</h3>
                    <div className="space-y-3">
                      <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border bg-transparent" style={{ borderColor: t.border }} />
                      <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-xl border bg-transparent" style={{ borderColor: t.border }} />
                      <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-3 rounded-xl border bg-transparent resize-none" style={{ borderColor: t.border }} />
                      <button className="w-full py-3 rounded-xl font-medium text-black" style={{ background: t.gradient }}>Send Message</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentPage === "shipping" && (
              <div>
                <h1 className="text-4xl font-bold mb-6">Shipping <span style={{ color: t.primary }}>Info</span></h1>
                <div className="rounded-2xl border p-6 space-y-6" style={{ borderColor: t.border, background: t.surface }}>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
                    <p style={{ color: t.textDim }}>Enjoy free standard shipping on all orders over $50. Delivered within 5-7 business days.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Express Shipping</h3>
                    <p style={{ color: t.textDim }}>Get your order in 2-3 business days for $9.99. Available for all domestic orders.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Same-Day Delivery</h3>
                    <p style={{ color: t.textDim }}>Order before 2pm and get your gadgets delivered the same day in select metro areas.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">International Shipping</h3>
                    <p style={{ color: t.textDim }}>We ship to over 100 countries worldwide. Shipping costs calculated at checkout.</p>
                  </div>
                </div>
              </div>
            )}
            {currentPage === "returns" && (
              <div>
                <h1 className="text-4xl font-bold mb-6">Returns & <span style={{ color: t.primary }}>Refunds</span></h1>
                <div className="rounded-2xl border p-6 space-y-6" style={{ borderColor: t.border, background: t.surface }}>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">30-Day Return Policy</h3>
                    <p style={{ color: t.textDim }}>Not satisfied? Return any product within 30 days for a full refund. No questions asked.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">How to Return</h3>
                    <ol className="list-decimal list-inside space-y-2" style={{ color: t.textDim }}>
                      <li>Go to your order history and initiate a return</li>
                      <li>Print the prepaid shipping label</li>
                      <li>Pack the item in original packaging</li>
                      <li>Drop off at any authorized pickup point</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Refund Timeline</h3>
                    <p style={{ color: t.textDim }}>Refunds are processed within 5-7 business days after we receive your return. The amount will be credited to your original payment method.</p>
                  </div>
                </div>
              </div>
            )}
            {currentPage === "warranty" && (
              <div>
                <h1 className="text-4xl font-bold mb-6">Warranty <span style={{ color: t.primary }}>Info</span></h1>
                <div className="rounded-2xl border p-6 space-y-6" style={{ borderColor: t.border, background: t.surface }}>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">1-Year Standard Warranty</h3>
                    <p style={{ color: t.textDim }}>All products come with a minimum 1-year manufacturer warranty covering defects in materials and workmanship.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Extended Warranty</h3>
                    <p style={{ color: t.textDim }}>Purchase extended warranty (up to 3 years) at checkout for additional protection against accidental damage.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">What’s Covered</h3>
                    <ul className="space-y-2" style={{ color: t.textDim }}>
                      <li>✓ Manufacturing defects</li>
                      <li>✓ Hardware failures</li>
                      <li>✓ Software issues (for applicable devices)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">What’s Not Covered</h3>
                    <ul className="space-y-2" style={{ color: t.textDim }}>
                      <li>✗ Physical damage from accidents</li>
                      <li>✗ Water damage (unless IP rated)</li>
                      <li>✗ Unauthorized modifications</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {currentPage === "faqs" && (
              <div>
                <h1 className="text-4xl font-bold mb-6">Frequently Asked <span style={{ color: t.primary }}>Questions</span></h1>
                <div className="space-y-4">
                  {[
                    { q: "How do I track my order?", a: "Once your order ships, you'll receive an email with tracking information. You can also track it in your account's order history." },
                    { q: "Can I change my shipping address?", a: "Yes, you can modify your shipping address within 1 hour of placing your order, as long as it hasn't shipped yet." },
                    { q: "Do you offer gift wrapping?", a: "Yes! Add gift wrapping at checkout for $5. We'll package your order in a beautiful premium box with a personalized note." },
                    { q: "Are your products authentic?", a: "Absolutely! We are an authorized retailer for all major brands and provide full manufacturer warranties." },
                    { q: "How do I contact customer support?", a: "You can reach us via live chat, email at support@oxin.com, or call +1 (888) OXIN-888. We're here 24/7!" },
                  ].map(faq => (
                    <details key={faq.q} className="group rounded-xl border" style={{ borderColor: t.border, background: t.surface }}>
                      <summary className="p-4 font-medium cursor-pointer flex justify-between items-center">
                        {faq.q}
                        <span className="text-xl transition-transform group-open:rotate-180" style={{ color: t.primary }}>▼</span>
                      </summary>
                      <div className="px-4 pb-4 text-sm" style={{ color: t.textDim }}>{faq.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            )}
            {currentPage === "privacy" && (
              <div>
                <h1 className="text-4xl font-bold mb-6">Privacy <span style={{ color: t.primary }}>Policy</span></h1>
                <div className="rounded-2xl border p-6 space-y-4" style={{ borderColor: t.border, background: t.surface }}>
                  <p style={{ color: t.textDim }}>At Oxin.com, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.</p>
                  <h3 className="font-semibold text-lg">Information We Collect</h3>
                  <p style={{ color: t.textDim }}>We collect information you provide during account creation, ordering, and when you contact us. This includes name, email, shipping address, and payment information.</p>
                  <h3 className="font-semibold text-lg">How We Use Your Data</h3>
                  <p style={{ color: t.textDim }}>Your data helps us process orders, improve our services, and send you relevant promotions. We never sell your personal information to third parties.</p>
                  <h3 className="font-semibold text-lg">Data Security</h3>
                  <p style={{ color: t.textDim }}>We use industry-standard encryption (SSL/TLS) to protect your data. All payment transactions are processed securely through PCI-compliant gateways.</p>
                </div>
              </div>
            )}
            {currentPage === "terms" && (
              <div>
                <h1 className="text-4xl font-bold mb-6">Terms of <span style={{ color: t.primary }}>Service</span></h1>
                <div className="rounded-2xl border p-6 space-y-4" style={{ borderColor: t.border, background: t.surface }}>
                  <p style={{ color: t.textDim }}>By using Oxin.com, you agree to these terms. Please read them carefully before making a purchase.</p>
                  <h3 className="font-semibold text-lg">Account Responsibilities</h3>
                  <p style={{ color: t.textDim }}>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
                  <h3 className="font-semibold text-lg">Ordering & Payment</h3>
                  <p style={{ color: t.textDim }}>All orders are subject to availability. We accept all major credit cards, PayPal, and Apple Pay. Prices are subject to change without notice.</p>
                  <h3 className="font-semibold text-lg">Limitation of Liability</h3>
                  <p style={{ color: t.textDim }}>Oxin.com is not liable for any indirect, incidental, or consequential damages arising from your use of our website or products.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t mt-12" style={{ borderColor: t.border, background: `linear-gradient(180deg, transparent, ${t.surface}66)` }}>
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg grid place-items-center" style={{ background: t.gradient }}><span className="text-black font-black">O</span></div>
              <div className="font-semibold">Oxin.com</div>
            </div>
            <p className="text-sm mb-4" style={{ color: t.textDim }}>Premium tech & skincare tech. Built for speed, designed for the future.</p>
            <div className="flex gap-3">
              {["🐦", "📘", "📸", "▶️"].map(s => (
                <a key={s} href="#" className="h-9 w-9 rounded-lg border grid place-items-center text-lg hover:scale-110 transition-transform" style={{ borderColor: t.border }}>{s}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-medium mb-3">Shop</div>
            <ul className="space-y-2 text-sm" style={{ color: t.textDim }}>
              <li><button onClick={() => navigate("home")} className="hover:underline text-left">All Products</button></li>
              <li><button onClick={() => navigate("home")} className="hover:underline text-left">Earbuds</button></li>
              <li><button onClick={() => navigate("home")} className="hover:underline text-left">Headphones</button></li>
              <li><button onClick={() => navigate("home")} className="hover:underline text-left">Mobile</button></li>
              <li><button onClick={() => navigate("home")} className="hover:underline text-left">Skincare</button></li>
            </ul>
          </div>
          <div>
            <div className="font-medium mb-3">Company</div>
            <ul className="space-y-2 text-sm" style={{ color: t.textDim }}>
              <li><button onClick={() => navigate("about")} className="hover:underline text-left">About Us</button></li>
              <li><button onClick={() => navigate("careers")} className="hover:underline text-left">Careers</button></li>
              <li><button onClick={() => navigate("contact")} className="hover:underline text-left">Contact</button></li>
              <li><button onClick={() => navigate("faqs")} className="hover:underline text-left">FAQs</button></li>
            </ul>
          </div>
          <div>
            <div className="font-medium mb-3">Support</div>
            <ul className="space-y-2 text-sm" style={{ color: t.textDim }}>
              <li><button onClick={() => navigate("shipping")} className="hover:underline text-left">Shipping</button></li>
              <li><button onClick={() => navigate("returns")} className="hover:underline text-left">Returns</button></li>
              <li><button onClick={() => navigate("warranty")} className="hover:underline text-left">Warranty</button></li>
              <li><button onClick={() => navigate("privacy")} className="hover:underline text-left">Privacy Policy</button></li>
              <li><button onClick={() => navigate("terms")} className="hover:underline text-left">Terms of Service</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t py-4 text-center text-xs" style={{ borderColor: t.border, color: t.textDim }}>
          © {new Date().getFullYear()} Oxin.com — All rights reserved. Themes: Hacker • Cyberpunk • Ultrasonic • Quantum • Nova
        </div>
      </footer>

      {/* Cart Drawer */}
      <div className={cn("fixed inset-0 z-50 transition", cartOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <div className={cn("absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity", cartOpen ? "opacity-100" : "opacity-0")} onClick={()=>setCartOpen(false)} />
        <div className={cn("absolute right-0 top-0 h-full w-full max-w-[420px] border-l shadow-2xl transition-transform", cartOpen ? "translate-x-0" : "translate-x-full")} style={{ background: t.bg, borderColor: t.border }}>
          <div className="h-[68px] flex items-center justify-between px-4 border-b" style={{ borderColor: t.border }}>
            <div className="font-semibold">Your Cart ({cartCount})</div>
            <button onClick={()=>setCartOpen(false)} className="h-9 w-9 grid place-items-center rounded-full border" style={{ borderColor: t.border }}>✕</button>
          </div>
          <div className="h-[calc(100%-180px)] overflow-auto p-4 space-y-3">
            {cart.length===0 && <div className="py-16 text-center" style={{ color: t.textDim }}>Your cart is empty</div>}
            {cart.map(item=>(
              <div key={item.product.id} className="flex gap-3 p-3 rounded-2xl border" style={{ borderColor: t.border, background: t.surface }}>
                <img src={item.product.image} className="h-20 w-20 rounded-xl object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.product.name}</div>
                  <div className="text-xs" style={{ color: t.textDim }}>{item.product.brand}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={()=>setCart(c=>c.map(i=>i.product.id===item.product.id ? {...i, qty: Math.max(1, i.qty-1)}:i))} className="h-7 w-7 grid place-items-center rounded-lg border" style={{ borderColor: t.border }}>-</button>
                      <span className="w-6 text-center text-sm">{item.qty}</span>
                      <button onClick={()=>setCart(c=>c.map(i=>i.product.id===item.product.id ? {...i, qty: i.qty+1}:i))} className="h-7 w-7 grid place-items-center rounded-lg border" style={{ borderColor: t.border }}>+</button>
                    </div>
                    <div className="font-medium">${(item.product.price*item.qty).toFixed(0)}</div>
                  </div>
                </div>
                <button onClick={()=>setCart(c=>c.filter(i=>i.product.id!==item.product.id))} className="h-7 w-7 grid place-items-center rounded-lg opacity-60 hover:opacity-100" title="Remove">✕</button>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t backdrop-blur-xl" style={{ borderColor: t.border, background: `${t.bg}ee` }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: t.textDim }}>Subtotal</span>
              <span className="text-lg font-semibold">${cartTotal.toFixed(0)}</span>
            </div>
            <button disabled={cart.length===0} onClick={()=>{ setCartOpen(false); setCheckoutStep("form"); setCheckoutOpen(true); }} className="w-full rounded-xl py-3 font-medium text-black disabled:opacity-50" style={{ background: t.gradient }}>Checkout securely</button>
            <div className="mt-2 text-[11px] text-center" style={{ color: t.textDim }}>Tax and shipping calculated at checkout • 256-bit SSL</div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={()=>{ if(checkoutStep==="form") setCheckoutOpen(false); }} />
          <div className="relative w-full sm:max-w-lg rounded-t-[2rem] sm:rounded-[2rem] border shadow-2xl overflow-hidden max-h-[95dvh] flex flex-col" style={{ background: t.surface, borderColor: t.border }}>

            {checkoutStep === "form" ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: t.border, background: t.surface2 }}>
                  <div>
                    <div className="font-semibold text-base">Secure Checkout</div>
                    <div className="text-xs mt-0.5" style={{ color: t.textDim }}>256-bit SSL • {cart.length} item{cart.length!==1?"s":""} • ${cartTotal.toFixed(0)}</div>
                  </div>
                  <button onClick={()=>setCheckoutOpen(false)} className="h-9 w-9 grid place-items-center rounded-full border" style={{ borderColor: t.border }}>✕</button>
                </div>

                {/* Form */}
                <div className="overflow-y-auto p-6 space-y-4">
                  {/* Contact */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: t.textDim }}>Contact Info</div>
                    <div className="space-y-2.5">
                      <input value={checkoutForm.name} onChange={e=>setCheckoutForm(f=>({...f,name:e.target.value}))} placeholder="Full Name" className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none" style={{ background: t.bg, borderColor: t.border }} onFocus={e=>e.currentTarget.style.boxShadow=`0 0 0 3px ${t.ring}`} onBlur={e=>e.currentTarget.style.boxShadow="none"} />
                      <input value={checkoutForm.email} onChange={e=>setCheckoutForm(f=>({...f,email:e.target.value}))} placeholder="Email Address" type="email" className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none" style={{ background: t.bg, borderColor: t.border }} onFocus={e=>e.currentTarget.style.boxShadow=`0 0 0 3px ${t.ring}`} onBlur={e=>e.currentTarget.style.boxShadow="none"} />
                    </div>
                  </div>
                  {/* Shipping */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: t.textDim }}>Shipping Address</div>
                    <div className="space-y-2.5">
                      <input value={checkoutForm.address} onChange={e=>setCheckoutForm(f=>({...f,address:e.target.value}))} placeholder="Street Address" className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none" style={{ background: t.bg, borderColor: t.border }} onFocus={e=>e.currentTarget.style.boxShadow=`0 0 0 3px ${t.ring}`} onBlur={e=>e.currentTarget.style.boxShadow="none"} />
                      <input value={checkoutForm.city} onChange={e=>setCheckoutForm(f=>({...f,city:e.target.value}))} placeholder="City / State / ZIP" className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none" style={{ background: t.bg, borderColor: t.border }} onFocus={e=>e.currentTarget.style.boxShadow=`0 0 0 3px ${t.ring}`} onBlur={e=>e.currentTarget.style.boxShadow="none"} />
                    </div>
                  </div>
                  {/* Payment */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: t.textDim }}>Payment Details</div>
                    <div className="space-y-2.5">
                      <input value={checkoutForm.card} onChange={e=>setCheckoutForm(f=>({...f,card:e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim()}))} placeholder="Card Number (1234 5678 9012 3456)" className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none" style={{ background: t.bg, borderColor: t.border }} onFocus={e=>e.currentTarget.style.boxShadow=`0 0 0 3px ${t.ring}`} onBlur={e=>e.currentTarget.style.boxShadow="none"} />
                      <div className="grid grid-cols-2 gap-2.5">
                        <input value={checkoutForm.expiry} onChange={e=>setCheckoutForm(f=>({...f,expiry:e.target.value.replace(/\D/g,"").slice(0,4).replace(/(.{2})/,"$1/")}))} placeholder="MM/YY" className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none" style={{ background: t.bg, borderColor: t.border }} onFocus={e=>e.currentTarget.style.boxShadow=`0 0 0 3px ${t.ring}`} onBlur={e=>e.currentTarget.style.boxShadow="none"} />
                        <input value={checkoutForm.cvv} onChange={e=>setCheckoutForm(f=>({...f,cvv:e.target.value.replace(/\D/g,"").slice(0,3)}))} placeholder="CVV" className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none" style={{ background: t.bg, borderColor: t.border }} onFocus={e=>e.currentTarget.style.boxShadow=`0 0 0 3px ${t.ring}`} onBlur={e=>e.currentTarget.style.boxShadow="none"} />
                      </div>
                    </div>
                  </div>
                  {/* Order summary */}
                  <div className="rounded-xl border p-3.5 space-y-1.5" style={{ borderColor: t.border, background: t.bg2 }}>
                    {cart.map(i=>(
                      <div key={i.product.id} className="flex justify-between text-sm">
                        <span className="truncate mr-2" style={{ color: t.textDim }}>{i.product.name} ×{i.qty}</span>
                        <span className="shrink-0">${(i.product.price*i.qty).toFixed(0)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-1.5 flex justify-between font-semibold" style={{ borderColor: t.border }}>
                      <span>Total</span><span>${cartTotal.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {/* Place order btn */}
                <div className="px-6 pb-6 pt-3 shrink-0 border-t" style={{ borderColor: t.border }}>
                  <button
                    onClick={()=>{
                      const {name,email,address,city,card,expiry,cvv} = checkoutForm;
                      if(!name||!email||!address||!city||card.replace(/\s/g,"").length<16||expiry.length<5||cvv.length<3){
                        showToast("Please fill all fields correctly"); return;
                      }
                      setCheckoutStep("success");
                      setCart([]);
                      setCheckoutForm({name:"",email:"",address:"",city:"",card:"",expiry:"",cvv:""});
                    }}
                    className="w-full rounded-xl py-3.5 font-semibold text-black"
                    style={{ background: t.gradient }}
                  >
                    Place Order — ${cartTotal.toFixed(0)}
                  </button>
                  <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px]" style={{ color: t.textDim }}>
                    <span>🔒</span><span>Secured by 256-bit SSL encryption</span>
                  </div>
                </div>
              </>
            ) : (
              /* Success screen */
              <div className="p-8 flex flex-col items-center text-center gap-4">
                <div className="h-20 w-20 rounded-full grid place-items-center" style={{ background: `${t.primary}22`, border: `2px solid ${t.primary}` }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: t.primary }}><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">Order Placed!</div>
                  <div className="text-sm" style={{ color: t.textDim }}>Your order has been confirmed. A confirmation email will be sent shortly.</div>
                </div>
                <div className="w-full rounded-xl border p-4 text-sm text-left space-y-1" style={{ borderColor: t.border, background: t.bg2 }}>
                  <div className="flex justify-between"><span style={{ color: t.textDim }}>Order ID</span><span className="font-mono font-medium">#OX{Math.floor(Math.random()*90000+10000)}</span></div>
                  <div className="flex justify-between"><span style={{ color: t.textDim }}>Estimated Delivery</span><span className="font-medium">3–5 Business Days</span></div>
                  <div className="flex justify-between"><span style={{ color: t.textDim }}>Payment</span><span className="font-medium" style={{ color: t.primary }}>✓ Confirmed</span></div>
                </div>
                <button
                  onClick={()=>{ setCheckoutOpen(false); setCheckoutStep("form"); }}
                  className="w-full rounded-xl py-3.5 font-semibold text-black mt-2"
                  style={{ background: t.gradient }}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick view */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={()=>setActiveProduct(null)} />
          <div className="relative w-full sm:max-w-4xl rounded-t-[2rem] sm:rounded-[2rem] border shadow-2xl overflow-hidden flex flex-col md:grid md:grid-cols-2 max-h-[92dvh] sm:max-h-[90vh]" style={{ background: t.surface, borderColor: t.border }}>
            {/* Image */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-auto md:h-full shrink-0">
              <img src={activeProduct.image} className="h-full w-full object-cover" alt="" />
              <div className="absolute top-3 left-3 flex gap-1.5">
                {activeProduct.badge && <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-black" style={{ background: t.primary }}>{activeProduct.badge}</span>}
              </div>
              {/* close btn on image for mobile */}
              <button onClick={()=>setActiveProduct(null)} className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-full border md:hidden" style={{ borderColor: t.border, background: `${t.bg}cc` }}>✕</button>
            </div>
            {/* Content — scrollable on mobile */}
            <div className="p-5 sm:p-6 md:p-8 flex flex-col overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs capitalize" style={{ color: t.textDim }}>{activeProduct.brand} • {activeProduct.category}</div>
                  <h3 className="text-lg sm:text-2xl font-semibold mt-1 leading-snug">{activeProduct.name}</h3>
                </div>
                <button onClick={()=>setActiveProduct(null)} className="h-9 w-9 grid place-items-center rounded-full border shrink-0 hidden md:grid" style={{ borderColor: t.border }}>✕</button>
              </div>
              <div className="mt-3 flex items-center flex-wrap gap-2">
                <div className="text-xl sm:text-2xl font-semibold">${activeProduct.price}</div>
                {activeProduct.originalPrice && <div className="text-sm line-through opacity-60">${activeProduct.originalPrice}</div>}
                <div className="flex items-center gap-1 text-sm" style={{ color: t.textDim }}>
                  <span>★</span><span>{activeProduct.rating}</span><span>({activeProduct.reviews.toLocaleString()})</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {activeProduct.features.map(f=> <span key={f} className="px-2.5 py-1 rounded-full text-xs border" style={{ borderColor: t.border, background: t.bg2 }}>{f}</span>)}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="p-3 rounded-xl border" style={{ borderColor: t.border, background: t.bg2 }}>
                  <div className="text-xs" style={{ color: t.textDim }}>Stock</div>
                  <div className="font-medium">{activeProduct.stock} units</div>
                </div>
                <div className="p-3 rounded-xl border" style={{ borderColor: t.border, background: t.bg2 }}>
                  <div className="text-xs" style={{ color: t.textDim }}>Delivery</div>
                  <div className="font-medium">Tomorrow by 9pm</div>
                </div>
              </div>
              <div className="mt-5 flex gap-2.5">
                <button onClick={()=>{addToCart(activeProduct); setActiveProduct(null);}} className="flex-1 rounded-xl py-3 text-sm font-medium text-black" style={{ background: t.gradient }}>Add to cart</button>
                <button onClick={()=>{addToCart(activeProduct); setActiveProduct(null); setCartOpen(true);}} className="px-4 rounded-xl border text-sm font-medium" style={{ borderColor: t.border, background: t.surface2 }}>Buy now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
        <div className={cn("pointer-events-auto transition-all", toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
          {toast && <div className="px-4 py-2.5 rounded-full border shadow-xl backdrop-blur-xl text-sm flex items-center gap-2" style={{ background: `${t.surface}ee`, borderColor: t.border }}>
            <span className="h-2 w-2 rounded-full" style={{ background: t.primary }}/>
            {toast}
          </div>}
        </div>
      </div>

      <style>{`
        * { scrollbar-width: thin; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 8px; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
// Zod Schema
export const Schema = {
    "commentary": "Built Oxin.com — a fully functional, secure-login e-commerce experience with 20 real tech products across earbuds, headphones, mobiles, and skincare tech. Includes 5 distinct futuristic themes (Hacker, Cyberpunk, Ultrasonic, Quantum, Nova) with live theme switching, matrix rain, glassmorphism UI, quick view, cart, wishlist, and polished responsive design.",
    "template": "next-forge",
    "title": "Oxin.com — Futuristic Tech Store",
    "description": "A professional e-commerce website with secure login, 5 unique visual themes, and curated technology products including earbuds, headphones, mobile devices, and skincare tech for all genders.",
    "additional_dependencies": [],
    "has_additional_dependencies": false,
    "install_dependencies_command": "",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}