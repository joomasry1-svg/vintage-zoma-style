export const CATEGORIES = [
  {
    id: "suits",
    label: "البدلات",
    note: "قصّات صوفية كلاسيكية للحظة التي تليق بك",
  },
  { id: "blazers", label: "البليزرات", note: "طبقة أنيقة فوق أي تفصيل" },
  { id: "shirts", label: "القمصان", note: "قطن وأكتان بلمسة أرشيفية" },
  { id: "polos", label: "البولو", note: "كاجوال راقٍ بعناية" },
  { id: "trousers", label: "البناطيل", note: "ساق مستقيمة وقصّة مريحة" },
  { id: "shoes", label: "الأحذية", note: "جلد طبيعي وخياطة يدوية" },
  { id: "accessories", label: "الإكسسوارات", note: "التفاصيل الصغيرة تُكمل الحكاية" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type GarmentKind =
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
};

export const PRODUCTS: Product[] = [
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
];

export const STORE = {
  name: "Zoma store",
  nameArabic: "زومة",
  tagline: "بيت الأزياء الرجالية",
  city: "القاهرة · مصر",
  currency: "ج.م",
  whatsapp: "201036038971",
  phoneDisplay: "+20 103 603 8971",
  phoneHref: "tel:+201036038971",
  instapay: "01036038971",
  announcement: [
    "عروض الشتاء الحصرية — خصومات تصل إلى ٥٠٪ على البدلات والبليزرات",
    "توصيل مجاني للطلبات فوق ٥٠٠٠ جنيه داخل القاهرة والجيزة",
    "تفصيل يدوي وأقمشة مستوردة · استبدال خلال ١٤ يوماً",
    "اطلب الآن عبر واتساب: +20 103 603 8971",
  ],
  paymentMethods: [
    {
      id: "cod",
      label: "الدفع عند الاستلام",
      note: "تستلم قطعتك وتدفع نقداً للمندوب. متاح في كل محافظات مصر.",
    },
    {
      id: "instapay",
      label: "تحويل إنستاباي",
      note: "حوّل المبلغ على رقم إنستاباي 01036038971 ثم أرسل صورة الإيصال على واتساب +20 103 603 8971.",
    },
  ],
  developerCredit: {
    text: "تصميم وتطوير: يوسف المصري | للتواصل واتساب: +201221736903",
    whatsapp: "201221736903",
  },
};
