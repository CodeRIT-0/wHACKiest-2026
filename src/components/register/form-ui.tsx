import type { ReactNode } from "react";

// Inputs and labels shared by the registration and PPT submission forms.

export const fieldId = (key: string) => `reg-${key.replace(/\./g, "-")}`;

export const inputClass =
  "block w-full rounded-none border-2 border-ink bg-bg px-3.5 py-3 text-base text-ink outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-muted/60 focus:shadow-[4px_4px_0_var(--trace)] aria-[invalid=true]:border-[#b42318] aria-[invalid=true]:focus:shadow-[4px_4px_0_#b42318]";

export function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
        <span>{label}</span>
        {hint && <span className="font-sans text-xs normal-case tracking-normal text-muted">{hint}</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  );
}
