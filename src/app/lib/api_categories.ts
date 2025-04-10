// lib/api_categories.ts
import { fetchData } from "./api_allproducts";

export interface Category {
  _id?: string;
  name: string;
}

const root = "http://localhost:8989/category";

export const getAllCategories = () => fetchData<Category[]>(`${root}`);
