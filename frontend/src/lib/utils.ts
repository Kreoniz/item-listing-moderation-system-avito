import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function num_word(value: number, words: string[]) {
  value = Math.abs(value) % 100;
  const num = value % 10;
  if (value > 10 && value < 20) return words[2];
  if (num > 1 && num < 5) return words[1];
  if (num == 1) return words[0];
  return words[2];
}

export function formatTimeString(time: string) {
  return new Date(time).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function getPaginationItems(current: number, total: number) {
  if (current < 1 || current > total || total < 1) {
    throw new Error("Invalid pagination parameters");
  }

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];

  if (current > 4) {
    pages.push("left-ellipsis");
  } else {
    if (total >= 2) pages.push(2);
    if (total >= 3) pages.push(3);
  }

  const leftBound = current <= 4 ? 4 : current - 1;
  const rightBound = current >= total - 3 ? total - 1 : current + 1;

  for (let i = leftBound; i <= rightBound; i++) {
    if (i > 1 && i < total) {
      pages.push(i);
    }
  }

  if (current < total - 3) {
    pages.push("right-ellipsis");
  } else {
    if (total - 2 > 1) pages.push(total - 2);
    if (total - 1 > 1) pages.push(total - 1);
  }

  if (total > 1) {
    pages.push(total);
  }

  return pages.filter((item, index) => pages.indexOf(item) === index);
}
