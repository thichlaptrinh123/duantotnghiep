// app/api/product/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/model/products";

// GET: Lấy sản phẩm theo ID và tăng viewCount
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    // Tăng viewCount trước khi trả dữ liệu
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { $inc: { viewCount: 1 } },
      { new: true } // trả về bản mới đã tăng view
    ).populate("id_category");

    if (!updatedProduct) {
      return NextResponse.json({ message: "Không tìm thấy sản phẩm" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (err) {
    return NextResponse.json(
      { message: "Lỗi khi lấy sản phẩm", error: (err as Error).message },
      { status: 500 }
    );
  }
}


// PUT: Cập nhật sản phẩm
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const update = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      update,
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Không tìm thấy sản phẩm" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (err) {
    return NextResponse.json(
      { message: "Lỗi khi cập nhật", error: (err as Error).message },
      { status: 500 }
    );
  }
}

