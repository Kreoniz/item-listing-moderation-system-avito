import {
  getActivityChart,
  getCategoriesChart,
  getDecisionsChart,
  getStatsSummary,
} from "@/api/stats-api";
import { CustomBarChartTooltip, StatCard } from "@/components/stats";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { ActivityData, DecisionsData } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Period = "today" | "week" | "month";

const COLORS = {
  approved: "#10b981",
  rejected: "#ef4444",
  requestChanges: "#f59e0b",
  primary: "#0ea5e9",
};

export function StatsPage() {
  const [period, setPeriod] = useState<Period>("week");

  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["stats", "summary", period],
    queryFn: ({ signal }) => getStatsSummary({ period }, signal),
  });

  const {
    data: activity,
    isLoading: activityLoading,
    error: activityError,
  } = useQuery({
    queryKey: ["stats", "activity", period],
    queryFn: ({ signal }) => getActivityChart({ period }, signal),
  });

  const {
    data: decisions,
    isLoading: decisionsLoading,
    error: decisionsError,
  } = useQuery({
    queryKey: ["stats", "decisions", period],
    queryFn: ({ signal }) => getDecisionsChart({ period }, signal),
  });

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["stats", "categories", period],
    queryFn: ({ signal }) => getCategoriesChart({ period }, signal),
  });

  const error =
    summaryError || activityError || decisionsError || categoriesError;

  const getPeriodLabel = (p: Period) => {
    const labels: Record<Period, string> = {
      today: "Сегодня",
      week: "За 7 дней",
      month: "За 30 дней",
    };
    return labels[p];
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}c`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}м`;
    return `${Math.floor(seconds / 3600)}ч ${Math.floor((seconds % 3600) / 60)}м`;
  };

  const prepareActivityData = (data?: ActivityData[]) => {
    if (!data) return [];

    return data.map((item) => ({
      date: format(parseISO(item.date), "dd MMM", { locale: ru }),
      approved: item.approved,
      rejected: item.rejected,
      requestChanges: item.requestChanges,
    }));
  };

  const prepareDecisionsData = (data?: DecisionsData) => {
    if (!data) return [];
    return [
      { name: "Одобрено", value: data.approved, key: "approved" },
      { name: "Отклонено", value: data.rejected, key: "rejected" },
      {
        name: "На доработку",
        value: data.requestChanges,
        key: "requestChanges",
      },
    ];
  };

  const prepareCategoriesData = (data?: Record<string, number>) => {
    if (!data) return [];
    const newData = Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({ name, value }));
    console.log(newData);
    return newData;
  };

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Статистика модератора</h1>
          <p className="text-muted-foreground mt-1">
            Анализ вашей активности и эффективности модерации
          </p>
        </div>

        <Select
          value={period}
          onValueChange={(value: Period) => setPeriod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Выберите период" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Сегодня</SelectItem>
            <SelectItem value="week">Последние 7 дней</SelectItem>
            <SelectItem value="month">Последние 30 дней</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ошибка загрузки данных. Попробуйте обновить страницу.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Проверено объявлений"
          value={summary?.totalReviewed ?? 0}
          icon={<Package className="h-6 w-6 text-blue-500" />}
          loading={summaryLoading}
          badge={
            <Badge variant="outline" className="text-xs">
              {getPeriodLabel(period)}
            </Badge>
          }
        />

        <StatCard
          title="Одобрено"
          value={`${Math.round((summary?.approvedPercentage ?? 0) * 10) / 10}%`}
          icon={<CheckCircle className="h-6 w-6 text-emerald-500" />}
          loading={summaryLoading}
          trend={{ direction: "up", value: "Эффективность" }}
        />

        <StatCard
          title="Отклонено"
          value={`${(Math.round(summary?.rejectedPercentage ?? 0) * 10) / 10}%`}
          icon={<XCircle className="h-6 w-6 text-red-500" />}
          loading={summaryLoading}
          trend={{ direction: "neutral", value: "Качество" }}
        />

        <StatCard
          title="Среднее время проверки"
          value={formatTime(summary?.averageReviewTime ?? 0)}
          icon={<Clock className="h-6 w-6 text-amber-500" />}
          loading={summaryLoading}
          trend={{ direction: "down", value: "Скорость" }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Активность по дням
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {activityLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareActivityData(activity)}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      background: "var(--color-background)",
                    }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Bar
                    dataKey="approved"
                    fill={COLORS.approved}
                    name="Одобрено"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="rejected"
                    fill={COLORS.rejected}
                    name="Отклонено"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="requestChanges"
                    fill={COLORS.requestChanges}
                    name="На доработку"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Распределение решений</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {decisionsLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareDecisionsData(decisions)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                  >
                    {prepareDecisionsData(decisions).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.key as keyof typeof COLORS]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${Math.round(value * 10) / 10}%`,
                      name,
                    ]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Топ категорий по проверке</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            {categoriesLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareCategoriesData(categories)}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    width={120}
                  />
                  <Tooltip
                    content={(props) => <CustomBarChartTooltip {...props} />}
                  />
                  <Bar
                    dataKey="value"
                    fill={COLORS.primary}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
