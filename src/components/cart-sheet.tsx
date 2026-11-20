import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStore } from "@/context/store-context";
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
import { toast } from "sonner";
import {
  CheckCircle2,
  Loader2,
  Minus,
  MessageCircle,
  Package,
  Plus,
  Trash2,
} from "lucide-react";

type CheckoutErrors = Partial<Record<"name" | "phone" | "address", string>>;

export function CartSheet() {
  const { cart, products, settings } = useStore();
  const createOrder = useMutation(api.store.createOrder);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState<string | null>(null);

  const methods = settings.paymentMethods.filter((method) => method.enabled);
  const selectedPayment =
    methods.find((method) => method.id === paymentId) ?? methods[0];

  const total = cartTotal(cart.lines, products);

  useEffect(() => {
    if (methods.length > 0 && !methods.some((method) => method.id === paymentId)) {
      setPaymentId(methods[0].id);
    }
  }, [methods, paymentId]);

  useEffect(() => {
    if (cart.isOpen && cart.lines.length > 0) {
      setSubmittedMessage(null);
      setOrderCode(null);
    }
  }, [cart.isOpen, cart.lines.length]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.lines.length || isSubmitting) return;

    const nextErrors: CheckoutErrors = {};
    if (name.trim().length < 3) nextErrors.name = "اكتب الاسم الكامل من فضلك.";
    if (!/^[+\d][\d\s()-]{8,}$/.test(phone.trim()))
      nextErrors.phone = "اكتب رقم هاتف صحيحاً للتواصل.";
    if (address.trim().length < 6)
      nextErrors.address = "اكتب المحافظة والعنوان بالتفصيل.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payment = selectedPayment ?? {
      id: "cod",
      label: "الدفع عند الاستلام",
    };

    const checkoutLines = cart.lines.filter((line) =>
      products.some((product) => product.id === line.productId),
    );
    if (checkoutLines.length === 0) {
      toast.error("القطع في الحقيبة لم تعد متاحة. أضف قطعة أخرى أولاً.");
      return;
    }

    setIsSubmitting(true);
    let code: string | undefined;
    try {
      const result = await createOrder({
        items: checkoutLines.map((line) => ({
          slug: line.productId,
          size: line.size,
          color: line.color,
          qty: line.qty,
        })),
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          notes: notes.trim() || undefined,
        },
        payment: payment.label,
        paymentId: payment.id,
      });
      code = result.code;
      setOrderCode(code);
    } catch (error) {
      console.warn("[Zoma] Order was not saved:", error);
      toast.warning("لم نتمكن من حفظ الطلب في النظام، لكن رسالة واتساب جاهزة.");
    }

    const message = buildOrderMessage({
      lines: checkoutLines,
      products,
      storeName: settings.storeName,
      code,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        payment: payment.label,
        notes: notes.trim(),
      },
    });

    window.open(whatsappLink(message, settings.whatsapp), "_blank", "noopener,noreferrer");
    if (code) {
      // The order is saved with the store; clear the bag to prevent a duplicate
      // submission while keeping the confirmation (and resend link) visible.
      cart.clear();
    }
    setSubmittedMessage(message);
    setIsSubmitting(false);
  };

  return (
    <Sheet
      open={cart.isOpen}
      onOpenChange={(open) => {
        cart.setIsOpen(open);
        if (!open) {
          setSubmittedMessage(null);
          setOrderCode(null);
        }
      }}
    >
      <SheetContent
        side="left"
        className="w-full gap-0 border-ink/15 bg-card p-0 sm:max-w-md"
      >
        <div className="border-b border-ink/10 px-5 py-5 ps-12">
          <p className="mono text-[9px] tracking-[0.28em] text-gold">
            BAG / {cart.count.toString().padStart(2, "0")}
          </p>
          <SheetTitle className="mt-1 text-2xl text-ink">حقيبة التسوق</SheetTitle>
          <SheetDescription className="mt-1 text-[11px] text-ink-soft/70">
            {submittedMessage
              ? "تم إنشاء الطلب — احتفظ برقمه لمتابعته مع الفريق."
              : cart.lines.length
                ? "راجع قطعك ثم أرسل الطلب عبر واتساب لتأكيده."
                : "حقيبتك فارغة — ابدأ من الكتالوج."}
          </SheetDescription>
        </div>

        {submittedMessage ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-7 text-center">
            <CheckCircle2 className="size-11 text-gold" strokeWidth={1.4} />
            <p className="text-2xl font-semibold text-ink">تم تجهيز طلبك</p>
            {orderCode && (
              <p className="mono border border-gold/30 bg-gold/10 px-3 py-1.5 text-[10px] tracking-[0.14em] text-gold">
                {orderCode}
              </p>
            )}
            <p className="max-w-[280px] text-[12px] leading-6 text-ink-soft/70">
              فتحنا واتساب برسالة الطلب. إذا لم يفتح تلقائياً، اضغط الزر
              بالأسفل وأرسل الرسالة لتأكيد الحجز.
            </p>
            <a
              href={whatsappLink(submittedMessage, settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex h-11 w-full max-w-[280px] items-center justify-center gap-2 bg-gold text-[11px] font-medium tracking-[0.12em] text-espresso transition-opacity hover:opacity-90"
            >
              <MessageCircle className="size-4" />
              فتح واتساب وإرسال الطلب
            </a>
            <button
              type="button"
              onClick={() => {
                setSubmittedMessage(null);
                cart.closeCart();
              }}
              className="text-[11px] text-ink-soft/60 underline underline-offset-4 transition-colors hover:text-ink"
            >
              متابعة التسوق
            </button>
          </div>
        ) : cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="flex size-16 items-center justify-center border border-ink/10 bg-paper-deep">
              <Package className="size-6 text-ink-soft/60" />
            </div>
            <p className="text-xl font-semibold text-ink">لا توجد قطع بعد</p>
            <p className="max-w-[240px] text-[12px] leading-6 text-ink-soft/70">
              أضف بدلة أو قميصاً إلى الحقيبة، وسنكمل الطلب معك على واتساب خطوة
              بخطوة.
            </p>
            <button
              type="button"
              onClick={cart.closeCart}
              className="mt-1 bg-gold px-5 py-2.5 text-[11px] font-medium text-espresso transition-opacity hover:opacity-90"
            >
              تصفح الكتالوج
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-ink/10">
                {cart.lines.map((line) => {
                  const product = products.find(
                    (item) => item.id === line.productId,
                  );
                  if (!product) return null;
                  const linePrice = priceOf(product) * line.qty;
                  return (
                    <li key={line.key} className="flex gap-3 px-5 py-4">
                      <ProductPlate
                        kind={product.kind}
                        tone={
                          product.colors.find((c) => c.name === line.color)?.hex ??
                          product.tone
                        }
                        className="size-20 shrink-0 border border-ink/10"
                        plateClassName="p-2"
                        framed={false}
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[14px] font-medium leading-6 text-ink">
                            {product.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => cart.removeItem(line.key)}
                            aria-label="حذف القطعة"
                            className="p-1 text-ink-soft/50 transition-colors hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <p className="mono mt-0.5 text-[9px] tracking-[0.08em] text-ink-soft/50">
                          SIZE {line.size} · {line.color}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center border border-ink/15">
                            <button
                              type="button"
                              onClick={() => cart.setQty(line.key, line.qty - 1)}
                              className="px-2 py-1.5 transition-colors hover:bg-ink/5"
                              aria-label="تقليل الكمية"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="mono w-7 text-center text-[11px]">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => cart.setQty(line.key, line.qty + 1)}
                              className="px-2 py-1.5 transition-colors hover:bg-ink/5"
                              aria-label="زيادة الكمية"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <span className="mono text-[11px] text-ink">
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
                className="border-t border-ink/10 px-5 py-5"
              >
                <p className="text-lg font-semibold text-ink">بيانات التوصيل</p>
                <p className="mt-0.5 text-[10px] text-ink-soft/60">
                  نستخدم بياناتك لتأكيد الطلب فقط، ولا نشاركها مع أي طرف آخر.
                </p>

                <div className="mt-4 space-y-3">
                  <Field label="الاسم الكامل" error={errors.name}>
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="مثال: أحمد محمود"
                      className="h-11 rounded-none border-ink/15 bg-paper-deep text-sm"
                    />
                  </Field>
                  <Field label="رقم الهاتف" error={errors.phone}>
                    <Input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="01xxxxxxxxx"
                      inputMode="tel"
                      dir="ltr"
                      className="h-11 rounded-none border-ink/15 bg-paper-deep text-start text-sm"
                    />
                  </Field>
                  <Field label="المحافظة والعنوان" error={errors.address}>
                    <Textarea
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="القاهرة — مدينة نصر، شارع ...، رقم العمارة"
                      rows={2}
                      className="resize-none rounded-none border-ink/15 bg-paper-deep text-sm"
                    />
                  </Field>
                  <Field label="ملاحظات (اختياري)">
                    <Input
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="وقت مناسب للتوصيل أو أي تفاصيل إضافية"
                      className="h-11 rounded-none border-ink/15 bg-paper-deep text-sm"
                    />
                  </Field>
                </div>

                <p className="mt-6 text-lg font-semibold text-ink">طريقة الدفع</p>
                <div className="mt-2 space-y-2">
                  {methods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentId(method.id)}
                      className={cn(
                        "flex w-full items-start gap-3 border p-3 text-start transition-colors",
                        selectedPayment?.id === method.id
                          ? "border-gold/70 bg-gold/10"
                          : "border-ink/15 hover:border-ink/35",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                          selectedPayment?.id === method.id
                            ? "border-gold"
                            : "border-ink/30",
                        )}
                      >
                        {selectedPayment?.id === method.id && (
                          <span className="size-2 rounded-full bg-gold" />
                        )}
                      </span>
                      <span className="flex-1">
                        <span className="block text-[12px] font-semibold text-ink">
                          {method.label}
                        </span>
                        <span className="mt-0.5 block text-[10px] leading-5 text-ink-soft/60">
                          {method.note}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>

                <p className="mt-4 border-t border-ink/10 pt-3 text-[10px] leading-5 text-ink-soft/50">
                  الشحن يُحسب حسب المحافظة ويُتفق عليه معك على واتساب قبل
                  الإرسال. الحجز يُثبّت بعد تأكيد فريق المتجر.
                </p>
              </form>
            </div>

            <div className="border-t border-ink/15 bg-paper-deep px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="mono text-[10px] tracking-[0.14em] text-ink-soft/60">
                  TOTAL
                </span>
                <span className="mono text-xl text-ink">{formatPrice(total)}</span>
              </div>
              <p className="mt-1 text-[10px] text-ink-soft/50">
                {selectedPayment
                  ? `${selectedPayment.label} · بدون رسوم إضافية`
                  : ""}
              </p>
              <button
                type="submit"
                form="zoma-checkout"
                disabled={isSubmitting}
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 bg-gold text-xs font-semibold tracking-[0.12em] text-espresso transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <MessageCircle className="size-4" />
                )}
                إتمام الطلب عبر واتساب
              </button>
              <p className="mt-2 text-center text-[9px] text-ink-soft/40">
                يفتح واتساب برسالة الطلب كاملة — رقم{" "}
                <span dir="ltr">{settings.phoneDisplay}</span>
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
      <span className="mb-1 block text-[10px] tracking-[0.08em] text-ink-soft/70">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-[10px] text-destructive">{error}</span>
      )}
    </label>
  );
}
