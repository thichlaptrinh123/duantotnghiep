"use client";

import { useState, useEffect, useRef } from "react";

interface User {
  id?: string;
  name: string;
  password: string;
  phone: string;
  email: string;
  role: "super-admin" | "product-manager" | "order-manager" | "post-manager" | "customer";
  status: "active" | "inactive";
  address: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  initialData?: User | null;
}

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: UserModalProps) {
  const [form, setForm] = useState<User>({
    name: "",
    password: "",
    phone: "",
    email: "",
    role: "customer",
    status: "active",
    address: "",
  });

  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        name: "",
        password: "",
        phone: "",
        email: "",
        role: "customer",
        status: "active",
        address: "",
      });
    }
    setTimeout(() => {
      nameRef.current?.focus();
    }, 100);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  
    // ✅ Reset form nếu đang ở chế độ thêm mới (không có initialData)
    if (!initialData) {
      setForm({
        name: "",
        password: "",
        phone: "",
        email: "",
        role: "customer", // bạn có thể chọn mặc định vai trò nào cũng được
        status: "active",
        address: "",
      });
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2">
    <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8 relative">
      <h2 className="text-2xl font-bold mb-6 text-[#960130]">
        {initialData ? "Cập nhật tài khoản" : "Thêm tài khoản"}
      </h2>
  
      {error && (
        <div className="text-red-500 mb-4 text-sm font-medium bg-red-50 p-3 rounded">
          {error}
        </div>
      )}
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Họ tên */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Họ và tên
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#960130]"
          />
        </div>
  
        {/* Mật khẩu */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#960130]"
          />
        </div>
  
        {/* Số điện thoại */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Số điện thoại
          </label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#960130]"
          />
        </div>
  
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Nhập email"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#960130]"
          />
        </div>
  
        {/* Vai trò */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            Vai trò
          </label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#960130]"
          >
            <option value="super-admin">Admin tổng</option>
            <option value="product-manager">Quản lý sản phẩm</option>
            <option value="order-manager">Quản lý đơn hàng</option>
            <option value="post-manager">Quản lý bài viết</option>
            <option value="customer">Khách hàng</option>
          </select>
        </div>
  
        {/* Trạng thái */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Trạng thái
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#960130]"
          >
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngưng hoạt động</option>
          </select>
        </div>
  
        {/* Địa chỉ (chiếm cả hàng) */}
        <div className="sm:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Địa chỉ
          </label>
          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
            className="w-full border rounded-lg px-4 py-2 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-[#960130]"
          />
        </div>
      </div>
  
      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          Đóng
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm bg-[#960130] text-white rounded-md hover:bg-[#B3123D]"
        >
          {initialData ? "Lưu thay đổi" : "Thêm mới"}
        </button>
      </div>
    </div>
  </div>
    );    
}
