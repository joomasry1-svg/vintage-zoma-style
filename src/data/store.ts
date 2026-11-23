export type StoreCategory = {
  id: string;
  label: string;
  note: string;
  imageUrl?: string;
};

export const CATEGORIES: StoreCategory[] = [
  {
    id: "outerwear",
    label: "المعاطف والجواكت",
    note: "صوف وثير وجلد طبيعي لموسم الشتاء",
    imageUrl: "/images/editorial/hero-black-coat.jpg",
  },
  {
    id: "suits",
    label: "البدلات",
    note: "قصّات صوفية كلاسيكية للحظة التي تليق بك",
    imageUrl: "/images/editorial/suit-portrait.jpg",
  },
  {
    id: "blazers",
    label: "البليزرات",
    note: "طبقة أنيقة فوق أي تفصيل",
    imageUrl: "/images/editorial/wool-closeup.jpg",
  },
  {
    id: "shirts",
    label: "القمصان",
    note: "قطن وأكتان بلمسة أرشيفية",
    imageUrl: "/images/editorial/suit-street.jpg",
  },
  {
    id: "polos",
    label: "البولو",
    note: "كاجوال راقٍ بعناية",
    imageUrl: "/images/editorial/puffer-portrait.jpg",
  },
  {
    id: "trousers",
    label: "البناطيل",
    note: "ساق مستقيمة وقصّة مريحة",
    imageUrl: "/images/editorial/boutique.jpg",
  },
  {
    id: "shoes",
    label: "الأحذية",
    note: "جلد طبيعي وخياطة يدوية",
    imageUrl: "/images/editorial/shoes.jpg",
  },
  {
    id: "accessories",
    label: "الإكسسوارات",
    note: "التفاصيل الصغيرة تُكمل الحكاية",
    imageUrl: "/images/editorial/accessories.jpg",
  },
];

export type CategoryId = string;

export type GarmentKind =
  | "coat"
  | "jacket"
  | "suit"
  | "blazer"
  | "shirt"
  | "polo"
  | "trousers"
  | "shoes"
  | "watch"
  | "tie"
  | "belt";

export type ProductColor = { name: string; hex: string };

export type ProductSizeOverride = {
  size: string;
  values: Record<string, string>;
};

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  kind: GarmentKind;
  description: string;
  fabric: string;
  price: number;
  discount: number;
  sizes: string[];
  colors: ProductColor[];
  tone: string;
  badge?: "new" | "hot";
  inStock: boolean;
  keywords: string[];
  imageUrl?: string;
  secondImageUrl?: string;
  gallery?: string[];
  videoPlaybackId?: string;
  videoAssetId?: string;
  videoAspectRatio?: string;
  videoDuration?: number;
  sizeOverrides?: ProductSizeOverride[];
  ownerNote?: string;
};

