// Inventory types and interfaces
export type StatusFilter = "all" | "active" | "deactive";

export interface InventoryRowData {
  id: string;
  sl: number;
  isbn: string;
  photo: string;
  titleEn: string;
  titleBn: string;
  author: string;
  category: string;
  stock: number;
  price: string | number;
  status: "active" | "deactive";
}
