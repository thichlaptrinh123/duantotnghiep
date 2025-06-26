import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import CategoryType from "../../../model/category-type";

// GET: Lấy tất cả loại danh mục
export async function GET() {
  await dbConnect();
  const data = await CategoryType.find().sort({ createdAt: -1 });
  return NextResponse.json(data);
}

// POST: Tạo mới loại danh mục
export async function POST(req: Request) {
    await dbConnect();
    const body = await req.json();
  
    // Kiểm tra tên trùng
    const exists = await CategoryType.findOne({ name: body.name });
    if (exists) {
      return NextResponse.json({ message: "Tên loại danh mục đã tồn tại!" }, { status: 400 });
    }
  
    // Gán mặc định trạng thái là hoạt động nếu không có
    if (body.isActive === undefined) body.isActive = true;
  
    const created = await CategoryType.create(body);
    return NextResponse.json(created, { status: 201 });
  }
  