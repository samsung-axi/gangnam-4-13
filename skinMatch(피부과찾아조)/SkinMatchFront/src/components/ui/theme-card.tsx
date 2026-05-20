import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Professional card variants for medical/dermatology interface
const cardVariants = cva(
  "rounded-xl border transition-all duration-300",
  {
    variants: {
      variant: {
        // Standard card styles
        default: "bg-card text-card-foreground border-border shadow-sm hover:shadow-md",
        elevated: "bg-card text-card-foreground border-border shadow-lg hover:shadow-xl",
        outline: "bg-transparent border-border hover:bg-card/50",
        
        // Medical/professional themed cards
        medical: "bg-gradient-to-br from-card to-card/80 text-card-foreground border-primary/20 shadow-sm hover:shadow-lg hover:border-primary/30",
        glass: "bg-glass/30 backdrop-blur-sm text-glass-foreground border-border/50 shadow-sm hover:bg-glass/50",
        primary: "bg-primary/5 text-primary border-primary/20 hover:bg-primary/10",
        
        // Interactive cards
        interactive: "bg-card text-card-foreground border-border shadow-sm hover:shadow-lg hover:scale-[1.02] cursor-pointer",
        feature: "bg-gradient-cream-flow text-foreground border-border/50 shadow-md hover:shadow-lg",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      spacing: {
        none: "space-y-0",
        sm: "space-y-2",
        md: "space-y-4", 
        lg: "space-y-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      spacing: "md",
    },
  }
);

export interface ThemeCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const ThemeCard = React.forwardRef<HTMLDivElement, ThemeCardProps>(
  ({ className, variant, padding, spacing, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, spacing, className }))}
      {...props}
    />
  )
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    />
  )
);

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight text-foreground", className)}
      {...props}
    />
  )
);

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-4", className)}
      {...props}
    />
  )
);

ThemeCard.displayName = "ThemeCard";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export {
  ThemeCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
};