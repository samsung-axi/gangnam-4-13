import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Typography variants based on professional design system
const typographyVariants = cva("", {
  variants: {
    variant: {
      // Headings - Professional hierarchy
      h1: "text-4xl font-semibold leading-tight text-foreground tracking-tight md:text-5xl lg:text-6xl",
      h2: "text-lg font-medium leading-normal text-muted-foreground md:text-xl",
      h3: "text-lg font-medium leading-normal text-foreground md:text-xl",
      h4: "text-sm font-medium leading-relaxed text-accent-foreground",
      
      // Body text variants
      body: "text-base leading-normal text-foreground font-normal",
      bodyLarge: "text-lg leading-relaxed text-foreground font-normal",
      bodySmall: "text-sm leading-normal text-muted-foreground font-normal",
      
      // Special text variants
      caption: "text-xs leading-normal text-muted-foreground font-normal",
      label: "text-sm font-medium leading-normal text-foreground",
      subtitle: "text-base leading-relaxed text-muted-foreground font-normal",
      
      // Accent text
      accent: "text-base leading-normal text-primary font-medium",
      gradient: "text-base leading-normal bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent font-medium",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm", 
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium", 
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: keyof JSX.IntrinsicElements;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, size, weight, align, as, ...props }, ref) => {
    // Default element mapping based on variant
    const elementMap = {
      h1: "h1",
      h2: "h2", 
      h3: "h3",
      h4: "h4",
      body: "p",
      bodyLarge: "p",
      bodySmall: "p",
      caption: "span",
      label: "label",
      subtitle: "p",
      accent: "span",
      gradient: "span",
    } as const;

    const Component = as || (variant && elementMap[variant]) || "p";

    return React.createElement(Component, {
      className: cn(typographyVariants({ variant, size, weight, align, className })),
      ref,
      ...props,
    });
  }
);

Typography.displayName = "Typography";

export { Typography, typographyVariants };