const BASE_PRODUCTS: Product[] = [
  {
    id: "savile-suit",
    name: 'بدلة "سافيلي" الصوفية',
    category: "suits",
    kind: "suit",
    description:
      "بدلة رسمية بقصّة إيطالية محسوبة، صُنعت من صوف مستورد بملمس ناعم ووقفة كتف منضبطة. الخيار الأول للمناسبات الكبيرة وأيام العمل التي لا تحتمل التأجيل.",
    fabric: "صوف ميرينو ١٠٠٪ — بطانة فيسكوز",
    price: 6200,
    discount: 15,
    sizes: ["48", "50", "52", "54", "56"],
    colors: [
      { name: "أسود", hex: "#2b2723" },
      { name: "كحلي داكن", hex: "#2c3446" },
    ],
    tone: "#2b2723",
    badge: "hot",
    inStock: true,
    keywords: ["بدلة", "زفاف", "فرح", "رسمي", "شغل", "صوف", "كلاسيك", "أسود", "كحلي"],
  },
  {
    id: "orlean-suit",
    name: 'بدلة "أورليان" الكحلية',
    category: "suits",
    kind: "suit",
    description:
      "كحلي هادئ بلمعة خفيفة وخطوط كتف مستقيمة تمنح حضوراً واثقاً. مناسبة للعمل النهاري وحفلات المساء على حد سواء.",
    fabric: "خليط صوف وموهير — وزن متوسط",
    price: 5400,
    discount: 10,
    sizes: ["48", "50", "52", "54"],
    colors: [
      { name: "كحلي", hex: "#2c3446" },
      { name: "رمادي مزرق", hex: "#5c6572" },
    ],
    tone: "#2c3446",
    badge: "new",
    inStock: true,
    keywords: ["بدلة", "كحلي", "عمل", "رسمي", "موهير", "أنيق"],
  },
  {
    id: "royal-suit",
    name: 'بدلة "رويال" الثلاثية',
    category: "suits",
    kind: "suit",
    description:
      "ثلاثية كاملة من صوف فاخر بسترة وسترة داخلية وبنطلون متناسق، مع أزرار قرنية وسحبة خلفية دقيقة. حضور أرشيفي لرجل يعرف قيمة التفاصيل.",
    fabric: "صوف إنجليزي ١٠٠٪ — أزرار قرنية",
    price: 7300,
    discount: 20,
    sizes: ["50", "52", "54", "56"],
    colors: [
      { name: "فحمي", hex: "#3a352f" },
      { name: "أسود", hex: "#241f1a" },
    ],
    tone: "#3a352f",
    inStock: true,
    keywords: ["بدلة", "ثلاثية", "زفاف", "فحمي", "فاخر", "عرس"],
  },
  {
    id: "london-suit",
    name: 'بدلة "لندن" الرمادية',
    category: "suits",
    kind: "suit",
    description:
      "رمادي متوسط بنقشة تويد خفيفة وقصّة بريطانية مستقيمة. تُلبس بسهولة وتزداد جمالاً مع مرور الوقت.",
    fabric: "تويد صوف — بطانة قطنية",
    price: 4900,
    discount: 0,
    sizes: ["48", "50", "52", "54", "56"],
    colors: [{ name: "رمادي", hex: "#77726a" }],
    tone: "#77726a",
    inStock: true,
    keywords: ["بدلة", "رمادي", "توييد", "بريطاني", "عمل"],
  },
  {
    id: "torino-suit",
    name: 'بدلة "تورينو" البيج',
    category: "suits",
    kind: "suit",
    description:
      "بيج دافئ بقماش خفيف الوزن وقصّة مريحة، مثالية للصيف والأفراح النهارية. لون يمنح الوجه إشراقة هادئة.",
    fabric: "خليط كتان وصوف — وزن خفيف",
    price: 5600,
    discount: 25,
    sizes: ["48", "50", "52", "54"],
    colors: [
      { name: "بيج", hex: "#b49a76" },
      { name: "رملي", hex: "#c8b393" },
    ],
    tone: "#b49a76",
    badge: "hot",
    inStock: true,
    keywords: ["بدلة", "بيج", "صيف", "نهاري", "فرح", "كتان"],
  },
  {
    id: "ghazal-blazer",
    name: 'بليزر "الغزال" الصوفي',
    category: "blazers",
    kind: "blazer",
    description:
      "بليزر بني محروق بكتف ناعم وجيوب رقعة، يعمل كطبقة أنيقة فوق قميص أو بولو. قطعة واحدة تغيّر مظهر الإطلالة كاملة.",
    fabric: "صوف مخلوط — جيوب رقعة",
    price: 3100,
    discount: 15,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "بني محروق", hex: "#6b4f3a" },
      { name: "زيتي", hex: "#5b5f4a" },
    ],
    tone: "#6b4f3a",
    inStock: true,
    keywords: ["بليزر", "جاكيت", "بني", "شتوي", "صوف", "كاجوال"],
  },
  {
    id: "archive-blazer",
    name: 'بليزر "أرشيف" التويد',
    category: "blazers",
    kind: "blazer",
    description:
      "تويد رمادي بنقشة دقيقة ورقعتي كوع، مستوحى من بدلات الجامعات القديمة. دافئ، متين، ويُلبس لسنوات.",
    fabric: "تويد صوف — رقع كوع جلدية",
    price: 2950,
    discount: 10,
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "رمادي بيبل", hex: "#6e6a63" }],
    tone: "#6e6a63",
    badge: "new",
    inStock: true,
    keywords: ["بليزر", "توييد", "رمادي", "أرشيف", "شتوي", "كلاسيك"],
  },
  {
    id: "nice-blazer",
    name: 'بليزر كتان "نيس"',
    category: "blazers",
    kind: "blazer",
    description:
      "كتان بيج بتهوية عالية وبنية غير مبطّنة، لسفرة ساحلية أو مساء صيفي. الطبيعة الخفيفة للقماش تجعله مريحاً طول اليوم.",
    fabric: "كتان ١٠٠٪ — غير مبطّن",
    price: 2450,
    discount: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "بيج", hex: "#c2ab89" },
      { name: "أبيض مكسور", hex: "#e3dccd" },
    ],
    tone: "#c2ab89",
    inStock: true,
    keywords: ["بليزر", "كتان", "صيف", "بيج", "خفيف"],
  },
  {
    id: "oxford-shirt",
    name: 'قميص "أوكسفورد" الأبيض',
    category: "shirts",
    kind: "shirt",
    description:
      "قميص أوكسفورد أبيض بقماش كثيف قليلاً وياقة كلاسيكية، يُلبس مع البدلة أو وحده. أساس لا يستغني عنه أي دولاب رجالي.",
    fabric: "قطن أوكسفورد ١٠٠٪",
    price: 1150,
    discount: 20,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "أبيض", hex: "#f2ebdc" },
      { name: "أزرق فاتح", hex: "#a9bdd0" },
    ],
    tone: "#e3dccd",
    badge: "hot",
    inStock: true,
    keywords: ["قميص", "أبيض", "أوكسفورد", "رسمي", "قطن", "عمل"],
  },
  {
    id: "clear-shirt",
    name: 'قميص "كلير" الكحلي',
    category: "shirts",
    kind: "shirt",
    description:
      "كحلي عميق بلمسة مطفية وياقة إيطالية، يمنح مظهراً راقياً بدون مبالغة. مثالي للمساء مع بنطلون صوف وحذاء جلدي.",
    fabric: "قطن مصري — خيط مزدوج",
    price: 990,
    discount: 10,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "كحلي", hex: "#2f3a4d" },
      { name: "أسود", hex: "#2b2723" },
    ],
    tone: "#2f3a4d",
    inStock: true,
    keywords: ["قميص", "كحلي", "مساء", "قطن", "إيطالي"],
  },
  {
    id: "marsa-shirt",
    name: 'قميص كتان "مرسى"',
    category: "shirts",
    kind: "shirt",
    description:
      "قميص كتان بلون رملي وأزرار خشبية، صُمم للتهوية والحركة السهلة. يُلبس مفتوحاً فوق تيشيرت أو مغلقاً مع بنطلون تشينو.",
    fabric: "كتان مغسول ١٠٠٪",
    price: 1250,
    discount: 15,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "رملي", hex: "#c9b493" }],
    tone: "#c9b493",
    inStock: true,
    keywords: ["قميص", "كتان", "صيف", "رملي", "كاجوال"],
  },
  {
    id: "harlem-shirt",
    name: 'قميص مخطط "هارلم"',
    category: "shirts",
    kind: "shirt",
    description:
      "خطوط رفيعة بلون رمادي هادئ على قطن ناعم، لتغيير بسيط عن القميص السادة. ينسجم مع البدلة الرمادية والبنطلون الكحلي.",
    fabric: "قطن بوبلين — نقشة خطوط",
    price: 890,
    discount: 0,
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "رمادي مخطط", hex: "#9c948a" }],
    tone: "#9c948a",
    inStock: true,
    keywords: ["قميص", "مخطط", "رمادي", "عمل", "قطن"],
  },
  {
    id: "como-polo",
    name: 'بولو "كومو" القطني',
    category: "polos",
    kind: "polo",
    description:
      "بولو أسود من قطن بيما بنسج دقيق وياقة ثابتة لا تترهل. الراحة اليومية بمظهر مرتب يستحق الثمن.",
    fabric: "قطن بيما — غرزة دقيقة",
    price: 780,
    discount: 15,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "أسود", hex: "#2b2723" },
      { name: "كحلي", hex: "#2f3a4d" },
      { name: "أبيض مكسور", hex: "#e8e0d0" },
    ],
    tone: "#2b2723",
    inStock: true,
    keywords: ["بولو", "تيشيرت", "قطن", "كاجوال", "أسود", "يومي"],
  },
  {
    id: "riviera-polo",
    name: 'بولو "ريفيرا"',
    category: "polos",
    kind: "polo",
    description:
      "زيتي دافئ بجيوب صدر ونسيج مضلّع خفيف، مستوحى من قمصان الصيادين القديمة. قطعة كاجوال أنيقة لعطلة نهاية الأسبوع.",
    fabric: "قطن مضلّع — غسلة ناعمة",
    price: 720,
    discount: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "زيتي", hex: "#5b5f4a" }],
    tone: "#5b5f4a",
    badge: "new",
    inStock: true,
    keywords: ["بولو", "زيتي", "كاجوال", "قطن", "صيف"],
  },
  {
    id: "savoy-trousers",
    name: 'بنطلون "سافوي" الصوف',
    category: "trousers",
    kind: "trousers",
    description:
      "بنطلون صوف بخصر متوسط وكسرة أمامية حادة، يكمل البدلة أو يُلبس مع بليزر منفصل. قماش مقاوم للتجاعيد طوال اليوم.",
    fabric: "صوف مخلوط — كسرة دائمة",
    price: 1450,
    discount: 20,
    sizes: ["30", "32", "34", "36", "38"],
    colors: [
      { name: "فحمي", hex: "#3a352f" },
      { name: "كحلي", hex: "#2f3a4d" },
    ],
    tone: "#3a352f",
    inStock: true,
    keywords: ["بنطلون", "صوف", "رسمي", "فحمي", "بدلة"],
  },
  {
    id: "chino-trousers",
    name: 'بنطلون "تشينو" الكتان',
    category: "trousers",
    kind: "trousers",
    description:
      "تشينو بلون بيج دافئ وقصّة مستقيمة مريحة، بجيوب جانبية مخفية. يناسب البولو والقميص الكتان على حد سواء.",
    fabric: "خليط قطن وكتان",
    price: 980,
    discount: 0,
    sizes: ["30", "32", "34", "36", "38"],
    colors: [{ name: "بيج", hex: "#bfa982" }],
    tone: "#bfa982",
    inStock: true,
    keywords: ["بنطلون", "تشينو", "كتان", "كاجوال", "بيج"],
  },
  {
    id: "blackwood-shoes",
    name: 'حذاء أوكسفورد "بلاكوود"',
    category: "shoes",
    kind: "shoes",
    description:
      "أوكسفورد جلد طبيعي بلون بني غامق، مخيط يدوياً بنعل جلدي ونهاية مدببة أنيقة. الحذاء الذي يُكمل البدلة الرسمية.",
    fabric: "جلد طبيعي — نعل جلدي مخيط",
    price: 3200,
    discount: 15,
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: [
      { name: "بني غامق", hex: "#4a3527" },
      { name: "أسود", hex: "#2b2723" },
    ],
    tone: "#4a3527",
    badge: "hot",
    inStock: true,
    keywords: ["حذاء", "أوكسفورد", "جلد", "رسمي", "بني", "فرح"],
  },
  {
    id: "aladdin-loafers",
    name: 'لوفر "ألودين"',
    category: "shoes",
    kind: "shoes",
    description:
      "لوفر أسود بجلد ناعم وحزام نحاسي بسيط، سهل اللبس وأنيق بلا مجهود. مناسب للمساءات والمناسبات غير الرسمية.",
    fabric: "جلد طبيعي مصقول",
    price: 2750,
    discount: 10,
    sizes: ["40", "41", "42", "43", "44"],
    colors: [{ name: "أسود", hex: "#2b2723" }],
    tone: "#2b2723",
    inStock: true,
    keywords: ["لوفر", "حذاء", "أسود", "جلد", "كاجوال"],
  },
  {
    id: "oru-belt",
    name: 'حزام جلد "أورو"',
    category: "accessories",
    kind: "belt",
    description:
      "حزام جلد طبيعي بلون بني غني وإبزيم نحاسي مطفي، يُختم عليه شعار Zoma من الداخل. تفصيلة صغيرة تُحدث فرقاً واضحاً.",
    fabric: "جلد بقري طبيعي — إبزيم نحاسي",
    price: 650,
    discount: 0,
    sizes: ["95", "100", "105", "110"],
    colors: [
      { name: "بني", hex: "#5b4029" },
      { name: "أسود", hex: "#2b2723" },
    ],
    tone: "#5b4029",
    inStock: true,
    keywords: ["حزام", "جلد", "إكسسوار", "بني"],
  },
  {
    id: "archive-watch",
    name: 'ساعة "أرشيف" الكلاسيكية',
    category: "accessories",
    kind: "watch",
    description:
      "ساعة بمينا عاجي وإطار ذهبي مطفي وسوار جلد بني، مستوحاة من ساعات الأربعينيات. حركة دقيقة وتصميم لا يتبع الموضة.",
    fabric: "فولاذ مطلي — سوار جلد إيطالي",
    price: 4300,
    discount: 20,
    sizes: ["مقاس واحد"],
    colors: [
      { name: "ذهبي", hex: "#a9884f" },
      { name: "فضي", hex: "#9c9a92" },
    ],
    tone: "#a9884f",
    badge: "new",
    inStock: true,
    keywords: ["ساعة", "إكسسوار", "ذهبي", "كلاسيك", "هدية"],
  },
  {
    id: "moritz-tie",
    name: 'ربطة عنق "سانت موريتز"',
    category: "accessories",
    kind: "tie",
    description:
      "ربطة حرير نبيتية بعرض كلاسيكي وعقدة سهلة، تُضيف عمقاً لونياً لبدلة فحمية أو كحلية. حرير مطفي بلمسة فاخرة.",
    fabric: "حرير طبيعي ١٠٠٪",
    price: 480,
    discount: 0,
    sizes: ["مقاس واحد"],
    colors: [
      { name: "نبيتي", hex: "#6d2f35" },
      { name: "كحلي", hex: "#2f3a4d" },
    ],
    tone: "#6d2f35",
    inStock: true,
    keywords: ["ربطة", "كرافة", "عنق", "حرير", "إكسسوار", "رسمي"],
  },
  {
    id: "kensington-overcoat",
    name: 'معطف "كينغستون" الصوفي',
    category: "outerwear",
    kind: "coat",
    description:
      "معطف صوف طويل بقصّة مستقيمة وياقة مقلوبة، مصنوع ليمنح الطلة حضوراً هادئاً في أبرد أيام المدينة. بطانة حريرية وأزرار قرنية تكمل التفاصيل.",
    fabric: "صوف ميرينو ٩٠٪ — بطانة حرير",
    price: 6400,
    discount: 25,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "فحمي", hex: "#232325" },
      { name: "كحلي ليلي", hex: "#1e2735" },
    ],
    tone: "#232325",
    badge: "hot",
    inStock: true,
    keywords: ["معطف", "بالطو", "صوف", "شتوي", "فحمي", "فاخر"],
  },
  {
    id: "camel-crest-coat",
    name: 'معطف "كاميل كريست"',
    category: "outerwear",
    kind: "coat",
    description:
      "كاميل دافئ بقماش مزدوج وظهر مفتوح، مستوحى من معاطف المشي الإيطالية. خفيف على الكتف وواسع بما يكفي لطبقة كشمير تحته.",
    fabric: "خليط صوف وكشمير — نسج مزدوج",
    price: 5900,
    discount: 20,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "كاميل", hex: "#b49a76" },
      { name: "رملي", hex: "#c8b393" },
    ],
    tone: "#b49a76",
    badge: "new",
    inStock: true,
    keywords: ["معطف", "كاميل", "كشمير", "شتوي", "بيج"],
  },
  {
    id: "rider-leather-jacket",
    name: 'جاكيت "رايدر" الجلدي',
    category: "outerwear",
    kind: "jacket",
    description:
      "جاكيت جلد طبيعي بلمسة مطفية وياقة قائمة وسحّاب نحاسي، يُلبس فوق قميص أو هودي بلا مجهود. يتشكل على الجسم مع الوقت ويصبح قطعة شخصية.",
    fabric: "جلد بقري طبيعي — سحّاب نحاسي",
    price: 5200,
    discount: 15,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "أسود", hex: "#1c1b1a" },
      { name: "بني داكن", hex: "#4a3527" },
    ],
    tone: "#1c1b1a",
    badge: "hot",
    inStock: true,
    keywords: ["جاكيت", "جلد", "ليذر", "أسود", "شتوي"],
  },
  {
    id: "orbital-puffer",
    name: 'جاكيت "أوربتال" البافر',
    category: "outerwear",
    kind: "jacket",
    description:
      "بافر خفيف بحشوة عازلة وقصّة قصيرة، صُمم للحركة في المدينة والسفر. يمنع الريح ويحتفظ بالدفء دون ثقل على الكتفين.",
    fabric: "نايلون مقاوم للريح — حشوة عازلة",
    price: 3600,
    discount: 30,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "أسود", hex: "#17181a" },
      { name: "رمادي دخاني", hex: "#5b5d61" },
    ],
    tone: "#17181a",
    badge: "new",
    inStock: true,
    keywords: ["بافر", "جاكيت", "شتوي", "خفيف", "سفر"],
  },
];

