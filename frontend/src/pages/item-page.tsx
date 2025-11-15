import { useParams } from "react-router";

export function ItemPage() {
  const { id } = useParams();
  return (
    <div>
      <h1 className="text-3xl font-bold">Страница объявления с айди {id}</h1>
    </div>
  );
}
