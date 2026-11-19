"use client";

export function DeleteButton({
  label = "Delete",
  confirmMessage = "Are you sure?",
}: {
  label?: string;
  confirmMessage?: string;
}) {
  return (
    <button
      type="submit"
      className="text-sm text-rose-400 hover:underline"
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}