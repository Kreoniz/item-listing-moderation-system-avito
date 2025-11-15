import { getAds } from "@/api/adsApi";
import { ItemCard } from "@/components/ItemCard";
import { SearchBar } from "@/components/SearchBar";
import { useDebounceCallback } from "@/shared/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function MainPage() {
  const [search, setSearch] = useState("");

  const debouncedCallback = useDebounceCallback(
    (value: string) => setSearch(value),
    300,
  );

  const { data, error, isLoading } = useQuery({
    queryKey: ["ads", { search }],
    queryFn: () => getAds({ search }),
  });

  useEffect(() => {
    console.log(data, error, isLoading);
  }, [data, error, isLoading]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Главная страница</h1>

      <SearchBar
        onChange={debouncedCallback}
        placeholder="Поиск по названию..."
      />

      <div className="flex flex-col gap-4">
        {data && data.ads.map((item) => <ItemCard key={item.id} {...item} />)}
      </div>
    </div>
  );
}
