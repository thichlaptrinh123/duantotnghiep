"use client";
import { useEffect, useState } from "react";
import style from "../css/layout.module.css";
import { getAllCategories } from "../lib/api_categories"; // import API
import type { Category } from "../lib/api_categories"; // import interface

export default function Nav() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <nav className={style.nav}>
      <ul>
        <li><a href="/">Trang Chủ</a></li>
        <li>
          <a href="#">Sản Phẩm</a>
          <ul>
            {categories.map((cat) => (
              <li key={cat._id}>
                <a href={`/category/${cat._id}`}>{cat.name}</a>
              </li>
            ))}
          </ul>
        </li>
        <li><a href="">Liên Hệ</a></li>
        <li><a href="/about">Giới Thiệu</a></li>
      </ul>
    </nav>
  );
}
