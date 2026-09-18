import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-pill px-7 py-3.5 text-fluid-sm font-medium transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out-expo will-change-transform hover:-translate-y-0.5 active:translate-y-0";

const variants = {
  primary: cn(
    "bg-accent text-white",
    "shadow-[0_0_0_1px_rgb(78_20_255/0.5),0_10px_40px_-12px_rgb(78_20_255/0.8)]",
    "hover:bg-accent-bright hover:shadow-[0_0_0_1px_rgb(107_53_255/0.7),0_18px_55px_-10px_rgb(107_53_255/0.95)]",
  ),
  ghost: cn(
    "border border-white/15 bg-white/[0.03] text-chalk backdrop-blur-sm",
    "hover:border-white/30 hover:bg-white/[0.07]",
  ),
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
      <span
        aria-hidden
        className="inline-block transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
