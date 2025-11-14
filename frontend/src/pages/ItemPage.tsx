import { useParams } from "react-router";

export function ItemPage() {
  const { id } = useParams();
  return (
    <div>
      <h1 className="text-3xl font-bold">Item Page for item {id}</h1>
    </div>
  );
}
