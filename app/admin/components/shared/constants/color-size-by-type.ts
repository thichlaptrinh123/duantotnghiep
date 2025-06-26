// shared/constants/color-size-by-type.ts (mới)

export const colorOptionsByType: Record<string, string[]> = {
    top: ["Đỏ", "Cam", "Vàng", "Xanh lá", "Xanh lam", "Be", "Xám", "Đen", "Trắng"],
    pant: ["Đen", "Trắng", "Xám", "Xanh đậm", "Be"],
    accessory: ["Đen", "Trắng", "Xám", "Nâu", "Be"],
  };
  
  export const sizeOptionsByType: Record<string, (string | number)[]> = {
    top: ["S", "M", "L", "XL", "XXL"],
    pant: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    accessory: [], // Không có size
  };
  