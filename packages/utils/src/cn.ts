import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS class names with proper precedence.
 *
 * @example
 * cn('px-2 py-1', condition && 'px-4') // → 'py-1 px-4' if condition true
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
