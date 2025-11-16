export function CustomBarChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-popover text-popover-foreground rounded-md border p-2 shadow">
      <div className="font-semibold">{label}</div>
      <div>Кол-во: {payload[0].value}</div>
    </div>
  );
}

