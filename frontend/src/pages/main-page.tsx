import { getAds } from "@/api/ads-api";
import { ItemCard } from "@/components/item-card";
import {
  CategoryFilter,
  PriceRangeFilter,
  StatusFilter,
} from "@/components/item-filters";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdStatus } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const categories = [
  { id: 0, name: "Электроника" },
  { id: 1, name: "Недвижимость" },
  { id: 2, name: "Транспорт" },
  { id: 3, name: "Работа" },
  { id: 4, name: "Услуги" },
  { id: 5, name: "Животные" },
  { id: 6, name: "Мода" },
  { id: 7, name: "Детское" },
];

export function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [selectedStatuses, setSelectedStatuses] = useState<AdStatus[]>(
    () => (searchParams.get("status")?.split(",") as AdStatus[]) || [],
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(() =>
    searchParams.get("category")
      ? Number(searchParams.get("category"))
      : undefined,
  );
  const [minPrice, setMinPrice] = useState<number | undefined>(() =>
    searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
  );
  const [maxPrice, setMaxPrice] = useState<number | undefined>(() =>
    searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
  );

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (selectedStatuses.length > 0)
      params.set("status", selectedStatuses.join(","));
    if (selectedCategoryId !== undefined)
      params.set("category", String(selectedCategoryId));
    if (minPrice !== undefined) params.set("minPrice", String(minPrice));
    if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));

    setSearchParams(params, { replace: true });
  }, [
    search,
    selectedStatuses,
    selectedCategoryId,
    minPrice,
    maxPrice,
    setSearchParams,
  ]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleReset = useCallback(() => {
    setSearch("");
    setSelectedStatuses([]);
    setSelectedCategoryId(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const { data, error, isLoading } = useQuery({
    queryKey: [
      "ads",
      { search, selectedStatuses, selectedCategoryId, minPrice, maxPrice },
    ],
    queryFn: () =>
      getAds({
        search,
        status: selectedStatuses,
        categoryId: selectedCategoryId,
        minPrice,
        maxPrice,
      }),
  });

  const hasActiveFilters =
    search ||
    selectedStatuses.length > 0 ||
    selectedCategoryId !== undefined ||
    minPrice !== undefined ||
    maxPrice !== undefined;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Главная страница</h1>

      <div className="bg-card flex flex-wrap items-end gap-4 rounded-lg border p-4">
        <div className="min-w-[250px] flex-1">
          <SearchBar
            name="item-search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Поиск по названию..."
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="w-48">
            <StatusFilter
              selectedStatuses={selectedStatuses}
              onChange={setSelectedStatuses}
            />
          </div>

          <div className="w-48">
            <CategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onChange={setSelectedCategoryId}
            />
          </div>

          <div className="w-56">
            <PriceRangeFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinChange={setMinPrice}
              onMaxChange={setMaxPrice}
            />
          </div>
        </div>

        <Button
          disabled={!hasActiveFilters}
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="ml-auto h-9 hover:cursor-pointer"
        >
          <XIcon className="mr-2 h-4 w-4" />
          Сбросить
        </Button>
      </div>

      {data && (
        <p className="text-muted-foreground text-sm">
          Найдено объявлений: {data.pagination.totalItems}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[600px] w-full rounded-2xl sm:h-[250px]"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-destructive py-8 text-center font-bold">
            Ошибка загрузки данных
          </div>
        ) : (
          data?.ads.map((item) => <ItemCard key={item.id} {...item} />)
        )}
      </div>
    </div>
  );
}
