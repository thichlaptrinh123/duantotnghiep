import { Product } from "../models/IProduct";

const root = "http://localhost:8989/product";

const option: RequestInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export const fetchData = async <T>(url: string): Promise<T> => {
  try {
    const res = await fetch(url, option);
    if (!res.ok) throw new Error("Lỗi mạng");
    const data = await res.json();
    return (data.data || data) as T;
  } catch (err) {
    console.error("Lỗi fetch:", err);
    return [] as unknown as T;
  }
};

export const getAllProducts = () => fetchData<Product[]>(`${root}`);
export const getHotProducts = () => fetchData<Product[]>(`${root}/hot`);
export const getNewProducts = () => fetchData<Product[]>(`${root}/new`);
export const getSaleProducts = () => fetchData<Product[]>(`${root}/sale`);
