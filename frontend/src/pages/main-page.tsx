import { getAds } from "@/api/adsApi";
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
      <h1 className="text-3xl font-bold">Главная страница</h1>
    </div>
  );
}
