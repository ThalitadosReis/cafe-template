export default function IconInputField({
  label,
  type = "text",
  value,
  onChange,
  Icon,
  required = false,
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-body text-[11px] font-medium uppercase tracking-[0.35em] text-taupe-600"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          size={14}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-500"
        />
        <input
          id={id}
          type={type}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-taupe-200 bg-transparent py-3 pl-10 pr-4 font-body text-sm text-taupe-900 transition-colors focus:border-taupe-500 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}
