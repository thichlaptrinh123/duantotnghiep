export interface ProductVariant {
  id?: number | string;
  size: string;
  color: string; // chỉ cần tên
  price: number;
  stock_quantity: number;
  id_category?: string;
}

  
  export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: "active" | "inactive";
    images?: string[];
    variants?: ProductVariant[];
    discount: number;
    featuredLevel: number;
    isNew?: boolean;
    description?: string;
  }
  
  export interface CategoryWithType {
    _id: string;
    name: string;
    typeId?: {
      _id: string;
      name: string;
      isActive?: boolean;
    };
  }
  
  export interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data?: Product | Omit<Product, "id">) => void;
    initialData?: RawProduct | null;
    isEdit: boolean;
    categoryList: CategoryWithType[];
  }
  
  export interface RawProduct {
    _id: string;
    name: string;
    price?: number;
    stock?: number;
    image?: string;
    images?: string[];
    sale?: number;
    product_hot?: number;
    // product_new?: number;
    isActive?: boolean;
    description?: string;
    id_category?: string;
    variants?: ProductVariant[];
    createdAt?: string;
  }

  export interface Color {
    _id: string;
    name: string;
    hex: string;
  }
  
  
  