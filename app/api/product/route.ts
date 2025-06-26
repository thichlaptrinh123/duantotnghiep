// app/api/product/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/model/products";

// GET: Lấy tất cả sản phẩm, có populate danh mục
export async function GET() {
  await dbConnect();

  try {
    const products = await Product.find().populate("id_category");
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json(
      { message: "Lỗi khi lấy sản phẩm", error: (err as Error).message },
      { status: 500 }
    );
  }
}

// POST: Tạo sản phẩm mới
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();

    // Kiểm tra bắt buộc
    if (!body.name || !body.id_category || !body.price) {
      return NextResponse.json(
        { message: "Vui lòng cung cấp đầy đủ: name, id_category, price" },
        { status: 400 }
      );
    }

    // Kiểm tra tên trùng
    const existing = await Product.findOne({
      name: { $regex: `^${body.name}$`, $options: "i" },
    });
    console.log("🔍 Đang kiểm tra trùng tên:", body.name);
    
    if (existing) {
      return NextResponse.json(
        { message: "Tên sản phẩm đã tồn tại" },
        { status: 409 }
      );
    }

    // Chuẩn hoá ảnh
    if (!Array.isArray(body.images)) {
      body.images = typeof body.images === "string" ? [body.images] : [];
    }

    const newProduct = await Product.create({
      name: body.name,
      id_category: body.id_category,
      images: body.images,
      // image: body.images[0] || "",
      price: Number(body.price),
      sale: Number(body.sale || 0),
      product_hot: Number(body.product_hot || 0),
      product_new: body.product_new === 1 ? 1 : 0,
      isActive: body.isActive !== false,
      description: body.description || "",
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "Lỗi khi tạo sản phẩm", error: (err as Error).message },
      { status: 500 }
    );
  }
}
