  // "use client";

  // import React from "react";
  // import clsx from "clsx";

  // interface Category {
  //   _id: string;
  //   name: string;
  //   isActive: boolean;
  //   typeId?: {
  //     _id: string;
  //     name: string;
  //     isActive?: boolean;
  //   } | string;
  // }

  // interface Props {
  //   data: Category[];
  //   onEdit?: (id: string) => void;
  // }

  // export default function CategoryTable({ data, onEdit }: Props) {
  //   return (
  //     <div className="bg-white rounded-xl shadow p-4 space-y-3">
  //       <h1 className="text-lg font-semibold mb-4">Danh sách tên danh mục</h1>

  //       {/* Header */}
  //       <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-gray-700 px-2 py-2 bg-[#F9F9F9] rounded-md">
  //       <div>STT</div>
  //       <div>Tên danh mục</div>
  //       <div>Loại danh mục</div>
  //       <div className="text-center">Trạng thái</div>
  //       <div className="text-center">Thao tác</div>
  //     </div>


  //       {/* Danh sách */}
  //       {data.map((item, index) => {
  //         const statusClass = clsx(
  //           "text-xs font-semibold px-3 py-1 rounded-full inline-block",
  //           item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
  //         );

  //         const displayStatus = item.isActive ? "ĐANG HOẠT ĐỘNG" : "TẠM NGƯNG";

  //         return (
  //           <div
  //           key={item._id}
  //           className="grid grid-cols-5 gap-4 items-center px-2 py-3 border-b border-gray-200"
  //         >
  //           <div className="text-sm text-gray-700">{index + 1}</div>
  //           <div className="text-sm text-gray-600 line-clamp-2">{item.name}</div>
          
  //           {/* 👉 Cột loại danh mục */}
  //           <div className="text-sm text-gray-700">
  //             {typeof item.typeId === "object" ? item.typeId?.name : "—"}
  //           </div>
          
  //           <div className="text-center">
  //             <span className={statusClass}>{displayStatus}</span>
  //           </div>
          
  //           <div className="text-center">
  //             <button
  //               className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-md transition inline-flex items-center justify-center"
  //               onClick={() => onEdit?.(item._id)}
  //               title="Chỉnh sửa danh mục"
  //             >
  //               <i className="bx bx-pencil text-lg" />
  //             </button>
  //           </div>
  //         </div>
          
  //         );
  //       })}
  //     </div>
  //   );
  // }