const PRODUCT_IMAGES: Record<
  string,
  { imageUrl?: string; secondImageUrl?: string }
> = {
  "savile-suit": {
    imageUrl: "/images/editorial/suit-portrait.jpg",
    secondImageUrl: "/images/editorial/suit-street.jpg",
  },
  "orlean-suit": {
    imageUrl: "/images/editorial/hero-overcoat.jpg",
    secondImageUrl: "/images/editorial/suit-portrait.jpg",
  },
  "royal-suit": {
    imageUrl: "/images/editorial/hero-suit-coat.jpg",
    secondImageUrl: "/images/editorial/suit-portrait.jpg",
  },
  "london-suit": {
    imageUrl: "/images/editorial/suit-street.jpg",
    secondImageUrl: "/images/editorial/boutique.jpg",
  },
  "torino-suit": {
    imageUrl: "/images/editorial/hero-beige.jpg",
    secondImageUrl: "/images/editorial/trench-indoor.jpg",
  },
  "ghazal-blazer": {
    imageUrl: "/images/editorial/boutique.jpg",
    secondImageUrl: "/images/editorial/wool-closeup.jpg",
  },
  "archive-blazer": {
    imageUrl: "/images/editorial/wool-closeup.jpg",
    secondImageUrl: "/images/editorial/boutique.jpg",
  },
  "nice-blazer": {
    imageUrl: "/images/editorial/trench-indoor.jpg",
    secondImageUrl: "/images/editorial/hero-beige.jpg",
  },
  "oxford-shirt": {
    imageUrl: "/images/editorial/hero-suit-coat.jpg",
    secondImageUrl: "/images/editorial/suit-portrait.jpg",
  },
  "clear-shirt": {
    imageUrl: "/images/editorial/suit-street.jpg",
    secondImageUrl: "/images/editorial/suit-portrait.jpg",
  },
  "marsa-shirt": {
    imageUrl: "/images/editorial/boutique.jpg",
    secondImageUrl: "/images/editorial/hero-beige.jpg",
  },
  "harlem-shirt": {
    imageUrl: "/images/editorial/suit-portrait.jpg",
    secondImageUrl: "/images/editorial/suit-street.jpg",
  },
  "como-polo": {
    imageUrl: "/images/editorial/puffer-portrait.jpg",
    secondImageUrl: "/images/editorial/puffer-city.jpg",
  },
  "riviera-polo": {
    imageUrl: "/images/editorial/puffer-city.jpg",
    secondImageUrl: "/images/editorial/puffer-portrait.jpg",
  },
  "savoy-trousers": {
    imageUrl: "/images/editorial/suit-portrait.jpg",
    secondImageUrl: "/images/editorial/suit-street.jpg",
  },
  "chino-trousers": {
    imageUrl: "/images/editorial/boutique.jpg",
    secondImageUrl: "/images/editorial/trench-indoor.jpg",
  },
  "blackwood-shoes": {
    imageUrl: "/images/editorial/shoes.jpg",
    secondImageUrl: "/images/editorial/accessories.jpg",
  },
  "aladdin-loafers": {
    imageUrl: "/images/editorial/shoes.jpg",
    secondImageUrl: "/images/editorial/accessories.jpg",
  },
  "oru-belt": {
    imageUrl: "/images/editorial/accessories.jpg",
    secondImageUrl: "/images/editorial/shoes.jpg",
  },
  "archive-watch": {
    imageUrl: "/images/editorial/accessories.jpg",
    secondImageUrl: "/images/editorial/wool-closeup.jpg",
  },
  "moritz-tie": {
    imageUrl: "/images/editorial/accessories.jpg",
    secondImageUrl: "/images/editorial/suit-portrait.jpg",
  },
  "kensington-overcoat": {
    imageUrl: "/images/editorial/hero-black-coat.jpg",
    secondImageUrl: "/images/editorial/hero-trench.jpg",
  },
  "camel-crest-coat": {
    imageUrl: "/images/editorial/hero-beige.jpg",
    secondImageUrl: "/images/editorial/trench-indoor.jpg",
  },
  "rider-leather-jacket": {
    imageUrl: "/images/editorial/leather-studio.jpg",
    secondImageUrl: "/images/editorial/leather-dark.jpg",
  },
  "orbital-puffer": {
    imageUrl: "/images/editorial/puffer-city.jpg",
    secondImageUrl: "/images/editorial/puffer-portrait.jpg",
  },
};

