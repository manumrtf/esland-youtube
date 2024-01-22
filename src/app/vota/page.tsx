import { CandidatesGrid } from "@/components/candidates-grid";
import { Category } from "@/types";
import Image from "next/image";
async function getCategories() {
  const response = await fetch("http://localhost:9000/categories");
  const data = (await response.json()) as Category[];
  return data;
}
export default async function Page() {
  const categories = await getCategories();

  return (
    <div>
      <header className="h-[91px] bg-esland-dark-blue"></header>
      <CandidatesGrid categories={categories} />
    </div>
  );
}
