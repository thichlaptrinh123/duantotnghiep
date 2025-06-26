export const isNewProduct = (createdAt?: string): boolean => {
    if (!createdAt) return false;
  
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInDays =
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  
    return diffInDays <= 14;
  };