export const PRODUCTS: Product[] = BASE_PRODUCTS.map((product) => ({
  ...product,
  ...PRODUCT_IMAGES[product.id],
}));

export type PaymentMethod = {
  id: string;
  label: string;
  note: string;
  enabled: boolean;
};

export type HeroSlide = {
  imageUrl: string;
  videoUrl?: string;
  title: string;
  subtitle: string;
  kicker: string;
  productId?: string;
};

export type PromoBanner = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
};

export type StoreSettings = {
  storeName: string;
  tagline: string;
  announcement: string[];
  whatsapp: string;
  phoneDisplay: string;
  email: string;
  city: string;
  paymentMethods: PaymentMethod[];
  footerCredit: string;
  footerCreditUrl: string;
  logoUrl?: string;
  heroSlides?: HeroSlide[];
  banner?: PromoBanner;
};

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    imageUrl: "/images/editorial/hero-black-coat.jpg",
    kicker: "THE WINTER EDIT / 01",
    title: "الشتاء بقصّة تخصّك",
    subtitle: "معاطف صوف وجلد طبيعي، مختارة لتبقى معك أطول من موسم.",
    productId: "kensington-overcoat",
  },
  {
    imageUrl: "/images/editorial/hero-suit-coat.jpg",
    kicker: "TAILORING / 02",
    title: "حضور لا يحتاج وصفاً",
    subtitle: "بدلات بكتف مضبوط وقماش يتنفس، من أول اجتماع حتى آخر الليل.",
    productId: "savile-suit",
  },
  {
    imageUrl: "/images/editorial/hero-trench.jpg",
    kicker: "MILANO ARCHIVE / 03",
    title: "طبقة واحدة تغيّر كل شيء",
    subtitle: "ترنش كوت بقصّة إيطالية، خفيف فوق البدلة وقوي أمام المطر.",
    productId: "camel-crest-coat",
  },
  {
    imageUrl: "/images/editorial/leather-studio.jpg",
    kicker: "LEATHER / 04",
    title: "جلد يتشكّل بك",
    subtitle: "رايدر جاكيت بجلد طبيعي ولمسة مطفية، يصبح أفضل كل سنة.",
    productId: "rider-leather-jacket",
  },
  {
    imageUrl: "/images/editorial/hero-beige.jpg",
    kicker: "CAMEL & CASHMERE / 05",
    title: "دفء بلون النهار",
    subtitle: "كاميل هادئ يناسب القاهرة كما يناسب ميلانو.",
    productId: "camel-crest-coat",
  },
];

