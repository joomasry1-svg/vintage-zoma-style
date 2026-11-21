import type { GarmentKind, Product } from "@/data/store";

type ChartRow = {
  width: number;
  length: number;
  height: string;
  shoulder?: number;
  sleeve?: number;
  inseam?: number;
  rise?: number;
};

export type SizeDetails = {
  size: string;
  width: number;
  length: number;
  height: string;
  widthLabel: string;
  lengthLabel: string;
  heightLabel: string;
  secondary: { label: string; value: string }[];
  note: string;
};

const TOPS: Record<string, ChartRow> = {
  XS: { width: 46, length: 66, height: "152–160", shoulder: 41, sleeve: 58 },
  S: { width: 50, length: 68, height: "158–166", shoulder: 43, sleeve: 60 },
  M: { width: 53, length: 70, height: "164–172", shoulder: 45, sleeve: 62 },
  L: { width: 56, length: 72, height: "170–178", shoulder: 47, sleeve: 64 },
  XL: { width: 60, length: 74, height: "176–184", shoulder: 49, sleeve: 66 },
  XXL: { width: 64, length: 76, height: "182–190", shoulder: 51, sleeve: 68 },
  "3XL": { width: 68, length: 78, height: "188–196", shoulder: 53, sleeve: 70 },
};

const SHIRTS: Record<string, ChartRow> = {
  S: { width: 51, length: 76, height: "158–166", shoulder: 44, sleeve: 61 },
  M: { width: 54, length: 77.5, height: "164–172", shoulder: 46, sleeve: 63 },
  L: { width: 57, length: 79, height: "170–178", shoulder: 48, sleeve: 65 },
  XL: { width: 61, length: 80.5, height: "176–184", shoulder: 50, sleeve: 67 },
  XXL: { width: 65, length: 82, height: "182–190", shoulder: 52, sleeve: 69 },
};

const COATS: Record<string, ChartRow> = {
  S: { width: 54, length: 96, height: "160–168", shoulder: 44, sleeve: 62 },
  M: { width: 57, length: 100, height: "166–174", shoulder: 46, sleeve: 64 },
  L: { width: 60, length: 104, height: "172–180", shoulder: 48, sleeve: 66 },
  XL: { width: 64, length: 108, height: "178–186", shoulder: 50, sleeve: 68 },
  XXL: { width: 68, length: 112, height: "184–192", shoulder: 52, sleeve: 70 },
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
  "30": { width: 38, length: 102, height: "165–173", inseam: 78, rise: 27 },
  "32": { width: 40.5, length: 103, height: "168–176", inseam: 79, rise: 28 },
  "34": { width: 43, length: 104, height: "171–179", inseam: 80, rise: 29 },
  "36": { width: 45.5, length: 105, height: "174–182", inseam: 81, rise: 30 },
  "38": { width: 48.5, length: 106, height: "177–185", inseam: 82, rise: 31 },
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
    note: "قطن مصفّى بقصّة مريحة. المقاس M يناسب صدراً حتى ١٠٦ سم.",
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

function chartFor(kind: GarmentKind, size: string) {
  if (kind === "coat") return { row: pickRow(COATS, size), chart: "coat" };
  if (kind === "shirt") return { row: pickRow(SHIRTS, size), chart: "shirt" };
  if (kind === "trousers") return { row: pickRow(TROUSERS, size), chart: "trousers" };
  if (kind === "shoes") return { row: pickRow(SHOES, size), chart: "shoes" };
  if (kind === "belt") return { row: pickRow(BELTS, size), chart: "belt" };
  if (kind === "watch" || kind === "tie") {
    return { row: ACCESSORY_ROWS[kind], chart: "accessory" };
  }
  if (kind === "suit" || kind === "blazer") {
    if (SUITS[size]) return { row: SUITS[size], chart: "suit" };
    return { row: pickRow(TOPS, size), chart: "top" };
  }
  return { row: pickRow(TOPS, size), chart: "top" };
}

function secondaryFor(
  kind: GarmentKind,
  row: ChartRow,
  size: string,
): { label: string; value: string }[] {
  if (kind === "coat" || kind === "jacket" || kind === "suit" || kind === "blazer") {
    return [
      { label: "محيط الصدر", value: `${Math.round(row.width * 2)} سم` },
      { label: "عرض الكتف", value: `${row.shoulder ?? 46} سم` },
      { label: "طول الكم", value: `${row.sleeve ?? 63} سم` },
    ];
  }
  if (kind === "shirt" || kind === "polo") {
    return [
      { label: "محيط الصدر", value: `${Math.round(row.width * 2)} سم` },
      { label: "عرض الكتف", value: `${row.shoulder ?? 46} سم` },
      { label: "طول الكم", value: `${row.sleeve ?? 63} سم` },
    ];
  }
  if (kind === "trousers") {
    return [
      { label: "محيط الخصر", value: `${Math.round(row.width * 2)} سم` },
      { label: "الطول الداخلي", value: `${row.inseam ?? 80} سم` },
      { label: "ارتفاع الخصر", value: `${row.rise ?? 29} سم` },
    ];
  }
  if (kind === "shoes") {
    return [
      { label: "المقاس الأوروبي", value: `EU ${size}` },
      { label: "الطول الداخلي", value: `${(row.length - 0.5).toFixed(1)} سم` },
      { label: "نوع القياس", value: "قدم رجالي" },
    ];
  }
  if (kind === "belt") {
    return [
      { label: "محيط الخصر المناسب", value: `${size} سم` },
      { label: "عدد الثقوب", value: "٥ ثقوب" },
      { label: "الخامة", value: "جلد طبيعي" },
    ];
  }
  if (kind === "tie") {
    return [
      { label: "العرض", value: "٨ سم" },
      { label: "الطول", value: "١٤٥ سم" },
      { label: "الخامة", value: "حرير طبيعي" },
    ];
  }
  if (kind === "watch") {
    return [
      { label: "قطر العلبة", value: "٤٫٢ سم" },
      { label: "طول السوار", value: "٢٤ سم" },
      { label: "الحركة", value: "كوارتز سويسري" },
    ];
  }
  return [
    { label: "المقاس", value: size },
    { label: "الخامة", value: "مختارة يدوياً" },
    { label: "الضمان", value: "١٤ يوم استبدال" },
  ];
}

export function getSizeDetails(product: Product, size: string): SizeDetails {
  const normalized = normalizeSize(size);
  const { row } = chartFor(product.kind, normalized);
  const labels = KIND_LABELS[product.kind] ?? KIND_LABELS.shirt;

  return {
    size,
    width: row.width,
    length: row.length,
    height: row.height,
    widthLabel: labels.width,
    lengthLabel: labels.length,
    heightLabel: labels.height,
    secondary: secondaryFor(product.kind, row, normalized),
    note: labels.note,
  };
}
