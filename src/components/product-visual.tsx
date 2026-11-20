import type { ReactNode } from "react";
import type { Product } from "@/data/store";
import { ProductPlate } from "@/components/garment-plate";
import { cn } from "@/lib/utils";

export function ProductVisual({
  product,
  className,
  imageClassName,
  plateClassName,
  framed = false,
  children,
  eager = false,
}: {
  product: Product;
  className?: string;
  imageClassName?: string;
  plateClassName?: string;
  framed?: boolean;
  children?: ReactNode;
  eager?: boolean;
}) {
  if (product.imageUrl) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-stage",
          !framed && "plate-frame",
          className,
        )}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading={eager ? "eager" : "lazy"}
          className={cn("h-full w-full object-cover", imageClassName)}
        />
        {children}
      </div>
    );
  }

  return (
    <ProductPlate
      kind={product.kind}
      tone={product.tone}
      className={className}
      plateClassName={plateClassName}
      framed={framed}
    >
      {children}
    </ProductPlate>
  );
}
