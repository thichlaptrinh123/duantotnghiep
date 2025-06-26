"use client"

import { useState, useCallback, useEffect, useRef } from "react";
import clsx from "clsx";
import Image from "next/image";
import dynamic from "next/dynamic";
import { productStatusOptions } from "./product-status";
import ImageUploader from "../shared/constants/image-uploader";
import { isNewProduct } from "../../../../lib/date-utils";
import {
  Product,
  RawProduct,
  ProductVariant,
  ProductModalProps,
  CategoryWithType,
} from "./product-types";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

// CKEditor động
const CKEditorClient = dynamic(() => import("../shared/CKEditorClient"), {
  ssr: false,
});

interface ColorOption {
  name: string;
  hex: string;
}


export default function ProductModal(props: ProductModalProps) {
  const {
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isEdit,
    categoryList = [],
  } = props;

  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    images: [],
    category: "",
    price: 0,
    stock: 0,
    discount: 0,
    featuredLevel: 0,
    isNew: false,
    status: "active",
    // image: "",
    variants: [],
    description: "",
  });

  const [images, setImages] = useState<(File | string)[]>([]);
  const [description, setDescription] = useState("");
  const [discountInput, setDiscountInput] = useState<string>("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const normalizeProduct = (raw: RawProduct): Omit<Product, "id"> => {
      return {
        name: raw.name || "",
        images: raw.images || [],
        category: raw.id_category || "",
        price: Number(raw.price ?? 0),
        stock: Number(raw.stock ?? 0),
        discount: typeof raw.sale === "number" ? raw.sale : 0,
        featuredLevel: Number(raw.product_hot ?? 0),
    
        // ✅ Thay vì check product_new, hãy tính dựa vào createdAt:
        isNew: isNewProduct(raw.createdAt), // 👉 dùng hàm tính bên dưới
    
        status: raw.isActive ? "active" : "inactive",
        variants: Array.isArray(raw.variants) ? raw.variants : [],
        description: raw.description || "",
      };
    };
    
    const fetchInitialVariants = async (productId: string) => {
      try {
        const res = await fetch(`/api/variant?productId=${productId}`);
        if (!res.ok) {
          console.error("❌ Không thể lấy biến thể - mã lỗi:", res.status);
          return;
        }
    
        const data = await res.json();
    
        if (!Array.isArray(data)) {
          console.warn("⚠️ Dữ liệu biến thể không phải mảng:", data);
          setForm((prev) => ({ ...prev, variants: [] }));
          return;
        }
    
        const formattedVariants = data.map((v: any) => ({
          ...v,
          id: v._id, // ✅ Dùng để xử lý update/xoá trong frontend
          price: Number(v.price || 0), // Ép kiểu rõ ràng
          stock_quantity: Number(v.stock_quantity || 0),
        }));
    
        setForm((prev) => ({
          ...prev,
          variants: formattedVariants,
        }));
    
        console.log("✅ Đã load biến thể:", formattedVariants);
      } catch (err) {
        console.error("❌ Lỗi khi fetch biến thể:", err);
        setForm((prev) => ({ ...prev, variants: [] }));
      }
    };

    if (initialData) {
      const normalized = normalizeProduct(initialData);
      setForm(normalized);
      setDescription(normalized.description || "");
      setImages(normalized.images?.length ? normalized.images : []); 
      setDiscountInput(
        normalized.discount === 0 ? "" : normalized.discount.toString()
      );
      if (initialData._id) fetchInitialVariants(initialData._id);
    } else {
      setForm({
        name: "",
        // image: "",
        images: [],
        category: "",
        price: 0,
        stock: 0,
        discount: 0,
        featuredLevel: 0,
        isNew: false,
        status: "active",
        variants: [],
        description: "",
      });
      setDiscountInput("");
      setDescription("");
      setImages([]);
    }

    setTimeout(() => nameRef.current?.focus(), 100);
  }, [initialData]);

  /* ======================= FETCH DANH MỤC ======================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category?onlyActive=true");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };

    fetchCategories();
  }, []);

  const [categories, setCategories] = useState<CategoryWithType[]>([]);

  const groupedCategories = categories.reduce<Record<string, CategoryWithType[]>>((acc, cat) => {
    const typeName = cat.typeId?.name || "Khác";
    if (!acc[typeName]) acc[typeName] = [];
    acc[typeName].push(cat);
    return acc;
  }, {});
  
  /* ======================= XỬ LÝ INPUT ======================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;

    if (name === "discount") {
      let num = parseInt(value);
      if (isNaN(num) || num < 0) num = 0;
      if (num > 100) num = 100;
      setForm((prev) => ({ ...prev, [name]: num }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, "");
    const numberValue = parseInt(rawValue || "0");
    if (!isNaN(numberValue)) {
      setForm((prev) => ({ ...prev, price: numberValue }));
    }
  };

  /* ======================= GỬI FORM ======================= */
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let productId = "";
  
      // ✅ Lọc ảnh rỗng
      const filteredImages = images.filter((img) => {
        if (typeof img === "string") return img.trim() !== "";
        return img instanceof File;
      });
  
      // ✅ Upload song song tất cả ảnh
      const uploadedImageUrls: string[] = await Promise.all(
        filteredImages.map(async (img) => {
          if (typeof img === "string") return img;
  
          const formData = new FormData();
          formData.append("file", img);
  
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
  
          const result = await uploadRes.json();
          if (uploadRes.ok && result.url) {
            return result.url;
          } else {
            console.error("❌ Lỗi upload ảnh:", result.error || result);
            toast.error("❌ Upload ảnh thất bại");
            throw new Error("Upload ảnh thất bại");
          }
        })
      );
  
      // ✅ Chuẩn hóa dữ liệu sản phẩm
      const productData = {
        name: form.name.trim(),
        id_category: form.category,
        images: uploadedImageUrls,
        product_hot: Number(form.featuredLevel || 0),
        product_new: form.isNew ? 1 : 0,
        sale: Number(form.discount || 0),
        isActive: form.status === "active",
        description,
        price: Number(form.price || 0),
      };
  
      // ✅ Gửi sản phẩm chính
      let res;
      if (isEdit && initialData) {
        res = await fetch(`/api/product/${initialData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      } else {
        res = await fetch("/api/product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      }
  
      if (!res.ok) {
        console.error("❌ Gửi sản phẩm thất bại:", await res.text());
        toast.error("❌ Gửi sản phẩm thất bại");
        return;
      }
  
      const saved = await res.json();
      productId = saved._id;
  
      const variantRequests = (form.variants ?? []).map(async (variant) => {
        const payload = {
          name: `${variant.size || ""}${variant.color ? " - " + variant.color : ""}`.trim(),
          id_product: productId,
          id_category: form.category,
          size: variant.size,
          color: variant.color,
          stock_quantity: Number(variant.stock_quantity || 0),
          price: Number(variant.price || form.price),
          isActive: true,
        };
      
        try {
          // ✅ Nếu là biến thể đã tồn tại → cập nhật (PUT)
          if (isEdit && variant.id && typeof variant.id === "string") {
            await fetch(`/api/variant/${variant.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          } else {
            // ✅ Nếu là biến thể mới → tạo mới (POST)
            await fetch(`/api/variant`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          }
        } catch (err) {
          console.error("❌ Lỗi gửi biến thể:", err);
        }
      });
      
    await Promise.all(variantRequests);


        
      // ✅ Xử lý sau khi thành công
      toast.success(isEdit ? "Cập nhật thành công" : "Thêm sản phẩm thành công");
      onSubmit();
      onClose();
  
      // ✅ Reset form
      setForm({
        name: "",
        images: [],
        category: "",
        price: 0,
        stock: 0,
        discount: 0,
        featuredLevel: 0,
        isNew: false,
        status: "active",
        variants: [],
        description: "",
      });
      setDescription("");
      setImages([]);
    } catch (err) {
      console.error("❌ Lỗi tổng:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
 

  /* ======================= XỬ LÝ ẢNH ======================= */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ======================= XỬ LÝ VARIANT ======================= */
  const handleVariantChange = (
    index: number,
    field: keyof ProductVariant,
    value: string | number
  ) => {
    const updatedVariants = [...(form.variants ?? [])];

    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]:
        field === "price" || field === "stock_quantity"
          ? Number(value)
          : value,
    };
    setForm((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    const newVariant = {
      id: Date.now(),
      size: "",
      color: "",
      price: 0,
      stock_quantity: 0,
    };
    setForm((prev) => ({
      ...prev,
      variants: [newVariant, ...(prev.variants ?? [])],
    }));    
  };

  const removeVariant = (index: number) => {
    const updated = [...(form.variants ?? [])];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, variants: updated }));    
  };

