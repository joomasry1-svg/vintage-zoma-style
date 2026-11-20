import { useCallback, useEffect, useState } from "react";

export type CartLine = {
  key: string;
  productId: string;
  size: string;
  color: string;
  qty: number;
};

const STORAGE_KEY = "zoma-cart-v1";

function cartKey(productId: string, size: string, color: string) {
  return `${productId}::${size}::${color}`;
}

function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line): line is CartLine =>
        typeof line?.productId === "string" &&
        typeof line?.size === "string" &&
        typeof line?.color === "string" &&
        typeof line?.qty === "number" &&
        line.qty > 0,
    );
  } catch {
    return [];
  }
}

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>(readCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage can be unavailable (private mode); the cart still works in memory.
    }
  }, [lines]);

  const addItem = useCallback(
    (item: { productId: string; size: string; color: string; qty?: number }) => {
      const qty = Math.max(1, item.qty ?? 1);
      const key = cartKey(item.productId, item.size, item.color);
      setLines((current) => {
        const existing = current.find((line) => line.key === key);
        if (existing) {
          return current.map((line) =>
            line.key === key ? { ...line, qty: line.qty + qty } : line,
          );
        }
        return [
          ...current,
          { key, productId: item.productId, size: item.size, color: item.color, qty },
        ];
      });
    },
    [],
  );

  const setQty = useCallback((key: string, qty: number) => {
    setLines((current) =>
      qty <= 0
        ? current.filter((line) => line.key !== key)
        : current.map((line) => (line.key === key ? { ...line, qty } : line)),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setLines((current) => current.filter((line) => line.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  return {
    lines,
    count: lines.reduce((total, line) => total + line.qty, 0),
    isOpen,
    setIsOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    setQty,
    removeItem,
    clear,
  };
}
