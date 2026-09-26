import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { Search } from "lucide-react";

const FIELD_CLASS =
  "w-full rounded-2xl border-2 border-edge bg-surface px-4 text-base font-semibold text-ink placeholder:font-normal placeholder:text-mute focus:border-accent focus:outline-none disabled:opacity-60";

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.15em] text-mute">
          {hint}
        </span>
      )}
    </label>
  );
}

export function TextField({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`h-14 ${FIELD_CLASS} ${className}`} {...props} />;
}

export function TextAreaField({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={`${FIELD_CLASS} py-3.5 ${className}`} {...props} />
  );
}

export function SelectField({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`h-14 ${FIELD_CLASS} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function IconField({
  label,
  icon,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
}) {
  return (
    <Field label={label}>
      <span className="relative block">
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute">
          {icon}
        </span>
        <input
          className={`h-14 w-full rounded-2xl border-2 border-edge bg-surface pr-4 pl-12 text-base font-semibold text-ink placeholder:font-normal placeholder:text-mute focus:border-accent focus:outline-none ${className}`}
          {...props}
        />
      </span>
    </Field>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Cari…",
  onEnter,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onEnter?: () => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={22}
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onEnter?.();
          }
        }}
        placeholder={placeholder}
        className="h-16 w-full rounded-2xl border-2 border-edge bg-surface pr-4 pl-12 text-lg font-semibold text-ink placeholder:font-normal placeholder:text-mute focus:border-accent focus:outline-none"
      />
    </div>
  );
}
