import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
  badge?: React.ReactNode;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
  };
}

export function StatCard({
  title,
  value,
  icon,
  loading,
  badge,
  trend,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <div className="mt-2 flex items-center justify-between">
              {trend && (
                <p className="text-muted-foreground text-xs">
                  {trend.direction === "up"
                    ? "↑"
                    : trend.direction === "down"
                      ? "↓"
                      : "→"}{" "}
                  {trend.value}
                </p>
              )}
              {badge}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

