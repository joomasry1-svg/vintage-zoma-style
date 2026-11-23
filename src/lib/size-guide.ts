import type { GarmentKind, Product } from "@/data/store";

type ChartRow = {
  width: number;
  length: number;
  height: string;
  shoulder?: number;
  sleeve?: number;
  inseam?: number;
  rise?: number;
  hip?: number;
};

export type SizeSystem = "standard" | "eu";
export type SizeProfile = "top" | "bottom" | "shoes" | "accessory";
export type GarmentKey =
  | "shoulder"
  | "chest"
  | "sleeve"
  | "length"
  | "waist"
  | "hip"
  | "inseam"
  | "width"
  | "heel";

export type SizeChoice = {
  value: string;
  standard: string;
  eu: string;
};

export type SizeDetails = {
  size: string;
  standardSize: string;
  profile: SizeProfile;
  width: number;
  length: number;
  height: string;
  widthLabel: string;
  lengthLabel: string;
  heightLabel: string;
  summary: { key: string; label: string; value: string }[];
  garment: { key: GarmentKey; label: string; value: string }[];
  note: string;
  fitNote: string;
};

const LETTERS = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
const STANDARD_SEQUENCE = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];

const EU_BY_LETTER: Record<string, string> = {
  XS: "46",
  S: "48",
  M: "50",
  L: "52",
  XL: "54",
  XXL: "56",
  "3XL": "58",
  "4XL": "60",
};

const TOP_KINDS: GarmentKind[] = [
  "coat",
  "jacket",
  "suit",
  "blazer",
  "shirt",
  "polo",
];

const TOPS: Record<string, ChartRow> = {
  XS: { width: 46, length: 66, height: "158–164", shoulder: 41, sleeve: 58 },
  S: { width: 50, length: 68, height: "163–170", shoulder: 43, sleeve: 60 },
  M: { width: 53, length: 70, height: "168–175", shoulder: 45, sleeve: 62 },
  L: { width: 56, length: 72, height: "173–180", shoulder: 47, sleeve: 64 },
  XL: { width: 60, length: 74, height: "178–185", shoulder: 49, sleeve: 66 },
  XXL: { width: 64, length: 76, height: "182–189", shoulder: 51, sleeve: 68 },
  "3XL": { width: 68, length: 78, height: "186–193", shoulder: 53, sleeve: 70 },
};

const SHIRTS: Record<string, ChartRow> = {
  S: { width: 51, length: 76, height: "163–170", shoulder: 44, sleeve: 61 },
  M: { width: 54, length: 77.5, height: "168–175", shoulder: 46, sleeve: 63 },
  L: { width: 57, length: 79, height: "173–180", shoulder: 48, sleeve: 65 },
  XL: { width: 61, length: 80.5, height: "178–185", shoulder: 50, sleeve: 67 },
  XXL: { width: 65, length: 82, height: "182–189", shoulder: 52, sleeve: 69 },
};

const COATS: Record<string, ChartRow> = {
  S: { width: 54, length: 96, height: "163–170", shoulder: 44, sleeve: 62 },
  M: { width: 57, length: 100, height: "168–175", shoulder: 46, sleeve: 64 },
  L: { width: 60, length: 104, height: "173–180", shoulder: 48, sleeve: 66 },
  XL: { width: 64, length: 108, height: "178–185", shoulder: 50, sleeve: 68 },
  XXL: { width: 68, length: 112, height: "182–189", shoulder: 52, sleeve: 70 },
};

const SUITS: Record<string, ChartRow> = {
  "46": { width: 48.5, length: 72, height: "166–172", shoulder: 43.5, sleeve: 61 },
  "48": { width: 50.5, length: 73.5, height: "168–175", shoulder: 45, sleeve: 62 },
  "50": { width: 52.5, length: 75, height: "172–179", shoulder: 46.5, sleeve: 63 },
  "52": { width: 54.5, length: 76.5, height: "176–183", shoulder: 48, sleeve: 64 },
  "54": { width: 56.5, length: 78, height: "180–187", shoulder: 49.5, sleeve: 65 },
  "56": { width: 58.5, length: 79.5, height: "184–191", shoulder: 51, sleeve: 66 },
  "58": { width: 60.5, length: 81, height: "188–195", shoulder: 52.5, sleeve: 67 },
};

