import { STATUS_MAP } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdStatus } from "@/shared/types";
import { FilterIcon } from "lucide-react";

interface StatusFilterProps {
  selectedStatuses: AdStatus[];
  onChange: (statuses: AdStatus[]) => void;
}

export function StatusFilter({
  selectedStatuses,
  onChange,
}: StatusFilterProps) {
  const availableStatuses: AdStatus[] = [
    "pending",
    "approved",
    "rejected",
    "draft",
  ];

  const handleCheckedChange = (status: AdStatus, checked: boolean) => {
    if (checked) {
      onChange([...selectedStatuses, status]);
    } else {
      onChange(selectedStatuses.filter((s) => s !== status));
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-muted-foreground text-xs font-medium">
        Статус
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between hover:cursor-pointer"
          >
            <div className="flex min-w-0 items-center gap-2">
              <FilterIcon className="h-4 w-4 shrink-0" />
              {selectedStatuses.length > 0 ? (
                <span className="truncate">
                  {selectedStatuses.length === 1
                    ? STATUS_MAP[selectedStatuses[0]]
                    : `${selectedStatuses.length} выбрано`}
                </span>
              ) : (
                <span className="text-muted-foreground">Все статусы</span>
              )}
            </div>
            {selectedStatuses.length > 0 && (
              <span className="bg-primary/10 text-primary ml-2 rounded-full px-1.5 py-0.5 text-xs font-medium">
                {selectedStatuses.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <div className="flex items-center justify-between px-2 py-1.5">
            <DropdownMenuLabel className="text-sm font-medium">
              Фильтр по статусу
            </DropdownMenuLabel>
          </div>
          <DropdownMenuSeparator />
          {availableStatuses.map((status) => (
            <DropdownMenuCheckboxItem
              className="hover:cursor-pointer"
              key={status}
              checked={selectedStatuses.includes(status)}
              onCheckedChange={(checked) =>
                handleCheckedChange(status, checked)
              }
            >
              <span className="font-medium">{STATUS_MAP[status]}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