/* ======================= XỬ LÝ SIZE - MÀU THEO DANH MỤC ======================= */

// State lưu danh sách size và màu từ backend
const [availableSizes, setAvailableSizes] = useState<string[]>([]);
const [availableColors, setAvailableColors] = useState<ColorOption[]>([]);

// Lấy loại danh mục từ danh sách danh mục (cập nhật realtime)
const selectedCategory = categories.find((cat) => cat._id === form.category);
const categoryType = selectedCategory?.typeId?.name?.toLowerCase() || "";

// ✅ Xác định có hiển thị field size không (ví dụ chỉ áp dụng cho áo/quần)
const showSizeField = categoryType === "top" || categoryType === "pant";

// ✅ Fetch size & color khi thay đổi danh mục (chỉ khi tạo mới)
useEffect(() => {
  if (!form.category || categories.length === 0) return;

  const selected = categories.find((cat) => cat._id === form.category);
  const typeName = selected?.typeId?.name?.toLowerCase();

  if (!typeName) {
    setAvailableSizes([]);
    setAvailableColors([]);
    return;
  }

  const fetchOptions = async () => {
    try {
      const [sizesRes, colorsRes] = await Promise.all([
        fetch(`/api/size-option?categoryType=${typeName}`),
        fetch(`/api/color-option?categoryType=${typeName}`),
      ]);
  
      const sizeData = await sizesRes.json();
      const colorData = await colorsRes.json();
  
      // ✅ Màu sắc
      const matchedColor = Array.isArray(colorData)
      ? colorData.find(
          (item) => item.categoryType.toLowerCase() === typeName.toLowerCase()
        )
      : null;
  
      setAvailableColors(
        matchedColor && Array.isArray(matchedColor.values)
          ? matchedColor.values
          : []
      );
      console.log("🔍 categoryType name:", typeName);

      // ✅ Size (⚠️ sửa lại `values` thay vì `sizes`)
      const matchedSize = Array.isArray(sizeData)
      ? sizeData.find(
          (item) => item.categoryType.toLowerCase() === typeName.toLowerCase()
        )
      : null;
  
      setAvailableSizes(
        matchedSize && Array.isArray(matchedSize.values)
          ? matchedSize.values
          : []
      );
    } catch (err) {
      console.error("❌ Lỗi khi fetch size/color:", err);
      setAvailableSizes([]);
      setAvailableColors([]);
    }
  };
  
  

  fetchOptions();
}, [form.category, categories]);