const TROUSERS: Record<string, ChartRow> = {
  "30": { width: 38, length: 102, height: "165–172", inseam: 78, rise: 27, hip: 48 },
  "32": { width: 40.5, length: 103, height: "168–175", inseam: 79, rise: 28, hip: 50 },
  "34": { width: 43, length: 104, height: "171–178", inseam: 80, rise: 29, hip: 52 },
  "36": { width: 45.5, length: 105, height: "174–181", inseam: 81, rise: 30, hip: 54 },
  "38": { width: 48.5, length: 106, height: "177–184", inseam: 82, rise: 31, hip: 57 },
};

const SHOES: Record<string, ChartRow> = {
  "40": { width: 9.5, length: 25.5, height: "3" },
  "41": { width: 9.8, length: 26.3, height: "3" },
  "42": { width: 10, length: 27, height: "3" },
  "43": { width: 10.3, length: 27.7, height: "3" },
  "44": { width: 10.6, length: 28.5, height: "3.2" },
  "45": { width: 10.9, length: 29.3, height: "3.2" },
};

const BELTS: Record<string, ChartRow> = {
  "95": { width: 3.5, length: 95, height: "4" },
  "100": { width: 3.5, length: 100, height: "4" },
  "105": { width: 3.5, length: 105, height: "4" },
  "110": { width: 3.5, length: 110, height: "4" },
};

const ACCESSORY_ROWS: Record<string, ChartRow> = {
  watch: { width: 4.2, length: 24, height: "1.2" },
  tie: { width: 8, length: 145, height: "2" },
  belt: { width: 3.5, length: 105, height: "4" },
};

const BODY_TOPS: Record<
  string,
  { bust: string; waist: string; height: string }
> = {
  XS: { bust: "84–88", waist: "70–74", height: "158–165" },
  S: { bust: "92–96", waist: "76–80", height: "163–170" },
  M: { bust: "96–100", waist: "82–86", height: "168–175" },
  L: { bust: "100–104", waist: "88–92", height: "173–180" },
  XL: { bust: "104–108", waist: "94–98", height: "178–185" },
  XXL: { bust: "108–112", waist: "100–104", height: "182–189" },
  "3XL": { bust: "112–118", waist: "104–110", height: "186–193" },
  "4XL": { bust: "118–124", waist: "110–116", height: "190–197" },
};

const BODY_BOTTOMS: Record<
  string,
  { waist: string; hip: string; height: string }
> = {
  XS: { waist: "72–76", hip: "88–92", height: "158–165" },
  S: { waist: "76–80", hip: "92–96", height: "163–170" },
  M: { waist: "80–84", hip: "96–100", height: "168–175" },
  L: { waist: "84–88", hip: "100–104", height: "173–180" },
  XL: { waist: "88–92", hip: "104–108", height: "178–185" },
  XXL: { waist: "92–96", hip: "108–112", height: "182–189" },
  "3XL": { waist: "96–102", hip: "112–118", height: "186–193" },
  "4XL": { waist: "102–108", hip: "118–124", height: "190–197" },
};

const KIND_LABELS: Record<
  GarmentKind,
  { width: string; length: string; height: string; note: string }
> = {
  suit: {
    width: "نصف عرض الصدر",
    length: "طول الجاكيت",
    height: "الطول المناسب",
    note: "المقاس أوروبي (EU). اختر المقاس الأقرب لمحيط صدرك؛ للقصّة الضيقة اختر مقاساً أكبر.",
  },
  blazer: {
    width: "نصف عرض الصدر",
    length: "طول البليزر",
    height: "الطول المناسب",
    note: "عرض الصدر نصف المحيط. المقاس مبني على صدر ٩٦–١٠٠ سم للـ M كمرجع.",
  },
  coat: {
    width: "نصف عرض الصدر",
    length: "طول المعطف",
    height: "الطول المناسب",
    note: "المعطف مصمّم ليتّسع لطبقة تحته. إن كنت بين مقاسين فاختر الأكبر.",
  },
  jacket: {
    width: "نصف عرض الصدر",
    length: "طول الجاكيت",
    height: "الطول المناسب",
    note: "قياس الصدر مأخوذ من تحت الإبطين. الجلد الطبيعي يأخذ شكل الجسم مع الاستخدام.",
  },
  shirt: {
    width: "نصف عرض الصدر",
    length: "طول القميص",
    height: "الطول المناسب",
    note: "الطول مقاس من نقطة الكتف حتى أسفل الحاشية. القصّة مستقيمة وليست ضيقة.",
  },
  polo: {
    width: "نصف عرض الصدر",
    length: "طول البولو",
    height: "الطول المناسب",
    note: "قطن مصفّى بقصّة مريحة. المقاس M يناسب صدراً حتى ١٠٠ سم.",
  },
  trousers: {
    width: "نصف عرض الخصر",
    length: "طول البنطال",
    height: "الطول المناسب",
    note: "الطول الكلي من أعلى الخصر حتى الحاشية. يمكن تقصير الحاشية مجاناً في الاستوديو.",
  },
  shoes: {
    width: "عرض القدم",
    length: "طول النعل",
    height: "ارتفاع الكعب",
    note: "الطول الداخلي أقل من طول النعل بنصف سنتيمتر تقريباً. اختر نصف مقاس أكبر للراحة.",
  },
  belt: {
    width: "عرض الحزام",
    length: "طول الحزام",
    height: "عرض الإبزيم",
    note: "الرقم هو محيط الخصر بالسنتيمتر. اختر ٥ سم أكثر من محيط بنطالك المعتاد.",
  },
  tie: {
    width: "أعرض نقطة",
    length: "طول الكرافتة",
    height: "السماكة",
    note: "حرير طبيعي بعرض كلاسيكي ٨ سم، مناسب لياقات البدلات القياسية.",
  },
  watch: {
    width: "قطر العلبة",
    length: "طول السوار",
    height: "سماكة العلبة",
    note: "السوار قابل للتعديل. القياسات لا تشمل التاج.",
  },
};

