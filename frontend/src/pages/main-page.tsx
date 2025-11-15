import { getAds } from "@/api/adsApi";
import { Button } from "@/components/ui/button";

export function MainPage() {
  return (
    <div>
      <Button
        onClick={() => {
          getAds({ page: 1, limit: 3 }).then((res) => {
            console.log(res);
          });
          console.log("clicked");
        }}
      >
        Get Ads
      </Button>
      <h1 className="text-3xl font-bold">Главная страница</h1>
    </div>
  );
}
