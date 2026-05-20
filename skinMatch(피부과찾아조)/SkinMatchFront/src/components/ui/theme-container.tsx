import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Container variants for consistent layout
const containerVariants = cva("mx-auto", {
  variants: {
    size: {
      sm: "max-w-2xl",
      md: "max-w-4xl", 
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-full",
      content: "max-w-5xl", // Default content width
    },
    padding: {
      none: "",
      sm: "px-4",
      md: "px-6", 
      lg: "px-8",
      xl: "px-12",
    },
  },
  defaultVariants: {
    size: "content",
    padding: "md",
  },
});

// Section variants for consistent vertical spacing
const sectionVariants = cva("", {
  variants: {
    spacing: {
      none: "",
      sm: "py-8",
      md: "py-16",
      lg: "py-24", 
      xl: "py-32",
      hero: "pt-18 pb-32", // Special spacing for hero sections
      default: "py-20", // Standard section spacing
    },
    background: {
      transparent: "",
      primary: "bg-primary/5",
      secondary: "bg-secondary/5",
      muted: "bg-muted",
      card: "bg-card",
      gradient: "bg-gradient-cream-flow",
    },
  },
  defaultVariants: {
    spacing: "default",
    background: "transparent",
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: keyof JSX.IntrinsicElements;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, ...props }, ref) => {
    return (
      <div
        className={cn(containerVariants({ size, padding, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, background, as = "section", ...props }, ref) => {
    return React.createElement(as, {
      className: cn(sectionVariants({ spacing, background, className })),
      ref,
      ...props,
    });
  }
);

Container.displayName = "Container";
Section.displayName = "Section";

export { Container, Section, containerVariants, sectionVariants };