function normalizeSize(value: string) {
  return value
    .trim()
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .toUpperCase();
}

function pickRow(chart: Record<string, ChartRow>, size: string) {
  return chart[size] ?? chart[Object.keys(chart)[0]];
}

function profileFor(kind: GarmentKind): SizeProfile {
  if (TOP_KINDS.includes(kind)) return "top";
  if (kind === "trousers") return "bottom";
  if (kind === "shoes") return "shoes";
  return "accessory";
}

export function hasStandardSizes(product: Product) {
  return (
    profileFor(product.kind) !== "shoes" &&
    profileFor(product.kind) !== "accessory" &&
    product.sizes.length > 1
  );
}

export function getSizeChoices(product: Product): SizeChoice[] {
  if (!hasStandardSizes(product)) {
    return product.sizes.map((size) => ({
      value: size,
      standard: size,
      eu: size,
    }));
  }

  return product.sizes.map((value, index) => {
    const normalized = normalizeSize(value);
    const standard = LETTERS.includes(normalized)
      ? normalized
      : (STANDARD_SEQUENCE[index] ?? normalized);

    return {
      value,
      standard,
      eu: /^[0-9]/.test(normalized)
        ? normalized
        : (EU_BY_LETTER[standard] ?? normalized),
    };
  });
}

export function getSizeLabel(
  product: Product,
  value: string,
  system: SizeSystem = "standard",
) {
  const choice = getSizeChoices(product).find((entry) => entry.value === value);
  if (!choice) return value;
  return system === "standard" ? choice.standard : choice.eu;
}