/* ======================= TỰ ĐỘNG FETCH BIẾN THỂ ======================= */

// // Chỉ tự động fetch biến thể khi tạo mới sản phẩm (không phải edit)
// useEffect(() => {
//   const fetchVariantsByCategory = async () => {
//     if (!form.category || isEdit) return;

//     try {
//       const res = await fetch(`/api/variant?categoryId=${form.category}`);
//       const data = await res.json();

//       if (Array.isArray(data)) {
//         setForm((prev) => ({ ...prev, variants: data }));
//       } else {
//         setForm((prev) => ({ ...prev, variants: [] }));
//       }
//     } catch (err) {
//       console.error("❌ Lỗi khi fetch biến thể theo danh mục:", err);
//       setForm((prev) => ({ ...prev, variants: [] }));
//     }
//   };

//   fetchVariantsByCategory();
// }, [form.category, isEdit]);

if (!isOpen) return null;

  /* ======================= GIAO DIỆN (JSX) ======================= */
return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 text-[#960130]">
          {isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </h2>
  
        {/* ===== Form Thông Tin Cơ Bản ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
  
          {/* Hình ảnh */}
          <div className="sm:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh sản phẩm</label>

      {/* Dùng uploader */}
     <ImageUploader onFiles={onDrop} />


      {/* Preview ảnh */}
      {images.length > 0 && (
  <div className="flex flex-wrap gap-4 mt-3">
    {images.map((img, index) => {
      let imageUrl = "";

      if (typeof img === "string" && img.trim() !== "") {
        imageUrl = img;
      } else if (img instanceof File) {
        imageUrl = URL.createObjectURL(img);
      }

      // Nếu không có URL hợp lệ thì không render ảnh
      if (!imageUrl) return null;

      return (
        <div
          key={index}
          className="relative w-28 h-28 rounded-md overflow-hidden border border-gray-200 shadow-sm group"
        >
          <Image
            src={imageUrl}
            alt={`Hình ảnh ${index + 1}`}
            width={112}
            height={112}
            className="object-cover w-full h-full"
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition"
          >
            ×
          </button>
        </div>
      );
    })}
  </div>
)}

    </div>
  
          {/* Tên sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
            <input
              ref={nameRef}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#960130]"
            />
          </div>
  
         {/* Danh mục */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
  <select
  name="category"
  value={form.category}
  onChange={handleChange}
  className="w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#960130]"
>
  <option value="">-- Chọn danh mục --</option>

  {Object.entries(groupedCategories).map(([typeName, group]) => (
    <optgroup key={typeName} label={typeName.toUpperCase()}>
      {group.map((cat) => (
        <option key={cat._id} value={cat._id}>
          {cat.name}
        </option>
      ))}
    </optgroup>
  ))}
</select>
</div>

        {/* Mô tả */}
  <div className="col-span-1 sm:col-span-2">
    <label className="text-sm font-medium block mb-1">Mô tả</label>
    <div className="w-full">
      <CKEditorClient value={description} onChange={setDescription} />
    </div>
  </div>

  {/* Giá */}
  <div>
    <label className="block text-sm font-medium mb-1">Giá</label>
    <input
      name="price"
      type="text"
      value={form.price ? form.price.toLocaleString("vi-VN") : ""}
      onChange={handlePriceChange}
      placeholder="Giá sản phẩm"
      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#960130]"
    />
  </div>

  <div>
  <label className="block text-sm font-medium mb-1">Giảm giá (%)</label>
  <input
  name="discount"
  type="number"
  value={discountInput}
  onChange={(e) => {
    const raw = e.target.value;
    if (/^\d{0,3}$/.test(raw) && Number(raw) <= 100) {
      setDiscountInput(raw);
      setForm((prev) => ({
        ...prev,
        discount: raw === "" ? 0 : Number(raw),
      }));
    }
  }}
  placeholder="Phần trăm giảm giá (0 - 100%)"
  inputMode="numeric"
  min={0}
  max={100}
  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#960130]"
/>

</div>

{/* Trạng thái sản phẩm */}
{isEdit && (
  <div>
    <label className="block text-sm font-medium mb-1">Trạng thái</label>
    <select
      name="status"
      value={form.status}
      onChange={handleChange}
      className="w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#960130]"
    >
      <option value="active">Hiển thị</option>
      <option value="inactive">Tạm ngưng</option>
    </select>
  </div>
)}




</div>
    
{/* ===== Biến thể sản phẩm ===== */}
{form.category && (
  <div className="mt-8">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-bold text-[#960130]">Chi tiết sản phẩm</h3>
      <button
        type="button"
        onClick={addVariant}
        className="text-sm px-4 py-2 bg-[#960130] text-white rounded-md hover:bg-[#B3123D] transition"
      >
        + Thêm biến thể
      </button>
    </div>

    {(!form.variants || form.variants.length === 0) && (
      <p className="text-sm text-gray-500 mb-6">Chưa có biến thể nào.</p>
    )}

    <div className="space-y-4">
      {form.variants?.map((variant, index) => (
        <div
          key={variant.id || index}
          className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm space-y-4"
        >
         {/* Size */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Size
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size, idx) => (
              <button
                key={`${size}-${idx}`}
                type="button"
                onClick={() => handleVariantChange(index, "size", size)}
                className={clsx(
                  "flex items-center gap-2 px-3 py-1 rounded border text-sm transition",
                  variant.size === size
                    ? "bg-[#960130] text-white border-[#960130]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#960130]"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>


          {/* Màu sắc */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Màu sắc
            </label>
            <div className="flex flex-wrap gap-2">
            {availableColors.map((color, idx) => (
              <button
                key={`${color.name}-${idx}`} // ✅ dùng name hoặc index làm key
                type="button"
                onClick={() => handleVariantChange(index, "color", color.name)}
                className={clsx(
                  "flex items-center gap-2 px-3 py-1 rounded border text-sm transition",
                  variant.color === color.name
                    ? "bg-[#960130] text-white border-[#960130]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#960130]"
                )}
              >
                <span
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: color.hex }}
                ></span>
                {color.name}
              </button>
            ))}




            </div>
          </div>

          {/* Giá & Tồn kho */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Giá biến thể
              </label>
              <input
                type="number"
                min={0}
                value={variant.price || ""}
                onChange={(e) =>
                  handleVariantChange(index, "price", Number(e.target.value))
                }
                placeholder={`Mặc định: ${form.price.toLocaleString("vi-VN")} VNĐ`}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#960130] placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1 italic">
                Nếu để trống, hệ thống sẽ dùng giá mặc định từ sản phẩm chính.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tồn kho</label>
              <input
                type="number"
                min={0}
                value={variant.stock_quantity || ""}
                onChange={(e) =>
                  handleVariantChange(index, "stock_quantity", Number(e.target.value))
                }
                placeholder="Số lượng"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#960130]"
              />
            </div>
          </div>

          {/* Xoá biến thể */}
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="text-red-600 hover:text-red-800 text-sm underline"
            >
              Xoá
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


  
        {/* ===== Action Buttons ===== */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Đóng
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-[#960130] text-white rounded-md hover:bg-[#B3123D]"
          >
            {isSubmitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm sản phẩm"}
          </button>
        </div>
      </div>
    </div>
  );
  
}
