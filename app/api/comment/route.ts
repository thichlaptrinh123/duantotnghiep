import { NextResponse } from "next/server";
import { dbConnect } from '../../../../lib/mongodb'
import Comment from '../../../../model/comments'


export async function GET() {
  await dbConnect();
  return NextResponse.json(await Comment.find());
}


export async function POST(req: Request) {
    await dbConnect();
    return NextResponse.json(await Comment.create(await req.json()), { status: 201 });
  }
  