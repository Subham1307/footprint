import { cn } from "@/lib/utils";
import { toDateInputValue } from "@/lib/dates";

export function Field({
  label,
  name,
  children,
  hint,
  className,
}: {
  label: string;
  name?: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("block min-w-0 space-y-1.5", className)}>
      <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
      {children}
      {hint ? <span className="text-xs text-[var(--text-muted)]">{hint}</span> : null}
      {name ? <span className="sr-only">{name}</span> : null}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-violet)]",
        props.className,
      )}
    />
  );
}

/** Full day/month/year — avoids cramped grids clipping the native day segment. */
export function DateInput({
  defaultValue,
  value,
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "defaultValue" | "value"> & {
  defaultValue?: unknown;
  value?: unknown;
}) {
  const normalizedDefault =
    defaultValue !== undefined ? toDateInputValue(defaultValue) : undefined;
  const normalizedValue = value !== undefined ? toDateInputValue(value) : undefined;

  return (
    <input
      {...props}
      type="date"
      defaultValue={normalizedDefault}
      value={normalizedValue}
      className={cn("date-input", className)}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-violet)]",
        props.className,
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-violet)]",
        props.className,
      )}
    />
  );
}

export function CheckRow({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="rounded" />
      {label}
    </label>
  );
}

export function FormCard({
  action,
  children,
  title,
}: {
  action: (formData: FormData) => void | Promise<void>;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <form action={action} className="surface-card space-y-5 p-5 md:p-6">
      {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
      {children}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          className="rounded-full bg-[var(--accent-violet)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Save
        </button>
      </div>
    </form>
  );
}