// app/api/user/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import { convertRoleToDb } from "@/app/admin/components/user/role-utils";
  
// Lấy danh sách user
export async function GET() {
  await dbConnect();
  try {
    const users = await User.find().sort({ createdAt: -1 });

    const formatted = users.map((u) => ({
      _id: u._id,
      name: u.username,
      email: u.email || "",
      phone: u.phone,
      address: u.address || "",
      role: u.role,
      status: u.status === 1 ? "active" : "inactive",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Lỗi khi lấy user:", error);
    return NextResponse.json(
      { message: "Lỗi khi lấy danh sách user", error },
      { status: 500 }
    );
  }
}

// Tạo mới user
export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();

  try {
    const { name, password, phone, email, role, status, address } = body;

    // Kiểm tra trùng tên hoặc số điện thoại
    const existing = await User.findOne({
      $or: [{ username: name }, { phone }],
    });

    if (existing) {
      const field = existing.username === name ? "Tên người dùng" : "Số điện thoại";
      return NextResponse.json(
        { success: false, message: `${field} đã được sử dụng` },
        { status: 409 }
      );
    }

    console.log("ROLE GỬI TỪ CLIENT:", role);               // 🧪
    console.log("ROLE SAU CONVERT:", convertRoleToDb(role)); // 🧪


    if (!password || !password.trim()) {
        return NextResponse.json(
          { success: false, message: "Vui lòng nhập mật khẩu" },
          { status: 400 }
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      

    const newUser = await User.create({
      username: name,
      password: hashedPassword,
      phone,
      email,
      address,
      role: convertRoleToDb(role), 
      status: status === "active" ? 1 : 0,
    });

    console.log("BODY GỬI:", body);
console.log("PASSWORD:", password);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tạo user" },
      { status: 500 }
    );
  }
}
