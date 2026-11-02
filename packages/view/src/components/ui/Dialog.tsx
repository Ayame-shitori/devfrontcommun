import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  isLocked?: boolean;
}

export function Dialog({ isOpen, onClose, title, icon, children, isLocked }: DialogProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLocked) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, isLocked, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={() => !isLocked && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLocked}
            className="rounded p-1 text-zinc-400 hover:text-zinc-600 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}