import { Link } from "react-router-dom";

const BASE_CLASS =
  "inline-flex items-center gap-2 px-6 py-3 text-[9px] tracking-[0.22em] uppercase font-body font-medium transition-all duration-300 md:px-8 md:py-3.5 md:text-[10px]";

const VARIANT_CLASS = {
  primary: "bg-taupe-900 text-taupe-100 hover:bg-taupe-700",
  secondary: "bg-taupe-300 text-taupe-900 hover:bg-taupe-400",
  outline:
    "border border-taupe-400 text-taupe-600 hover:border-taupe-900 hover:text-taupe-900",
};

export default function CtaLink({
  to,
  children,
  variant = "primary",
  className = "",
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${BASE_CLASS} ${VARIANT_CLASS[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
