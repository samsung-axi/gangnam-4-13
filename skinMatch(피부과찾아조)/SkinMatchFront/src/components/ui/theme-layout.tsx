import * as React from "react";
import { cn } from "@/lib/utils";
import { Container, Section } from "./theme-container";
import { Typography } from "./theme-typography";

// Professional header component
interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
  fixed?: boolean;
  transparent?: boolean;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, children, fixed = false, transparent = false, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          "w-full border-b border-border/50 z-50 transition-all duration-300",
          fixed && "fixed top-0 left-0 right-0",
          transparent ? "bg-background/80 backdrop-blur-lg" : "bg-background",
          className
        )}
        {...props}
      >
        <Container size="xl" padding="md">
          <div className="flex h-16 items-center justify-between">
            {children}
          </div>
        </Container>
      </header>
    );
  }
);

// Professional navigation component
interface NavigationProps {
  className?: string;
  items?: Array<{
    label: string;
    href: string;
    type?: "primary" | "secondary";
  }>;
}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ className, items = [], ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn("flex items-center space-x-6", className)}
        {...props}
      >
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors duration-200 hover:text-primary",
              item.type === "primary" 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </a>
        ))}
      </nav>
    );
  }
);

// Professional footer component
interface FooterProps {
  className?: string;
  sections?: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, sections = [], ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn("bg-secondary/5 border-t border-border", className)}
        {...props}
      >
        <Section spacing="lg">
          <Container size="xl" padding="md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {sections.map((section) => (
                <div key={section.title} className="space-y-4">
                  <Typography variant="h4" className="text-foreground">
                    {section.title}
                  </Typography>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-border text-center">
              <Typography variant="bodySmall">
                © 2024 SkinMatch. All rights reserved.
              </Typography>
            </div>
          </Container>
        </Section>
      </footer>
    );
  }
);

// Hero section component
interface HeroProps {
  className?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  backgroundVariant?: "gradient" | "solid" | "glass";
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  ({ 
    className, 
    title, 
    subtitle, 
    children, 
    backgroundVariant = "gradient",
    ...props 
  }, ref) => {
    const backgroundClasses = {
      gradient: "bg-gradient-hero",
      solid: "bg-background",
      glass: "bg-gradient-glass",
    };

    return (
      <Section
        ref={ref}
        as="section"
        spacing="hero"
        className={cn(
          "relative overflow-hidden",
          backgroundClasses[backgroundVariant],
          className
        )}
        {...props}
      >
        <Container size="xl" padding="md">
          <div className="text-center space-y-6 relative z-10">
            {title && (
              <Typography variant="h1" className="max-w-4xl mx-auto">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="h2" className="max-w-2xl mx-auto">
                {subtitle}
              </Typography>
            )}
            {children}
          </div>
        </Container>
      </Section>
    );
  }
);

Header.displayName = "Header";
Navigation.displayName = "Navigation";
Footer.displayName = "Footer";
Hero.displayName = "Hero";

export { Header, Navigation, Footer, Hero };