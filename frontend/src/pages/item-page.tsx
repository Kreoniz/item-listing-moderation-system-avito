import {
  approveAd,
  getAd,
  getAllAdsIds,
  rejectAd,
  requestChangesAd,
} from "@/api/ads-api";
import { ImageGallery } from "@/components/image-gallery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTimeString } from "@/lib/utils";
import type { AdsListQuery, Advertisement } from "@/shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StarIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";

const rejectionTemplates = [
  "Запрещенный товар",
  "Неверная категория",
  "Некорректное описание",
  "Проблемы с фото",
  "Подозрение на мошенничество",
  "Другое",
];

const decisionMap: Record<string, string> = {
  approved: "Одобрено",
  rejected: "Отклонено",
  requestChanges: "На доработке",
};

export function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const abortController = useRef(new AbortController());

  const filters: Omit<Partial<AdsListQuery>, "page" | "limit"> = {
    search: searchParams.get("search") || undefined,
    status: searchParams.get("status")
      ? (searchParams.get("status")!.split(",") as AdsListQuery["status"])
      : undefined,
    categoryId: searchParams.get("category")
      ? Number(searchParams.get("category"))
      : undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    sortBy:
      (searchParams.get("sortBy") as AdsListQuery["sortBy"]) || "createdAt",
    sortOrder:
      (searchParams.get("sortOrder") as AdsListQuery["sortOrder"]) || "desc",
  };

  const {
    data: ad,
    isLoading,
    error,
  } = useQuery<Advertisement>({
    queryKey: ["ad", id],
    queryFn: () => getAd(id!, abortController.current.signal),
  });

  const { data: allAdsIds } = useQuery<string[]>({
    queryKey: ["allAdsIds", filters],
    queryFn: () => getAllAdsIds(filters, abortController.current.signal),
  });

  const approveMutation = useMutation({
    mutationFn: () => approveAd(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      queryClient.invalidateQueries({ queryKey: ["ad", id] });
      queryClient.invalidateQueries({ queryKey: ["allAdsIds"] });
      if (nextId) {
        navigate(getNavigationUrl(nextId));
      }
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (body: { reason: string; comment?: string }) =>
      rejectAd(id!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      queryClient.invalidateQueries({ queryKey: ["ad", id] });
      queryClient.invalidateQueries({ queryKey: ["allAdsIds"] });
      if (nextId) {
        navigate(getNavigationUrl(nextId));
      }
    },
  });

  const requestChangesMutation = useMutation({
    mutationFn: (body: { reason: string; comment?: string }) =>
      requestChangesAd(id!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      queryClient.invalidateQueries({ queryKey: ["ad", id] });
      queryClient.invalidateQueries({ queryKey: ["allAdsIds"] });
      if (nextId) {
        navigate(getNavigationUrl(nextId));
      }
    },
  });

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showReviseDialog, setShowReviseDialog] = useState(false);
  const [rejectTemplate, setRejectTemplate] = useState("");
  const [rejectComment, setRejectComment] = useState("");
  const [reviseTemplate, setReviseTemplate] = useState("");
  const [reviseComment, setReviseComment] = useState("");

  const { adsIds: stateAdsIds, currentIndex: stateCurrentIndex } =
    (location.state as { adsIds?: string[]; currentIndex?: number }) || {};

  const adsIds = allAdsIds || stateAdsIds;

  const currentIndex =
    stateCurrentIndex ??
    (adsIds && id ? adsIds.indexOf(String(id)) : undefined);

  const prevId =
    currentIndex != null && currentIndex > 0
      ? adsIds?.[currentIndex - 1]
      : null;
  const nextId =
    currentIndex != null && currentIndex < (adsIds?.length ?? 0) - 1
      ? adsIds?.[currentIndex + 1]
      : null;

  const getNavigationUrl = (itemId: string) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status && filters.status.length > 0)
      params.set("status", filters.status.join(","));
    if (filters.categoryId !== undefined)
      params.set("category", String(filters.categoryId));
    if (filters.minPrice !== undefined)
      params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice !== undefined)
      params.set("maxPrice", String(filters.maxPrice));
    if (filters.sortBy && filters.sortBy !== "createdAt")
      params.set("sortBy", filters.sortBy);
    if (filters.sortOrder && filters.sortOrder !== "desc")
      params.set("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    return `/item/${itemId}${queryString ? `?${queryString}` : ""}`;
  };

  const handleRejectSubmit = () => {
    if (rejectTemplate) {
      const body = {
        reason: rejectTemplate,
        comment: rejectTemplate === "Другое" ? rejectComment : undefined,
      };
      rejectMutation.mutate(body);
      setShowRejectDialog(false);
    }
  };

  const handleReviseSubmit = () => {
    if (reviseTemplate) {
      const body = {
        reason: reviseTemplate,
        comment: reviseTemplate === "Другое" ? reviseComment : undefined,
      };
      requestChangesMutation.mutate(body);
      setShowReviseDialog(false);
    }
  };

  useHotkeys("r", () => {
    console.log("pressed R");
  });

  useHotkeys("a, shift+a", () => {
    if (!showRejectDialog && !showReviseDialog) {
      approveMutation.mutate();
    }
  });
  useHotkeys("d, shift+d", () => {
    if (!showRejectDialog && !showReviseDialog) {
      setShowRejectDialog(true);
    }
  });
  useHotkeys("s, shift+s", () => {
    if (!showRejectDialog && !showReviseDialog) {
      setShowReviseDialog(true);
    }
  });
  useHotkeys("arrowleft", () => {
    if (prevId && !showRejectDialog && !showReviseDialog) {
      navigate(getNavigationUrl(prevId));
    }
  });
  useHotkeys("arrowright", () => {
    if (nextId && !showRejectDialog && !showReviseDialog) {
      navigate(getNavigationUrl(nextId));
    }
  });

  useHotkeys("1", () => setRejectTemplate(rejectionTemplates[0]), {
    enabled: showRejectDialog,
  });
  useHotkeys("2", () => setRejectTemplate(rejectionTemplates[1]), {
    enabled: showRejectDialog,
  });
  useHotkeys("3", () => setRejectTemplate(rejectionTemplates[2]), {
    enabled: showRejectDialog,
  });
  useHotkeys("4", () => setRejectTemplate(rejectionTemplates[3]), {
    enabled: showRejectDialog,
  });
  useHotkeys("5", () => setRejectTemplate(rejectionTemplates[4]), {
    enabled: showRejectDialog,
  });
  useHotkeys("6", () => setRejectTemplate(rejectionTemplates[5]), {
    enabled: showRejectDialog,
  });
  useHotkeys("enter", handleRejectSubmit, {
    enabled: showRejectDialog && !!rejectTemplate,
  });

  useHotkeys("1", () => setReviseTemplate(rejectionTemplates[0]), {
    enabled: showReviseDialog,
  });
  useHotkeys("2", () => setReviseTemplate(rejectionTemplates[1]), {
    enabled: showReviseDialog,
  });
  useHotkeys("3", () => setReviseTemplate(rejectionTemplates[2]), {
    enabled: showReviseDialog,
  });
  useHotkeys("4", () => setReviseTemplate(rejectionTemplates[3]), {
    enabled: showReviseDialog,
  });
  useHotkeys("5", () => setReviseTemplate(rejectionTemplates[4]), {
    enabled: showReviseDialog,
  });
  useHotkeys("6", () => setReviseTemplate(rejectionTemplates[5]), {
    enabled: showReviseDialog,
  });
  useHotkeys("enter", handleReviseSubmit, {
    enabled: showReviseDialog && !!reviseTemplate,
  });

  if (isLoading) {
    return <Skeleton className="h-[80vh] w-full" />;
  }

  if (error || !ad) {
    return (
      <div className="text-destructive py-8 text-center font-bold">
        Ошибка загрузки объявления
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="self-end justify-self-end"
          onClick={() => {
            const params = new URLSearchParams();
            if (filters.search) params.set("search", filters.search);
            if (filters.status && filters.status.length > 0)
              params.set("status", filters.status.join(","));
            if (filters.categoryId !== undefined)
              params.set("category", String(filters.categoryId));
            if (filters.minPrice !== undefined)
              params.set("minPrice", String(filters.minPrice));
            if (filters.maxPrice !== undefined)
              params.set("maxPrice", String(filters.maxPrice));
            if (filters.sortBy && filters.sortBy !== "createdAt")
              params.set("sortBy", filters.sortBy);
            if (filters.sortOrder && filters.sortOrder !== "desc")
              params.set("sortOrder", filters.sortOrder);

            const queryString = params.toString();
            navigate(`/list${queryString ? `?${queryString}` : ""}`);
          }}
        >
          Назад к списку
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!prevId}
            onClick={() => {
              if (prevId) {
                navigate(getNavigationUrl(prevId));
              }
            }}
          >
            Предыдущее
          </Button>
          <Button
            variant="outline"
            disabled={!nextId}
            onClick={() => {
              if (nextId) {
                navigate(getNavigationUrl(nextId));
              }
            }}
          >
            Следующее
          </Button>
        </div>
      </div>
      <h1 className="text-3xl font-bold">{ad.title}</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ImageGallery images={ad.images} />
          <div>
            <h2 className="text-2xl font-semibold">Описание</h2>
            <p className="text-muted-foreground">{ad.description}</p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              Информация о продавце
            </h2>
            <div className="text-muted-foreground space-y-2">
              <div className="flex gap-2">
                <p>{ad.seller.name}</p>
                <p className="flex gap-1">
                  <StarIcon className="fill-[#ecc63c] stroke-[#ecc63c]" />
                  {ad.seller.rating}
                </p>
              </div>
              <p>{ad.seller.totalAds} объявлений</p>
              <p>
                Дата регистрации: {formatTimeString(ad.seller.registeredAt)}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex gap-4">
            <Button
              variant="default"
              className="bg-green-600 hover:cursor-pointer"
              onClick={() => approveMutation.mutate()}
            >
              Одобрить
            </Button>
            <Button
              variant="outline"
              className="border-yellow-600 text-yellow-600 hover:cursor-pointer"
              onClick={() => setShowReviseDialog(true)}
            >
              Вернуть на доработку
            </Button>
            <Button
              variant="destructive"
              className="hover:cursor-pointer"
              onClick={() => setShowRejectDialog(true)}
            >
              Отклонить
            </Button>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Характеристики</h2>
            <Table>
              <TableHeader></TableHeader>
              <TableBody>
                {Object.entries(ad.characteristics).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">История модерации</h2>
            {ad.moderationHistory.length > 0 ? (
              <ScrollArea>
                <ScrollBar orientation="horizontal" className="top-0" />
                <Table className="mt-2">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Кто</TableHead>
                      <TableHead>Когда</TableHead>
                      <TableHead>Решение</TableHead>
                      <TableHead>Комментарий</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...ad.moderationHistory].reverse().map((action, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{action.moderatorName}</TableCell>
                        <TableCell>
                          {formatTimeString(action.timestamp)}
                        </TableCell>
                        <TableCell>
                          <div
                            className={
                              action.action === "rejected"
                                ? "text-red-700"
                                : action.action === "approved"
                                  ? "text-green-700"
                                  : "text-yellow-700"
                            }
                          >
                            {decisionMap[action.action] || action.action}
                          </div>
                        </TableCell>
                        <TableCell>
                          {action.reason
                            ? `${action.reason}${action.comment ? ` - ${action.comment}` : ""}`
                            : action.comment || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground">Нет истории модерации</p>
            )}
          </div>
        </div>
      </div>
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Причина отклонения</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {rejectionTemplates.map((template, idx) => (
              <Button
                key={template}
                variant={rejectTemplate === template ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setRejectTemplate(template)}
              >
                {idx + 1}. {template}
              </Button>
            ))}
          </div>
          {rejectTemplate === "Другое" && (
            <Input
              placeholder="Введите дополнительный комментарий"
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
            />
          )}
          <DialogFooter>
            <Button disabled={!rejectTemplate} onClick={handleRejectSubmit}>
              Отправить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showReviseDialog} onOpenChange={setShowReviseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Причина возврата на доработку</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {rejectionTemplates.map((template, idx) => (
              <Button
                key={template}
                variant={reviseTemplate === template ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setReviseTemplate(template)}
              >
                {idx + 1}. {template}
              </Button>
            ))}
          </div>
          {reviseTemplate === "Другое" && (
            <Input
              placeholder="Введите дополнительный комментарий"
              value={reviseComment}
              onChange={(e) => setReviseComment(e.target.value)}
            />
          )}
          <DialogFooter>
            <Button disabled={!reviseTemplate} onClick={handleReviseSubmit}>
              Отправить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
