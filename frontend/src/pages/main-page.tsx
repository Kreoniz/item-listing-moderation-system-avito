import { getAds } from "@/api/ads-api";
import { ItemCard } from "@/components/item-card";
import {
  CategoryFilter,
  PriceRangeFilter,
  StatusFilter,
} from "@/components/item-filters";
import { SortFilter } from "@/components/item-sortings";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getPaginationItems } from "@/lib/pagination";
import type { AdStatus, SortByField, SortOrder } from "@/shared/types";
import { CATEGORIES, PAGE_LIMIT } from "@/shared/types/consts";
import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useCallback, useEffect, useEffectEvent, useState } from "react";
import { useSearchParams } from "react-router";

export function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

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
  const [sortBy, setSortBy] = useState<SortByField>(
    (): SortByField =>
      (searchParams.get("sortBy") as typeof sortBy) || "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (): SortOrder =>
      (searchParams.get("sortOrder") as typeof sortOrder) || "desc",
  );

  function handleSortChange(
    newSortBy: typeof sortBy,
    newSortOrder: typeof sortOrder,
  ) {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  }

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (selectedStatuses.length > 0)
      params.set("status", selectedStatuses.join(","));
    if (selectedCategoryId !== undefined)
      params.set("category", String(selectedCategoryId));
    if (minPrice !== undefined) params.set("minPrice", String(minPrice));
    if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));

    if (sortBy !== "createdAt") params.set("sortBy", sortBy);
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);

    setSearchParams(params, { replace: true });
  }, [
    search,
    selectedStatuses,
    selectedCategoryId,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    setSearchParams,
  ]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleReset = () => {
    setSearch("");
    setSelectedStatuses([]);
    setSelectedCategoryId(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSortBy("createdAt");
    setSortOrder("desc");
    setSearchParams({}, { replace: true });
  };

  const { data, error, isLoading } = useQuery({
    queryKey: [
      "ads",
      {
        search,
        selectedStatuses,
        selectedCategoryId,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        page,
        limit: PAGE_LIMIT,
      },
    ],
    queryFn: () =>
      getAds({
        search,
        status: selectedStatuses,
        categoryId: selectedCategoryId,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        page,
        limit: PAGE_LIMIT,
      }),
  });
  const pagination = data?.pagination;
  const ads = data?.ads;

  const resetPage = useEffectEvent(() => {
    setPage(1);
  });

  useEffect(() => {
    resetPage();
  }, [data]);

  const hasActiveFilters =
    search ||
    selectedStatuses.length > 0 ||
    selectedCategoryId !== undefined ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

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
              categories={CATEGORIES}
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

          <SortFilter
            sortBy={sortBy}
            sortOrder={sortOrder}
            onChange={handleSortChange}
          />
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
          Найдено объявлений: {pagination?.totalItems}
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
          ads?.map((item) => <ItemCard key={item.id} {...item} />)
        )}
      </div>

      {ads && ads?.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="hover:cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>

            {getPaginationItems(page, pagination?.totalPages || 1).map(
              (item, idx) => {
                if (item === "left-ellipsis" || item === "right-ellipsis") {
                  return (
                    <PaginationItem key={idx}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={item}>
                    <PaginationLink
                      className="hover:cursor-pointer"
                      isActive={item === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(Number(item));
                      }}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                );
              },
            )}

            <PaginationItem>
              <PaginationNext
                className="hover:cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if (!pagination?.totalPages) return;
                  if (page < pagination?.totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
