import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/utils/shadcn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        ghostMerah:
          "bg-merah-primary focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        link: "text-primary underline-offset-4 hover:underline",
        login: "bg-[#122770]",
        delete: "bg-[#FFE9EF]",
        profile:
          "rounded-[5px] bg-[#0D2864] text-[#FAFAFA] transition duration-150 ease-linear hover:border-2 hover:border-[#0D2864] hover:bg-transparent hover:text-[#0D2864]",
        profileOutline: "border-2 border-input bg-transparent",
        primary:
          "rounded border-none bg-merah-primary p-2 text-white transition-all duration-500 ease-linear hover:border hover:border-black hover:bg-transparent hover:bg-merah-primary hover:bg-clip-text hover:text-transparent",
        third:
          "border border-black bg-transparent bg-merah-primary bg-clip-text text-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
