import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DEFAULT_SETTINGS,
  PRODUCTS,
  type CategoryId,
  type GarmentKind,
  type Product,
  type StoreSettings,
} from "@/data/store";
import { useCart } from "@/hooks/use-cart";

type StoreContextValue = {
  products: Product[];
  settings: StoreSettings;
  cart: ReturnType<typeof useCart>;
  isLoading: boolean;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const productsQuery = useQuery(api.store.listProducts);
  const settingsQuery = useQuery(api.store.getSettings);
  const ensureSeed = useMutation(api.store.ensureSeed);
  const seeded = useRef(false);
  const cart = useCart();

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    ensureSeed().catch((error) => {
      console.warn("[Zoma] Could not seed Convex store:", error);
    });
  }, [ensureSeed]);

  const storeIsSeeded =
    settingsQuery !== undefined && settingsQuery !== null;

  const products = useMemo<Product[]>(() => {
    // Before seeding, show the launch catalog so the storefront is never empty.
    // Once the store exists, the database is the single source of truth.
    if (!storeIsSeeded || !productsQuery) return PRODUCTS;
    return productsQuery.map((doc) => ({
      id: doc.slug,
      name: doc.name,
      category: doc.category as CategoryId,
      kind: doc.kind as GarmentKind,
      description: doc.description,
      fabric: doc.fabric,
      price: doc.price,
      discount: doc.discount,
      sizes: doc.sizes,
      colors: doc.colors,
      tone: doc.tone,
      badge: doc.badge,
      inStock: doc.inStock,
      keywords: doc.keywords,
    }));
  }, [productsQuery, storeIsSeeded]);

  useEffect(() => {
    if (!settingsQuery) return;
    document.title = `${settingsQuery.storeName} — ${settingsQuery.tagline}`;
  }, [settingsQuery]);

  const settings = useMemo<StoreSettings>(() => {
    if (!settingsQuery) return DEFAULT_SETTINGS;
    return {
      storeName: settingsQuery.storeName,
      tagline: settingsQuery.tagline,
      announcement: settingsQuery.announcement,
      whatsapp: settingsQuery.whatsapp,
      phoneDisplay: settingsQuery.phoneDisplay,
      email: settingsQuery.email,
      city: settingsQuery.city,
      paymentMethods: settingsQuery.paymentMethods,
      footerCredit: settingsQuery.footerCredit,
      footerCreditUrl: settingsQuery.footerCreditUrl,
    };
  }, [settingsQuery]);

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        cart,
        isLoading: productsQuery === undefined || settingsQuery === undefined,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return context;
}
