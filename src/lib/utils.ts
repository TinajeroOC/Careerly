import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function ny(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomNumbers(): string {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('')
}
