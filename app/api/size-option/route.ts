import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import SizeOption from "@/model/size-option";

export async function GET() {
  await dbConnect();
  const sizes = await SizeOption.find();

  // map để đổi 'sizes' thành 'values' cho FE dễ dùng
  const result = sizes.map((item) => ({
    _id: item._id,
    categoryType: item.categoryType,
    values: item.sizes, // 💡 quan trọng: map đúng tên cho FE
    isActive: item.isActive,
  }));

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();

  // Đảm bảo FE gửi lên là 'values', ta chuyển sang 'sizes' khi lưu
  const created = await SizeOption.create({
    categoryType: body.categoryType,
    sizes: body.values,
    isActive: body.isActive,
  });

  return NextResponse.json({
    _id: created._id,
    categoryType: created.categoryType,
    values: created.sizes, // 💡 map ngược lại cho đồng bộ
    isActive: created.isActive,
  });
}
