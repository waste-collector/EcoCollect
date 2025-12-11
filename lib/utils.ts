import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function toFixed(floatOrString: any, fractionDigits?: number) {
    return Number.parseFloat(floatOrString as string).toFixed(fractionDigits)
}
