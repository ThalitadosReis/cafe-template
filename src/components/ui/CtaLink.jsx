import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";

const BASE_CLASS =
  "inline-flex items-center gap-3 px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase font-ui rounded-full transition-colors duration-300 group";

const VARIANT_CLASS = {
  dark: "bg-taupe-900 text-taupe-100 hover:bg-taupe-500",
  accent: "bg-taupe-500 text-white hover:bg-taupe-600",
  outline:
    "border border-taupe-400 text-taupe-700 hover:bg-taupe-500 hover:text-white",
};

export default function CtaLink({
  to,
  children,
  variant = "dark",
  className = "",
  iconSize = 14,
  showIcon = true,
}) {
  return (
    <Link
      to={to}
      className={`${BASE_CLASS} ${!showIcon ? "gap-0" : ""} ${VARIANT_CLASS[variant]} ${className}`}
    >
      {children}
      {showIcon && (
        <ArrowRightIcon
          size={iconSize}
          className="group-hover:translate-x-1 transition-transform duration-300"
        />
      )}
    </Link>
  );
}
