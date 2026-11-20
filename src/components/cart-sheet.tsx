import { useEffect, useState } from "react";
import type { CartLine } from "@/hooks/use-cart";
import { PRODUCTS, STORE } from "@/data/store";
import {
  buildOrderMessage,
  cartTotal,
  formatPrice,
  priceOf,
  whatsappLink,
} from "@/lib/store-helpers";
import { ProductPlate } from "@/components/garment-plate";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Minus,
  MessageCircle,
  Package,
  Plus,
  Trash2,
  Truck,
} from "lucide-react";

type CheckoutErrors = Partial<Record<"name" | "phone" | "address", string>>;

export function CartSheet({
  open,
  onOpenChange,
  lines,
  onQty,
  onRemove,
  onClear,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines: CartLine[];
  onQty: (key: string, qty: number) => void;
  onRemove: (key: string) => void;
  onClear: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState(STORE.paymentMethods[0].label);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const total = cartTotal(lines, PRODUCTS);
  const selectedPayment = STORE.paymentMethods.find(
    (method) => method.label === payment,
  );

  useEffect(() => {
    if (!open) return;
    if (lines.length > 0) setSubmittedMessage(null);
  }, [open, lines.length]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lines.length) return;

    const nextErrors: CheckoutErrors = {};
    if (name.trim().length < 3) nextErrors.name = "اكتب الاسم الكامل من فضلك.";
    if (!/^[+\d][\d\s()-]{8,}$/.test(phone.trim()))
      nextErrors.phone = "اكتب رقم هاتف صحيح للتواصل.";
    if (address.trim().length < 6)
      nextErrors.address = "اكتب المحافظة والعنوان بالتفصيل.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const message = buildOrderMessage({
      lines,
      products: PRODUCTS,
      storeName: STORE.name,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        payment,
        notes: notes.trim(),
      },
    });

    window.open(whatsappLink(message, STORE.whatsapp), "_blank", "noopener,noreferrer");
    setSubmittedMessage(message);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full gap-0 border-ink/20 bg-paper p-0 sm:max-w-md"
      >
        <div className="border-b border-ink/12 px-5 py-5 ps-12">
          <p className="text-[9px] tracking-[0.3em] text-sepia">ZOMA STORE</p>
          <SheetTitle className="mt-1 font-display text-2xl text-ink">
            حقيبة التسوق
          </SheetTitle>
          <SheetDescription className="mt-0.5 text-[11px] text-muted-foreground">
            {lines.length
              ? "راجع قطعك ثم أرسل الطلب عبر واتساب لتأكيده."
              : "حقيبتك فارغة — اختر بدلتك الأولى من المجموعة."}
          </SheetDescription>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full border border-ink/15 bg-paper-deep/50">
              <Package className="size-6 text-sepia" />
            </div>
            <p className="font-display text-xl text-ink">لا توجد قطع بعد</p>
            <p className="max-w-[240px] text-[12px] leading-6 text-muted-foreground">
              أضف بدلة أو قميصاً إلى الحقيبة، وسنكمل الطلب معك على واتساب خطوة
              بخطوة.
            </p>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-1 border border-ink/25 px-5 py-2.5 text-[11px] tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              تصفح المجموعة
            </button>
          </div>
        ) : submittedMessage ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-7 text-center">
            <CheckCircle2 className="size-11 text-gold" strokeWidth={1.4} />
            <p className="font-display text-2xl text-ink">تم تجهيز طلبك</p>
            <p className="max-w-[280px] text-[12px] leading-6 text-muted-foreground">
              فتحنا واتساب برسالة الطلب. إذا لم يفتح تلقائياً اضغط الزر بالأسفل
              وأرسل الرسالة لتأكيد الحجز.
            </p>
            <a
              href={whatsappLink(submittedMessage, STORE.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex h-11 w-full max-w-[280px] items-center justify-center gap-2 bg-ink text-[11px] tracking-[0.16em] text-paper transition-colors hover:bg-espresso"
            >
              <MessageCircle className="size-4" />
              فتح واتساب وإرسال الطلب
            </a>
            <button
              type="button"
              onClick={() => {
                onClear();
                onOpenChange(false);
              }}
              className="text-[11px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-ink"
            >
              إفراغ الحقيبة ومتابعة التسوق
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-ink/10">
                {lines.map((line) => {
                  const product = PRODUCTS.find(
                    (item) => item.id === line.productId,
                  );
                  if (!product) return null;
                  const linePrice = priceOf(product) * line.qty;
                  return (
                    <li key={line.key} className="flex gap-3 px-5 py-4">
                      <ProductPlate
                        kind={product.kind}
                        tone={product.colors.find((c) => c.name === line.color)?.hex ?? product.tone}
                        className="size-20 shrink-0 border border-ink/12"
                        plateClassName="p-2"
                        framed={false}
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-display text-[15px] leading-6 text-ink">
                            {product.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => onRemove(line.key)}
                            aria-label="حذف القطعة"
                            className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          المقاس {line.size} · {line.color}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center border border-ink/15">
                            <button
                              type="button"
                              onClick={() => onQty(line.key, line.qty - 1)}
                              className="px-2 py-1.5 transition-colors hover:bg-ink/5"
                              aria-label="تقليل الكمية"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-6 text-center text-[11px] tabular">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => onQty(line.key, line.qty + 1)}
                              className="px-2 py-1.5 transition-colors hover:bg-ink/5"
                              aria-label="زيادة الكمية"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <span className="text-[12px] font-medium text-ink tabular">
                            {formatPrice(linePrice)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <form
                id="zoma-checkout"
                onSubmit={handleSubmit}
                className="border-t border-ink/12 px-5 py-5"
              >
                <p className="font-display text-lg text-ink">بيانات التوصيل</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  نستخدم بياناتك لتأكيد الطلب فقط.
                </p>

                <div className="mt-4 space-y-3">
                  <Field label="الاسم الكامل" error={errors.name}>
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="مثال: أحمد محمود"
                      className="h-11 rounded-none border-ink/20 bg-paper/70 text-sm"
                    />
                  </Field>
                  <Field label="رقم الهاتف" error={errors.phone}>
                    <Input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="01xxxxxxxxx"
                      inputMode="tel"
                      dir="ltr"
                      className="h-11 rounded-none border-ink/20 bg-paper/70 text-start text-sm"
                    />
                  </Field>
                  <Field label="المحافظة والعنوان" error={errors.address}>
                    <Textarea
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="القاهرة — مدينة نصر، شارع ...، رقم العمارة"
                      rows={2}
                      className="resize-none rounded-none border-ink/20 bg-paper/70 text-sm"
                    />
                  </Field>
                  <Field label="ملاحظات (اختياري)">
                    <Input
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="وقت مناسب للتوصيل أو أي تفاصيل إضافية"
                      className="h-11 rounded-none border-ink/20 bg-paper/70 text-sm"
                    />
                  </Field>
                </div>

                <p className="mt-6 font-display text-lg text-ink">طريقة الدفع</p>
                <div className="mt-2 space-y-2">
                  {STORE.paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPayment(method.label)}
                      className={cn(
                        "flex w-full items-start gap-3 border p-3 text-start transition-colors",
                        payment === method.label
                          ? "border-gold bg-gold/10"
                          : "border-ink/15 hover:border-ink/35",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                          payment === method.label
                            ? "border-ink"
                            : "border-ink/35",
                        )}
                      >
                        {payment === method.label && (
                          <span className="size-2 rounded-full bg-ink" />
                        )}
                      </span>
                      <span className="flex-1">
                        <span className="block text-[12px] font-semibold text-ink">
                          {method.label}
                        </span>
                        <span className="mt-0.5 block text-[10px] leading-5 text-muted-foreground">
                          {method.note}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>

                <p className="mt-4 flex items-start gap-2 border-t border-ink/10 pt-3 text-[10px] leading-5 text-muted-foreground">
                  <Truck className="mt-0.5 size-3.5 shrink-0 text-sepia" />
                  الشحن يُحسب حسب المحافظة ويُتفق عليه معك على واتساب قبل
                  الإرسال.
                </p>
              </form>
            </div>

            <div className="border-t border-ink/15 bg-paper-deep/35 px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[0.14em] text-ink-soft">
                  الإجمالي
                </span>
                <span className="font-display text-2xl text-ink tabular">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {selectedPayment
                  ? `${selectedPayment.label} · بدون أي رسوم إضافية`
                  : ""}
              </p>
              <button
                type="submit"
                form="zoma-checkout"
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 bg-ink text-xs tracking-[0.16em] text-paper transition-colors hover:bg-espresso"
              >
                <MessageCircle className="size-4" />
                إتمام الطلب عبر واتساب
              </button>
              <p className="mt-2 text-center text-[9px] text-muted-foreground">
                يفتح واتساب برسالة الطلب كاملة — رقم{" "}
                <span dir="ltr">{STORE.phoneDisplay}</span>
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] tracking-[0.14em] text-ink-soft">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-[10px] text-destructive">{error}</span>}
    </label>
  );
}
