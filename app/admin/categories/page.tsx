'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Pagination from "../components/shared/pagination";
import StatusFilter from '../components/shared/status-filter';
import SearchInput from '../components/shared/search-input';
import CategoryTypeFilter from '../components/shared/category-type-filter';
import Swal from "sweetalert2";
import { toast } from "react-toastify";


interface Category {
  _id: string;
  name: string;
  isActive: boolean;
  typeId: {
    _id: string;
    name: string;
  } | string;
}

interface CategoryType {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [formData, setFormData] = useState({ name: '', status: 'active', typeId: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTypeId, setFilterTypeId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCategories();
    fetchCategoryTypes();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/category');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    }
  };

  const fetchCategoryTypes = async () => {
    try {
      const res = await fetch('/api/category-type');
      const data = await res.json();
      setCategoryTypes(data);
    } catch (error) {
      console.error('Lỗi khi lấy loại danh mục:', error);
    }
  };

  useEffect(() => {
    const matchedType = categoryTypes.find((type) =>
      formData.name.toLowerCase().includes(type.name.toLowerCase())
    );

    if (matchedType && !editingCategory) {
      setFormData((prev) => ({ ...prev, typeId: matchedType._id }));
    }
  }, [formData.name, categoryTypes]);

  const handleEditClick = (id: string) => {
    const category = categories.find((cat) => cat._id === id);
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        status: category.isActive ? 'active' : 'inactive',
        typeId: typeof category.typeId === 'object' ? category.typeId._id : category.typeId,
      });
    }
  };

  const handleCancelEdit = () => {
    // Hủy chỉnh sửa → reset lại form
    setEditingCategory(null);
    setFormData({ name: '', status: 'active', typeId: '' });
  };
  
  const handleAddOrUpdate = async () => {
    const trimmedName = formData.name.trim();
    const nameLower = trimmedName.toLowerCase();
  
    // Kiểm tra tên danh mục có bị bỏ trống không
    if (!trimmedName) {
      toast.warning("Vui lòng nhập tên danh mục!");
      return;
    }
  
    // Không cho trùng 100% với tên loại danh mục
    const exactMatchType = categoryTypes.find(
      (type) => type.name.toLowerCase() === nameLower
    );
    if (exactMatchType) {
      toast.error("Tên danh mục không được trùng hoàn toàn với tên loại danh mục!");
      return;
    }
  
    // Kiểm tra xem tên có chứa tên loại danh mục nào không → xác định loại phù hợp
    const matchedType = categoryTypes.find((type) =>
      nameLower.includes(type.name.toLowerCase())
    );
  
    // Nếu không khớp loại nào → hỏi người dùng có muốn tạo loại danh mục mới không
    if (!matchedType) {
      const confirmResult = await Swal.fire({
        title: "Tạo loại danh mục mới?",
        text: "Tên này chưa có loại danh mục. Bạn có muốn tạo loại danh mục mới không?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Tạo mới",
        cancelButtonText: "Hủy",
      });
  
      if (!confirmResult.isConfirmed) return;
  
      // Gửi yêu cầu tạo loại danh mục mới
      const res = await fetch("/api/category-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, isActive: true }),
      });
  
      // Nếu lỗi → hiển thị cảnh báo
      if (!res.ok) {
        const err = await res.json();
        Swal.fire({
          icon: "error",
          title: "Không thành công",
          text: err.message || "Tạo loại danh mục thất bại!",
        });
        return;
      }
  
      // Cập nhật danh sách loại danh mục sau khi tạo
      await fetchCategoryTypes();
      setFormData({ name: "", status: "active", typeId: "" });
  
      toast.success("Đã tạo loại danh mục mới.");
      return; // ❌ Không tạo danh mục ngay lúc này
    }
  
    // Nếu có loại khớp → tiến hành thêm hoặc cập nhật danh mục
    const body = {
      name: trimmedName,
      isActive: formData.status === "active",
      typeId: matchedType._id,
    };
  
    try {
      let res;
  
      // Nếu đang chỉnh sửa → gọi PUT
      if (editingCategory) {
        res = await fetch(`/api/category/${editingCategory._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        // Nếu đang thêm mới → gọi POST
        res = await fetch("/api/category", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
  
      // Kiểm tra lỗi từ server
      if (!res.ok) {
        const err = await res.json();
        Swal.fire({
          icon: "error",
          title: "Không thành công",
          text:
            err.message ||
            (editingCategory
              ? "Cập nhật danh mục thất bại!"
              : "Thêm danh mục thất bại!"),
        });
        return;
      }
  
      // Nếu thành công → hiển thị thông báo
      toast.success(
        editingCategory
          ? "Cập nhật danh mục thành công!"
          : "Thêm danh mục mới thành công!"
      );
  
      // Làm mới dữ liệu và form
      await fetchCategories();
      await fetchCategoryTypes();
      setFormData({ name: "", status: "active", typeId: "" });
      setEditingCategory(null);
    } catch (error) {
      console.error("Lỗi xử lý danh mục:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi hệ thống",
        text: "Không thể xử lý danh mục. Vui lòng thử lại sau.",
      });
    }
  };
  

  const getFilteredCategories = () => {
    return categories.filter((cat) => {
      const matchSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && cat.isActive) ||
        (filterStatus === "inactive" && !cat.isActive);
      const matchType =
        filterTypeId === "all" ||
        (typeof cat.typeId === "object"
          ? cat.typeId._id === filterTypeId
          : cat.typeId === filterTypeId);
      return matchSearch && matchStatus && matchType;
    });
  };

  const filteredCategories = getFilteredCategories();
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const ITEMS_PER_PAGE = 5;

      
      
    return (
        <div className="p-6 space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-h3 font-semibold text-gray-800">Quản lý danh mục</h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <SearchInput
            value={searchTerm}
            placeholder="Tìm kiếm danh mục..."
            onChange={setSearchTerm}
            />
            <StatusFilter
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
            options={[
                { label: "Tất cả trạng thái", value: "all" },
                { label: "Đang hoạt động", value: "active" },
                { label: "Ngưng hoạt động", value: "inactive" },
            ]}
            />
            <CategoryTypeFilter
            value={filterTypeId}
            onChange={(val) => setFilterTypeId(val)}
            options={[
                { label: "Tất cả loại", value: "all" },
                ...categoryTypes.map((type) => ({
                label: type.name,
                value: type._id,
                })),
            ]}
            />
        </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-xl shadow space-y-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">
                {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
            </h2>

            <div>
                <label className="block text-sm font-medium mb-1">Tên danh mục</label>
                <input
                type="text"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#960130]"
                placeholder="VD: Áo sơ mi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            {!categoryTypes.some((type) =>
            formData.name.toLowerCase().includes(type.name.toLowerCase())
            ) && (
            <div>
                <label className="block text-sm font-medium mb-1">Loại danh mục</label>
                <select
                value={formData.typeId}
                onChange={(e) =>
                    setFormData({ ...formData, typeId: e.target.value })
                }
                className="w-full border border-gray-300 px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#960130]"
                >
                <option value="">-- Chọn loại --</option>
                {categoryTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                    {type.name}
                    </option>
                ))}
                </select>
            </div>
            )}


            {editingCategory && (
                <div>
                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                   className="w-full border border-gray-300 px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#960130]"
                >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm ngưng</option>
                </select>
                </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
            {editingCategory && (
                <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm bg-gray-100 border rounded-md hover:bg-gray-200"
                >
                Đóng
                </button>
            )}
            <button
                onClick={handleAddOrUpdate}
                className="px-4 py-2 text-sm bg-[#960130] text-white rounded-md hover:bg-[#B3123D]"
            >
                {editingCategory ? 'Cập nhật danh mục' : '+ Thêm danh mục'}
            </button>
            </div>
            </div>

            {/* Bảng danh mục */}
            <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow p-4 space-y-3">
                <h1 className="text-lg font-semibold mb-4">Danh sách danh mục</h1>
                <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-gray-700 px-2 py-2 bg-[#F9F9F9] rounded-md">
                <div>STT</div>
                <div>Tên danh mục</div>
                <div>Loại danh mục</div>
                <div className="text-center">Trạng thái</div>
                <div className="text-center">Thao tác</div>
                </div>


                {paginatedCategories.map((item, index) => {
  const statusClass = clsx(
    'text-xs font-semibold px-3 py-1 rounded-full inline-block',
    item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
  );
  const displayStatus = item.isActive ? 'Hoạt động' : 'Tạm ngưng';
  const stt = index + 1 + (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div
      key={item._id}
      className="grid grid-cols-5 gap-4 items-center px-2 py-3 border-b border-gray-200"
    >
      <div className="text-sm text-gray-700">{stt}</div>
      <div className="text-sm text-gray-700">{item.name}</div>
      <div className="text-sm text-gray-700">
        {typeof item.typeId === "object" ? item.typeId?.name : "—"}
      </div>
      <div className="text-center">
        <span className={statusClass}>{displayStatus}</span>
      </div>
      <div className="text-center">
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-md transition inline-flex items-center justify-center"
          onClick={() => handleEditClick(item._id)}
        >
          <i className="bx bx-pencil text-lg" />
        </button>
      </div>
    </div>
  );
})}

                
            </div>
            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            />
            </div>



        </div>
        </div>
    );
    }
