export function getPaginationItems(current: number, total: number) {
  const pages: (number | string)[] = [];

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const showLeftEllipsis = current > 4;
  const showRightEllipsis = current < total - 3;

  pages.push(1);

  if (showLeftEllipsis) {
    pages.push("left-ellipsis");
  } else {
    pages.push(2, 3);
  }

  const middleStart = showLeftEllipsis ? Math.max(2, current - 1) : 4;
  const middleEnd = showRightEllipsis
    ? Math.min(total - 1, current + 1)
    : total - 3;

  for (let i = middleStart; i <= middleEnd; i++) {
    if (i > 1 && i < total) pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("right-ellipsis");
  } else {
    pages.push(total - 2, total - 1);
  }

  pages.push(total);

  return [...new Set(pages)];
}
