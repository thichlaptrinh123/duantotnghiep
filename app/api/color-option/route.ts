import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import ColorOption from "@/model/color-option";

export async function GET() {
  await dbConnect();
  const colors = await ColorOption.find();

  const result = colors.map((item) => ({
    _id: item._id,
    categoryType: item.categoryType,
    values: item.colors, // 👈 FE expect field này là 'values'
    isActive: item.isActive,
  }));

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();

  const created = await ColorOption.create({
    categoryType: body.categoryType,
    colors: body.values, // 👈 FE gửi 'values', map vào 'colors'
    isActive: body.isActive,
  });

  return NextResponse.json({
    _id: created._id,
    categoryType: created.categoryType,
    values: created.colors, // 👈 map lại 'colors' thành 'values'
    isActive: created.isActive,
  });
}
