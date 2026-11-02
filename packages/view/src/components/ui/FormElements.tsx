import React, { type InputHTMLAttributes, type SelectHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

// --- BOUTON UNIFIÉ ---
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-sky-950 text-white hover:bg-sky-900",
    secondary: "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading || disabled} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

// --- CHAMP DE TEXTE UNIFIÉ ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function FormInput({ label, required, id, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-zinc-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        required={required}
        className={`w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-sky-950 focus:outline-none focus:ring-1 focus:ring-sky-950 ${className}`}
        {...props}
      />
    </div>
  );
}

// --- SELECT UNIFIÉ ---
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function FormSelect({ label, id, children, className = "", ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-zinc-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-sky-950 focus:outline-none focus:ring-1 focus:ring-sky-950 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}