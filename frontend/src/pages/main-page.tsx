import { getAds } from "@/api/adsApi";
import { ItemCard } from "@/components/ItemCard";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function MainPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["ads"],
    queryFn: () => getAds(),
  });

  useEffect(() => {
    console.log(data, error, isLoading);
  }, [data, error, isLoading]);

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Главная страница</h1>

      <div className="flex flex-col gap-4">
        {data && data.ads.map((item) => <ItemCard key={item.id} {...item} />)}
      </div>
    </div>
  );
}
