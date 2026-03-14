export default function IconInputField({
  label,
  type = "text",
  value,
  onChange,
  Icon,
  placeholder = "",
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block font-ui text-xs uppercase tracking-[0.2em] text-taupe-500">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={14}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-500"
        />
        <input
          type={type}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-taupe-300 bg-transparent py-3 pl-10 pr-4 font-ui text-sm text-taupe-900 transition-colors focus:border-taupe-500 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}
