export default function SectionTextBlock({
  label,
  title,
  body,
  body2,
  showDivider = false,
  labelClassName = "",
  titleClassName = "",
  bodyClassName = "",
  body2ClassName = "",
  dividerClassName = "",
}) {
  return (
    <>
      <p
        className={`mb-4 font-ui text-[10px] uppercase tracking-[0.4em] text-taupe-500 lg:text-xs ${labelClassName}`}
      >
        {label}
      </p>
      <h2
        className={`mb-6 whitespace-pre-line font-display text-5xl font-light leading-[1.1] text-taupe-900 lg:text-6xl ${titleClassName}`}
      >
        {title}
      </h2>
      {showDivider && (
        <div className={`mb-6 h-px w-12 bg-taupe-500 ${dividerClassName}`} />
      )}
      {body ? (
        <p
          className={`font-ui text-[15px] font-light leading-relaxed text-taupe-600 lg:text-base ${bodyClassName}`}
        >
          {body}
        </p>
      ) : null}
      {body2 ? (
        <p
          className={`mt-4 font-ui text-[15px] font-light leading-relaxed text-taupe-600 lg:text-base ${body2ClassName}`}
        >
          {body2}
        </p>
      ) : null}
    </>
  );
}
