import { approveAd, getAds, rejectAd, requestChangesAd } from "@/api/ads-api";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getPaginationItems } from "@/lib/utils";
import type { AdStatus, SortByField, SortOrder } from "@/shared/types";
import { CATEGORIES, PAGE_LIMIT } from "@/shared/types/consts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useSearchParams } from "react-router";

export function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [selectedAds, setSelectedAds] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [showBulkRejectDialog, setShowBulkRejectDialog] = useState(false);
  const [showBulkReviseDialog, setShowBulkReviseDialog] = useState(false);
  const [bulkRejectTemplate, setBulkRejectTemplate] = useState("");
  const [bulkRejectComment, setBulkRejectComment] = useState("");
  const [bulkReviseTemplate, setBulkReviseTemplate] = useState("");
  const [bulkReviseComment, setBulkReviseComment] = useState("");
  const bulkRejectInputRef = useRef<HTMLInputElement>(null);
  const bulkReviseInputRef = useRef<HTMLInputElement>(null);

  const rejectionTemplates = [
    "Запрещенный товар",
    "Неверная категория",
    "Некорректное описание",
    "Проблемы с фото",
    "Подозрение на мошенничество",
    "Другое",
  ];

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

  const [previousPendingAds, setPreviousPendingAds] = useState<Set<string>>(
    new Set(),
  );
  const [newAdsCount, setNewAdsCount] = useState<number>(0);

  const { data, error, isLoading, isFetching } = useQuery({
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
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
  });

  const pagination = data?.pagination;
  const ads = data?.ads;

  useEffect(() => {
    if (ads) {
      const currentPendingAds = new Set(
        ads.filter((ad) => ad.status === "pending").map((ad) => String(ad.id)),
      );

      if (previousPendingAds.size > 0) {
        const newAds = Array.from(currentPendingAds).filter(
          (id) => !previousPendingAds.has(id),
        );
        if (newAds.length > 0) {
          setNewAdsCount(newAds.length);
          setTimeout(() => setNewAdsCount(0), 5000);
        }
      }

      setPreviousPendingAds(currentPendingAds);
    }
  }, [ads]);

  useHotkeys("slash", (e) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  });

  const toggleSelectAd = (adId: string) => {
    setSelectedAds((prev) => {
      const next = new Set(prev);
      if (next.has(adId)) {
        next.delete(adId);
      } else {
        next.add(adId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedAds.size === ads?.length) {
      setSelectedAds(new Set());
    } else {
      setSelectedAds(new Set(ads?.map((ad) => String(ad.id)) || []));
    }
  };

  const bulkApproveMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => approveAd(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      setSelectedAds(new Set());
    },
  });

  const bulkRejectMutation = useMutation({
    mutationFn: async ({
      ids,
      reason,
      comment,
    }: {
      ids: string[];
      reason: string;
      comment?: string;
    }) => {
      await Promise.all(ids.map((id) => rejectAd(id, { reason, comment })));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      setSelectedAds(new Set());
      setShowBulkRejectDialog(false);
      setBulkRejectTemplate("");
      setBulkRejectComment("");
    },
  });

  const bulkReviseMutation = useMutation({
    mutationFn: async ({
      ids,
      reason,
      comment,
    }: {
      ids: string[];
      reason: string;
      comment?: string;
    }) => {
      await Promise.all(
        ids.map((id) => requestChangesAd(id, { reason, comment })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      setSelectedAds(new Set());
      setShowBulkReviseDialog(false);
      setBulkReviseTemplate("");
      setBulkReviseComment("");
    },
  });

  const handleBulkApprove = () => {
    if (selectedAds.size > 0) {
      bulkApproveMutation.mutate(Array.from(selectedAds));
    }
  };

  const handleBulkReject = () => {
    if (selectedAds.size > 0 && bulkRejectTemplate) {
      bulkRejectMutation.mutate({
        ids: Array.from(selectedAds),
        reason: bulkRejectTemplate,
        comment:
          bulkRejectTemplate === "Другое" ? bulkRejectComment : undefined,
      });
    }
  };

  const handleBulkRevise = () => {
    if (selectedAds.size > 0 && bulkReviseTemplate) {
      bulkReviseMutation.mutate({
        ids: Array.from(selectedAds),
        reason: bulkReviseTemplate,
        comment:
          bulkReviseTemplate === "Другое" ? bulkReviseComment : undefined,
      });
    }
  };

  useEffect(() => {
    if (bulkRejectTemplate === "Другое" && bulkRejectInputRef.current) {
      bulkRejectInputRef.current.focus();
    }
  }, [bulkRejectTemplate]);

  useEffect(() => {
    if (bulkReviseTemplate === "Другое" && bulkReviseInputRef.current) {
      bulkReviseInputRef.current.focus();
    }
  }, [bulkReviseTemplate]);

  useHotkeys("1", () => setBulkRejectTemplate(rejectionTemplates[0]), {
    enabled: showBulkRejectDialog,
  });
  useHotkeys("2", () => setBulkRejectTemplate(rejectionTemplates[1]), {
    enabled: showBulkRejectDialog,
  });
  useHotkeys("3", () => setBulkRejectTemplate(rejectionTemplates[2]), {
    enabled: showBulkRejectDialog,
  });
  useHotkeys("4", () => setBulkRejectTemplate(rejectionTemplates[3]), {
    enabled: showBulkRejectDialog,
  });
  useHotkeys("5", () => setBulkRejectTemplate(rejectionTemplates[4]), {
    enabled: showBulkRejectDialog,
  });
  useHotkeys(
    "6",
    (e) => {
      e.preventDefault();
      setBulkRejectTemplate(rejectionTemplates[5]);
    },
    {
      enabled: showBulkRejectDialog,
    },
  );
  useHotkeys(
    "enter",
    (e) => {
      if (bulkRejectTemplate) {
        e.preventDefault();
        handleBulkReject();
      }
    },
    {
      enabled: showBulkRejectDialog && !!bulkRejectTemplate,
    },
  );

  useHotkeys("1", () => setBulkReviseTemplate(rejectionTemplates[0]), {
    enabled: showBulkReviseDialog,
  });
  useHotkeys("2", () => setBulkReviseTemplate(rejectionTemplates[1]), {
    enabled: showBulkReviseDialog,
  });
  useHotkeys("3", () => setBulkReviseTemplate(rejectionTemplates[2]), {
    enabled: showBulkReviseDialog,
  });
  useHotkeys("4", () => setBulkReviseTemplate(rejectionTemplates[3]), {
    enabled: showBulkReviseDialog,
  });
  useHotkeys("5", () => setBulkReviseTemplate(rejectionTemplates[4]), {
    enabled: showBulkReviseDialog,
  });
  useHotkeys(
    "6",
    (e) => {
      e.preventDefault();
      setBulkReviseTemplate(rejectionTemplates[5]);
    },
    {
      enabled: showBulkReviseDialog,
    },
  );
  useHotkeys(
    "enter",
    (e) => {
      if (bulkReviseTemplate) {
        e.preventDefault();
        handleBulkRevise();
      }
    },
    {
      enabled: showBulkReviseDialog && !!bulkReviseTemplate,
    },
  );

  useEffect(() => {
    startTransition(() => setPage(1));
  }, [
    search,
    selectedStatuses,
    selectedCategoryId,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    setSelectedAds(new Set());
  }, [page]);

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Главная страница</h1>
        {newAdsCount > 0 && (
          <div className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-medium">
            Новых объявлений: +{newAdsCount}
          </div>
        )}
      </div>

      {isFetching && (
        <div className="fixed top-0 right-0 left-0 z-50">
          <Progress value={100} className="h-1" />
        </div>
      )}

      <div className="bg-card flex flex-wrap items-end gap-4 rounded-lg border p-4">
        <div className="min-w-[250px] flex-1">
          <SearchBar
            ref={searchInputRef}
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
        <div className="flex h-10 items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Найдено объявлений: {pagination?.totalItems}
          </p>
          {selectedAds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Выбрано: {selectedAds.size}
              </span>
              <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                {selectedAds.size === ads?.length ? "Снять все" : "Выбрать все"}
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-green-600"
                onClick={handleBulkApprove}
                disabled={bulkApproveMutation.isPending}
              >
                Одобрить выбранные
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-yellow-600 text-yellow-600"
                onClick={() => setShowBulkReviseDialog(true)}
                disabled={bulkReviseMutation.isPending}
              >
                Вернуть на доработку
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowBulkRejectDialog(true)}
                disabled={bulkRejectMutation.isPending}
              >
                Отклонить выбранные
              </Button>
            </div>
          )}
        </div>
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
          ads?.map((item, index) => (
            <ItemCard
              key={item.id}
              {...item}
              adsIds={ads.map((ad) => String(ad.id))}
              currentIndex={index}
              filters={{
                search,
                status: selectedStatuses,
                categoryId: selectedCategoryId,
                minPrice,
                maxPrice,
                sortBy,
                sortOrder,
              }}
              isSelected={selectedAds.has(String(item.id))}
              onSelectChange={toggleSelectAd}
            />
          ))
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
              (item) => {
                const key = typeof item === "string" ? item : `page-${item}`;

                if (item === "left-ellipsis" || item === "right-ellipsis") {
                  return (
                    <PaginationItem key={key}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={key}>
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

      <Dialog
        open={showBulkRejectDialog}
        onOpenChange={setShowBulkRejectDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Причина массового отклонения</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {rejectionTemplates.map((template, idx) => (
              <Button
                key={template}
                variant={
                  bulkRejectTemplate === template ? "default" : "outline"
                }
                className="w-full justify-start"
                onClick={() => setBulkRejectTemplate(template)}
              >
                {idx + 1}. {template}
              </Button>
            ))}
          </div>
          {bulkRejectTemplate === "Другое" && (
            <Input
              ref={bulkRejectInputRef}
              placeholder="Введите дополнительный комментарий"
              value={bulkRejectComment}
              onChange={(e) => setBulkRejectComment(e.target.value)}
            />
          )}
          <DialogFooter>
            <Button disabled={!bulkRejectTemplate} onClick={handleBulkReject}>
              Отправить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showBulkReviseDialog}
        onOpenChange={setShowBulkReviseDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Причина массового возврата на доработку</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {rejectionTemplates.map((template, idx) => (
              <Button
                key={template}
                variant={
                  bulkReviseTemplate === template ? "default" : "outline"
                }
                className="w-full justify-start"
                onClick={() => setBulkReviseTemplate(template)}
              >
                {idx + 1}. {template}
              </Button>
            ))}
          </div>
          {bulkReviseTemplate === "Другое" && (
            <Input
              ref={bulkReviseInputRef}
              placeholder="Введите дополнительный комментарий"
              value={bulkReviseComment}
              onChange={(e) => setBulkReviseComment(e.target.value)}
            />
          )}
          <DialogFooter>
            <Button disabled={!bulkReviseTemplate} onClick={handleBulkRevise}>
              Отправить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