export const DEFAULT_BANNER: PromoBanner = {
  enabled: true,
  eyebrow: "VIP WINTER INVITATION",
  title: "خصم يصل إلى ٣٠٪ على طبقات الشتاء",
  subtitle:
    "اختيار محدود من المعاطف الصوفية والجاكيتات الجلدية. الكمية محدودة، والأولوية لعملاء Zoma.",
  imageUrl: "/images/editorial/milan-rain.jpg",
  ctaLabel: "اكتشف تشكيلة الشتاء",
  ctaHref: "/?cat=outerwear#catalog",
};

export const STORE = {
  name: "Zoma store",
  nameArabic: "زومة",
  tagline: "ملابس رجالية مختارة بعناية",
  city: "القاهرة · مصر",
  currency: "ج.م",
  whatsapp: "201036038971",
  phoneDisplay: "+20 103 603 8971",
  phoneHref: "tel:+201036038971",
  email: "ye360057@gmail.com",
  instapay: "01036038971",
  announcement: [
    "توصيل لكل محافظات مصر — تجهيز الطلبات خلال ٢٤ ساعة",
    "جلسات قياس شخصية مجاناً في استوديو القاهرة",
    "الدفع عند الاستلام أو تحويل إنستاباي — بدون رسوم إضافية",
    "قطع محدودة من كل تصميم · استبدال خلال ١٤ يوماً",
  ],
  paymentMethods: [
    {
      id: "cod",
      label: "الدفع عند الاستلام",
      note: "تستلم قطعتك وتدفع نقداً للمندوب. متاح في كل محافظات مصر.",
      enabled: true,
    },
    {
      id: "instapay",
      label: "تحويل إنستاباي",
      note: "حوّل المبلغ على رقم إنستاباي 01036038971 ثم أرسل صورة الإيصال على واتساب +20 103 603 8971.",
      enabled: true,
    },
  ],
  footerCredit:
    "تصميم وتطوير: يوسف المصري | للتواصل واتساب: +201221736903",
  footerCreditUrl: "https://wa.me/201221736903",
};

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: STORE.name,
  tagline: STORE.tagline,
  announcement: STORE.announcement,
  whatsapp: STORE.whatsapp,
  phoneDisplay: STORE.phoneDisplay,
  email: STORE.email,
  city: STORE.city,
  paymentMethods: STORE.paymentMethods,
  footerCredit: STORE.footerCredit,
  footerCreditUrl: STORE.footerCreditUrl,
  logoUrl: "",
  heroSlides: DEFAULT_HERO_SLIDES,
  banner: DEFAULT_BANNER,
};
