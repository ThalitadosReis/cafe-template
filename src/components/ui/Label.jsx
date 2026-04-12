export default function Label({
  label,
  title,
  body,
  body2,
  tone = "dark",
  center = false,
  titleSize = "lg",
  showDivider = false,
  as: Tag = "h2",
  className = "",
  labelClassName = "",
  titleClassName = "",
  bodyClassName = "",
  body2ClassName = "",
}) {
  const align = center ? "text-center" : "";

  const sizeMap = {
    sm: "text-3xl sm:text-4xl lg:text-5xl",
    lg: "text-4xl sm:text-5xl lg:text-6xl",
    xl: "text-5xl sm:text-6xl lg:text-7xl",
    hero: "text-4xl sm:text-5xl lg:text-6xl",
  };

  const toneMap = {
    dark: {
      label: "text-taupe-500",
      title: "text-taupe-900",
      body: "text-taupe-600",
      dividerLine: "bg-taupe-300",
    },
    light: {
      label: "text-taupe-400",
      title: "text-taupe-100",
      body: "text-taupe-300",
      dividerLine: "bg-taupe-500",
    },
  };

  const colors = toneMap[tone] ?? toneMap.dark;

  return (
    <div className={`${align} ${className}`.trim()}>
      {label && (
        <p
          className={`mb-4 font-body text-[10px] font-medium uppercase tracking-[0.35em] ${colors.label} ${labelClassName}`.trim()}
        >
          {label}
        </p>
      )}
      <Tag
        className={`mb-4 whitespace-pre-line font-display font-light leading-[1.08] ${sizeMap[titleSize] ?? sizeMap.lg} ${colors.title} ${titleClassName}`.trim()}
      >
        {title}
      </Tag>
      {showDivider && (
        <div
          className={`mb-6 flex items-center gap-3 ${center ? "justify-center" : ""}`}
        >
          <div className={`h-px w-12 ${colors.dividerLine}`} />
        </div>
      )}
      {body && (
        <p
          className={`font-body text-sm font-light leading-relaxed md:text-[15px] lg:text-base ${colors.body} ${center ? "mx-auto max-w-md" : ""} ${bodyClassName}`.trim()}
        >
          {body}
        </p>
      )}
      {body2 && (
        <p
          className={`mt-4 font-body text-sm font-light leading-relaxed md:text-[15px] lg:text-base ${colors.body} ${body2ClassName}`.trim()}
        >
          {body2}
        </p>
      )}
    </div>
  );
}
