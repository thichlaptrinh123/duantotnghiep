import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import CategoryType from "@/model/category-type";

// PUT: Cập nhật loại danh mục
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const data = await req.json();
  
    const updated = await CategoryType.findByIdAndUpdate(params.id, data, {
      new: true,
    });
  
    return NextResponse.json(updated);
  }