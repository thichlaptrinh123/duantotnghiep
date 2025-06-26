"use client";

import React, { useState, useMemo, useEffect } from "react";
import SearchInput from "../components/shared/search-input";
import Pagination from "../components/shared/pagination";
import StatusFilter from "../components/shared/status-filter";
import UserModal from "../components/user/user-modal";
import clsx from "clsx";

export default function UserPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "a@example.com",
      phone: "0123456789",
      address: "Hà Nội",
      role: "super-admin",
      status: "active",
      password: "",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "b@example.com",
      phone: "0987654321",
      address: "TP.HCM",
      role: "customer",
      status: "inactive",
      password: "",
    },
  ]);

  const [orders] = useState([
    { id: 1, userId: 1, status: "completed", total: 500000, createdAt: "2024-06-01" },
    { id: 2, userId: 1, status: "completed", total: 300000, createdAt: "2024-06-03" },
    { id: 3, userId: 2, status: "pending", total: 150000, createdAt: "2024-06-04" },
  ]);

  const handleSave = (user) => {
    if (user.id) {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, ...user } : u))
      );
    } else {
      const newUser = { ...user, id: Date.now() };
      setUsers((prev) => [...prev, newUser]);
    }
    setShowModal(false);
    setSelectedUser(null);
  };

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    setCurrentPage(1); // Reset về trang đầu khi lọc hoặc tìm kiếm
  }, [search, status]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === "all" || user.status === status;
      return matchSearch && matchStatus;
    });
  }, [users, search, status]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  return (
        <section className="p-4 space-y-6">
          {/* 🔍 Tiêu đề + Bộ lọc + tìm kiếm */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-h3 font-semibold text-gray-800">Quản lý tài khoản</h1>
      
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <SearchInput
                value={search}
                placeholder="Tìm theo tên, email..."
                onChange={setSearch}
            />
               <StatusFilter
            value={status}
            onChange={(val) => setStatus(val as "all" | "active" | "inactive")}
            options={[
              { label: "Tất cả trạng thái", value: "all" },
              { label: "Hoạt động", value: "active" },
              { label: "Tạm ngưng", value: "inactive" },
            ]}
          />
            </div>
          </div>
      
          {/* ➕ Nút thêm */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSelectedUser(null);
                setShowModal(true);
              }}
              className="px-4 py-2 text-sm bg-[#960130] text-white rounded-md hover:bg-[#B3123D]"
            >
              + Thêm tài khoản
            </button>
          </div>
      
        {/* 📋 Bảng danh sách */}
<div className="bg-white rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-4 space-y-4">
<h1 className="text-lg font-semibold mb-4">Danh sách tài khoản</h1>
  {/* Tiêu đề bảng */}
  <div className="hidden lg:grid grid-cols-9 gap-4 px-2 py-3 bg-[#F9F9F9] rounded-md font-semibold text-gray-800 text-sm">
  <div>STT</div>
  <div>Họ tên</div>
  <div>Email</div>
  <div>Điện thoại</div>
  <div>Địa chỉ</div>
  <div>Vai trò</div>
  <div>Đơn hàng</div> 
  <div>Trạng thái</div>
  <div className="text-center">Thao tác</div>
</div>


{paginatedUsers.map((user, index) => {
  const completedOrders = orders.filter(
    (order) => order.userId === user.id && order.status === "completed"
  ).length;

  return (
    <div
      key={user.id}
      className="grid grid-cols-9 gap-4 px-2 py-3 items-center border-b border-gray-200"
    >
      {/* STT */}
      <div className="text-sm text-gray-700">{index + 1}</div>

        <div className="text-sm text-gray-700">{user.name}</div>
        <div className="text-sm text-gray-700">{user.email}</div>
        <div className="text-sm text-gray-700">{user.phone}</div>
        <div className="text-sm text-gray-700">{user.address}</div>
        <div>
          <span
            className={clsx(
              "px-3 py-1 rounded-full text-xs font-medium capitalize text-center",
              {
                "bg-gray-100 text-gray-700": user.role === "customer",
                "bg-blue-100 text-blue-700": user.role === "super-admin",
                "bg-purple-100 text-purple-700": user.role === "product-manager",
                "bg-yellow-100 text-yellow-800": user.role === "order-manager",
                "bg-pink-100 text-pink-700": user.role === "post-manager",
              }
            )}
          >
            {
              {
                "super-admin": "Admin tổng",
                "product-manager": "QL sản phẩm",
                "order-manager": "QL đơn hàng",
                "post-manager": "QL bài viết",
                "customer": "Khách hàng",
              }[user.role] ?? user.role
            }
          </span>
        </div>

        {/* ✅ Cột số đơn hàng */}
        <div className="text-sm text-gray-700 px-6">{completedOrders}</div>
        <div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${
              user.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {user.status === "active" ? "Hoạt động" : "Tạm ngưng"}
          </span>
        </div>

        <div className="text-center">
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-md transition inline-flex items-center justify-center"
            onClick={() => {
              setSelectedUser(user);
              setShowModal(true);
            }}
          >
            <i className="bx bx-pencil text-lg" />
          </button>
        </div>
      </div>
    );
  })}
</div>


           {/* Phân trang */}
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
      
          {/* Modal thêm/sửa */}
        <UserModal
            isOpen={showModal}
            onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
            }}
            onSave={handleSave}
            initialData={selectedUser}
        />
        </section>
      );    
}
