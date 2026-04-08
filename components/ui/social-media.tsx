import React from "react";
import { cn } from "@/app/lib/utils";

export interface SocialItem {
  href: string;
  ariaLabel: string;
  tooltip: string;
  color: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface SocialTooltipProps extends React.HTMLAttributes<HTMLUListElement> {
  items: SocialItem[];
}

const SocialTooltip = React.forwardRef<HTMLUListElement, SocialTooltipProps>(
  ({ className, items, ...props }, ref) => {
    const baseIconStyles =
      "relative flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/95 overflow-hidden transition-all duration-300 ease-in-out group-hover:-translate-y-0.5 group-hover:shadow-lg";
    const baseSvgStyles =
      "relative z-10 h-6 w-6 text-[#111] transition-colors duration-300 ease-in-out group-hover:text-white";
    const baseFilledStyles =
      "absolute bottom-0 left-0 h-0 w-full transition-all duration-300 ease-in-out group-hover:h-full";
    const baseTooltipStyles =
      "pointer-events-none absolute left-1/2 bottom-[-34px] -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium tracking-[0.08em] text-white opacity-0 invisible transition-all duration-300 ease-in-out group-hover:bottom-[-42px] group-hover:visible group-hover:opacity-100";

    return (
      <ul
        ref={ref}
        className={cn("flex items-center justify-center gap-3", className)}
        {...props}
      >
        {items.map((item, index) => (
          <li key={`${item.ariaLabel}-${index}`} className="group relative">
            <a
              href={item.href}
              aria-label={item.ariaLabel}
              className={cn(baseIconStyles)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={cn(baseFilledStyles)} style={{ backgroundColor: item.color }} />
              <item.Icon className={cn(baseSvgStyles)} />
            </a>
            <div className={cn(baseTooltipStyles)} style={{ backgroundColor: item.color }}>
              {item.tooltip}
            </div>
          </li>
        ))}
      </ul>
    );
  }
);

SocialTooltip.displayName = "SocialTooltip";

export { SocialTooltip };
