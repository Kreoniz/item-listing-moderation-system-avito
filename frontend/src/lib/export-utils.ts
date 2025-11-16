import type {
  ActivityData,
  CategoriesChartData,
  DecisionsData,
  StatsSummary,
} from "@/shared/types";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

export function exportToCSV(
  summary: StatsSummary,
  activity: ActivityData[],
  decisions: DecisionsData,
  categories: CategoriesChartData,
  period: string,
) {
  const rows: string[][] = [];

  rows.push(["Отчёт по статистике модерации"]);
  rows.push([`Период: ${period}`]);
  rows.push([
    `Дата создания: ${format(new Date(), "dd.MM.yyyy HH:mm", { locale: ru })}`,
  ]);
  rows.push([]);

  rows.push(["Общая статистика"]);
  rows.push(["Показатель", "Значение"]);
  rows.push(["Проверено объявлений", String(summary.totalReviewed)]);
  rows.push([
    "Процент одобренных",
    `${Math.round(summary.approvedPercentage * 10) / 10}%`,
  ]);
  rows.push([
    "Процент отклонённых",
    `${Math.round(summary.rejectedPercentage * 10) / 10}%`,
  ]);
  rows.push([
    "Процент на доработку",
    `${Math.round(summary.requestChangesPercentage * 10) / 10}%`,
  ]);
  rows.push([
    "Среднее время проверки (сек)",
    String(Math.round(summary.averageReviewTime)),
  ]);
  rows.push([]);

  rows.push(["Активность по дням"]);
  rows.push(["Дата", "Одобрено", "Отклонено", "На доработку"]);
  activity.forEach((item) => {
    rows.push([
      format(parseISO(item.date), "dd.MM.yyyy", { locale: ru }),
      String(item.approved),
      String(item.rejected),
      String(item.requestChanges),
    ]);
  });
  rows.push([]);

  rows.push(["Распределение решений"]);
  rows.push(["Тип решения", "Количество", "Процент"]);
  const totalDecisions =
    decisions.approved + decisions.rejected + decisions.requestChanges;
  rows.push([
    "Одобрено",
    String(decisions.approved),
    totalDecisions > 0
      ? `${Math.round((decisions.approved / totalDecisions) * 1000) / 10}%`
      : "0%",
  ]);
  rows.push([
    "Отклонено",
    String(decisions.rejected),
    totalDecisions > 0
      ? `${Math.round((decisions.rejected / totalDecisions) * 1000) / 10}%`
      : "0%",
  ]);
  rows.push([
    "На доработку",
    String(decisions.requestChanges),
    totalDecisions > 0
      ? `${Math.round((decisions.requestChanges / totalDecisions) * 1000) / 10}%`
      : "0%",
  ]);
  rows.push([]);

  rows.push(["Топ категорий по проверке"]);
  rows.push(["Категория", "Количество"]);
  Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .forEach(([name, value]) => {
      rows.push([name, String(value)]);
    });

  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const cellStr = String(cell);
          if (
            cellStr.includes(",") ||
            cellStr.includes('"') ||
            cellStr.includes("\n")
          ) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        })
        .join(","),
    )
    .join("\n");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `статистика_модерации_${format(new Date(), "yyyy-MM-dd", { locale: ru })}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