export function getSizeDetails(product: Product, size: string): SizeDetails {
  const normalized = normalizeSize(size);
  const profile = profileFor(product.kind);
  const choices = getSizeChoices(product);
  const choice =
    choices.find((entry) => entry.value === size) ??
    choices.find((entry) => normalizeSize(entry.value) === normalized);

  const { row } = (() => {
    if (product.kind === "coat") return { row: pickRow(COATS, normalized) };
    if (product.kind === "shirt") return { row: pickRow(SHIRTS, normalized) };
    if (product.kind === "trousers")
      return { row: pickRow(TROUSERS, normalized) };
    if (product.kind === "shoes") return { row: pickRow(SHOES, normalized) };
    if (product.kind === "belt") return { row: pickRow(BELTS, normalized) };
    if (product.kind === "watch" || product.kind === "tie") {
      return { row: ACCESSORY_ROWS[product.kind] };
    }
    if (product.kind === "suit" || product.kind === "blazer") {
      if (SUITS[normalized]) return { row: SUITS[normalized] };
      return { row: pickRow(TOPS, normalized) };
    }
    return { row: pickRow(TOPS, normalized) };
  })();

  const standardSize = choice?.standard ?? normalized;
  const labels = KIND_LABELS[product.kind] ?? KIND_LABELS.shirt;
  const bodyTop = BODY_TOPS[standardSize] ?? BODY_TOPS.M;
  const bodyBottom = BODY_BOTTOMS[standardSize] ?? BODY_BOTTOMS.M;

  let summary: { key: string; label: string; value: string }[] = [];
  let garment: { key: GarmentKey; label: string; value: string }[] = [];
  let height = row.height;
  let fitNote = "قياسات مرجعية بالسنتمتر قبل تأكيد الطلب.";

  if (profile === "top") {
    height = bodyTop.height;
    summary = [
      { key: "body_bust", label: "الصدر", value: `${bodyTop.bust} سم` },
      { key: "body_waist", label: "الخصر", value: `${bodyTop.waist} سم` },
      { key: "body_height", label: "الطول", value: `${bodyTop.height} سم` },
    ];
    garment = [
      {
        key: "shoulder",
        label: "عرض الكتف",
        value: formatNumber(row.shoulder ?? 45),
      },
      {
        key: "chest",
        label: "محيط الصدر",
        value: formatNumber(Math.round(row.width * 2)),
      },
      {
        key: "sleeve",
        label: "طول الكم",
        value: formatNumber(row.sleeve ?? 63),
      },
      {
        key: "length",
        label: "طول القطعة",
        value: formatNumber(row.length),
      },
    ];
    fitNote = "٧٥٪ من العملاء يقولون إن هذا المقاس مطابق لجدول القياسات.";
  } else if (profile === "bottom") {
    height = bodyBottom.height;
    summary = [
      { key: "body_waist", label: "الخصر", value: `${bodyBottom.waist} سم` },
      { key: "body_hip", label: "الأرداف", value: `${bodyBottom.hip} سم` },
      { key: "body_height", label: "الطول", value: `${bodyBottom.height} سم` },
    ];
    garment = [
      {
        key: "waist",
        label: "محيط الخصر",
        value: formatNumber(Math.round(row.width * 2)),
      },
      {
        key: "hip",
        label: "محيط الأرداف",
        value: formatNumber(Math.round((row.hip ?? row.width + 9) * 2)),
      },
      {
        key: "inseam",
        label: "الطول الداخلي",
        value: formatNumber(row.inseam ?? 80),
      },
      {
        key: "length",
        label: "طول البنطال",
        value: formatNumber(row.length),
      },
    ];
    fitNote = "٧٢٪ من العملاء يقولون إن هذا المقاس مطابق لجدول القياسات.";
  } else if (profile === "shoes") {
    summary = [
      {
        key: "foot_length",
        label: "طول القدم",
        value: `${formatNumber(row.length)} سم`,
      },
      {
        key: "foot_width",
        label: "عرض القدم",
        value: `${formatNumber(row.width)} سم`,
      },
      { key: "foot_height", label: "ارتفاع الكعب", value: `${row.height} سم` },
    ];
    garment = [
      {
        key: "length",
        label: "طول النعل",
        value: formatNumber(row.length),
      },
      {
        key: "width",
        label: "عرض القدم",
        value: formatNumber(row.width),
      },
      { key: "heel", label: "ارتفاع الكعب", value: row.height },
    ];
    fitNote = "قارن طول قدمك قبل الطلب؛ المقاس الأوروبي مذكور على النعل.";
  } else {
    summary = [
      {
        key: "item_length",
        label: "الطول",
        value: `${formatNumber(row.length)} سم`,
      },
      {
        key: "item_width",
        label: "العرض",
        value: `${formatNumber(row.width)} سم`,
      },
      { key: "item_height", label: "الارتفاع", value: `${row.height} سم` },
    ];
    garment = [
      {
        key: "length",
        label: "الطول",
        value: formatNumber(row.length),
      },
      {
        key: "width",
        label: "العرض",
        value: formatNumber(row.width),
      },
      { key: "heel", label: "الارتفاع", value: row.height },
    ];
  }

  const overrides =
    product.sizeOverrides?.find((entry) => entry.size === size)?.values ?? {};
  const custom = (key: string) => overrides[key]?.trim() ?? "";

  summary = summary.map((metric) => {
    const value = custom(metric.key);
    return value ? { ...metric, value: withUnit(value) } : metric;
  });
  garment = garment.map((metric) => {
    const value = custom(metric.key);
    return value ? { ...metric, value: stripUnit(value) } : metric;
  });
  if (custom("body_height") || custom("item_height") || custom("foot_height")) {
    height = stripUnit(
      custom("body_height") || custom("item_height") || custom("foot_height"),
    );
  }

  return {
    size,
    standardSize,
    profile,
    width: row.width,
    length: row.length,
    height,
    widthLabel: labels.width,
    lengthLabel: labels.length,
    heightLabel: labels.height,
    summary,
    garment,
    note: labels.note,
    fitNote,
  };
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function stripUnit(value: string) {
  return value
    .replace(/\s*(سم|cm)\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function withUnit(value: string) {
  const clean = stripUnit(value);
  return clean ? `${clean} سم` : clean;
}
