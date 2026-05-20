import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Professional dermatology-inspired variants
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline:
          "border border-border bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm",
        ghost: "hover:bg-primary/10 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        // Medical/professional variants
        medical: "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:shadow-lg hover:scale-105 transform",
        soft: "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20",
        glass: "bg-glass/50 backdrop-blur-sm text-glass-foreground hover:bg-glass/70 border border-border/50",
        liquid: "relative rounded-full bg-white/20 text-foreground border border-white/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:bg-white/30 active:bg-white/40 active:scale-[0.99] before:absolute before:inset-0 before:pointer-events-none before:opacity-70 before:[background:radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.45),transparent_40%),_radial-gradient(circle_at_90%_20%,rgba(255,255,255,0.3),transparent_35%),_linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0))]",
        // iOS-inspired variants
        ios: "rounded-full bg-white text-black border border-gray-300 shadow-sm hover:bg-gray-50 active:bg-gray-100 hover:shadow-md active:shadow-sm",
        iosTint: "rounded-full bg-black text-white shadow-sm hover:bg-black/90 active:bg-black/80",
        iosOutline: "rounded-full bg-transparent text-black border border-gray-300 hover:bg-gray-50 active:bg-gray-100",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
