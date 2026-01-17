import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RouteLocationRaw } from 'vue-router';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(href: RouteLocationRaw): string {
    if (typeof href === 'string') {
        return href;
    }
    if (typeof href === 'object' && 'path' in href) {
        return href.path || '';
    }
    return '';
}
