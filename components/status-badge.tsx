import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "empty" | "partial" | "full"
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const statusMap = {
    empty: {
      label: label || "Empty",
      color: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-600",
    },
    partial: {
      label: label || "Partial",
      color: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-600",
    },
    full: {
      label: label || "Full",
      color: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-600",
    },
  }

  const config = statusMap[status]

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
        config.color,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
