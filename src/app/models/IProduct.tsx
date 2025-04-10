export interface Product {
    _id?: string;
    name: string;
    price: number;
    description?: string;
    id_category?: string;
    status?: string;
    sale?: number;
    product_hot?: number;
    product_new?: number;
    image?: string; // fallback nếu có
  }
  