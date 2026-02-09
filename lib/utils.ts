import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function serializeEntity<T>(data: T): T {

  if (data === null || data === undefined) return data;

  

  // Быстрая глубокая копия через JSON для простых случаев

  // Но мы добавим ручную обработку для гарантии

  return JSON.parse(JSON.stringify(data, (key, value) => {

    // Обработка BigInt

    if (typeof value === 'bigint') return value.toString();

    

    // Если это объект Decimal (от Prisma или Decimal.js)

    if (value && typeof value === 'object' && (value.d || value.constructor?.name === 'Decimal')) {

      return Number(value);

    }

    

    return value;

  }));

}


