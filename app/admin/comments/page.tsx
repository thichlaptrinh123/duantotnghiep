"use client";

import { useState, useMemo } from "react";
import SearchInput from "../components/shared/search-input";
import StatusFilter from "../components/shared/status-filter";
import Pagination from "../components/shared/pagination";
import CommentTable from "../components/shared/comment-table";
import StarFilter from "../components/shared/star-filter";

const dummyComments = [
  {
    id: "1",
    product: "Áo thun nam",
    image: "/images/1.webp",
    user: "Nguyễn Văn A",
    content: "Chất lượng tốt lắm!",
    stars: 5,
    createdAt: "2025-06-15T10:23:00Z",
    status: "active",
  },
  {
    id: "2",
    product: "Quần jeans",
    image: "/images/1.webp", 
    user: "Trần Thị B",
    content: "Vải hơi mỏng nhưng mặc vẫn ổn.",
    stars: 3,
    createdAt: "2025-06-14T14:45:00Z",
    status: "inactive",
  },
  {
    id: "3",
    product: "Áo khoác hoodie",
    image: "/images/1.webp",
    user: "Phạm Văn C",
    content: "Rất ấm và thoải mái!",
    stars: 4,
    createdAt: "2025-06-13T09:10:00Z",
    status: "active",
  },
  {
    id: "4",
    product: "Giày sneaker",
    image: "/images/1.webp",
    user: "Ngô Thị D",
    content: "Chất lượng tuyệt vời, đi rất êm!",
    stars: 5,
    createdAt: "2025-06-12T11:20:00Z",
    status: "active",
  },
  {
    id: "5",
    product: "Balo thời trang",
    image: "/images/1.webp",
    user: "Lê Văn E",
    content: "Nhiều ngăn, tiện lợi.",
    stars: 4,
    createdAt: "2025-06-11T16:05:00Z",
    status: "inactive",
  },
  {
    id: "6",
    product: "Áo len cổ lọ",
    image: "/images/1.webp",
    user: "Hoàng Thị F",
    content: "Hơi ngắn so với mô tả.",
    stars: 2,
    createdAt: "2025-06-10T08:40:00Z",
    status: "active",
  },
];


export default function CommentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterStars, setFilterStars] = useState<"all" | 5 | 4 | 3 | 2 | 1>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [comments, setComments] = useState(dummyComments);
  const perPage = 5;

  const filteredComments = useMemo(() => {
    return comments
      .filter(
        (c) =>
          c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.user.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((c) => filterStatus === "all" || c.status === filterStatus)
      .filter((c) => filterStars === "all" || c.stars === filterStars);
  }, [comments, searchTerm, filterStatus, filterStars]);

  const totalPages = Math.ceil(filteredComments.length / perPage);

  const paginatedComments = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredComments.slice(start, start + perPage);
  }, [filteredComments, currentPage]);

  const toggleStatus = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c
      )
    );
  };

  return (
    <section className="p-4 space-y-6">
      {/* Tiêu đề và bộ lọc */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-h3 font-semibold text-gray-800">Quản lý bình luận</h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <SearchInput
            value={searchTerm}
            placeholder="Tìm kiếm nội dung hoặc người dùng..."
            onChange={setSearchTerm}
          />

          <StatusFilter
            value={filterStatus}
            onChange={(value: string) =>
              setFilterStatus(value as "all" | "active" | "inactive")
            }
            options={[
              { label: "Tất cả trạng thái", value: "all" },
              { label: "Hiển thị", value: "active" },
              { label: "Đã ẩn", value: "inactive" },
            ]}
          />

          <StarFilter
            value={filterStars}
            onChange={(value) => setFilterStars(value)}
          />
        </div>
      </div>

      {/* Danh sách bình luận */}
      <CommentTable data={paginatedComments} onToggleStatus={toggleStatus} />

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}