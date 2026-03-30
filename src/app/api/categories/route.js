import { NextResponse } from "next/server";
import Category from "@/lib/models/Category";
import { connectDB } from "@/lib/db";


// ✅ GET all categories
export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find().sort({ categoryId: 1 });

    return NextResponse.json(categories);
  } catch (err) {
    console.log("GET categories error:", err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// ✅ ADD category
export async function POST(req) {
  try {
    const body = await req.json();

    const { categoryId, categoryName, label } = body;

    if (!categoryId || !categoryName || !label) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    await connectDB();

    const category = await Category.create({
      categoryId,
      categoryName,
      label,
    });

    return NextResponse.json({
      success: true,
      category,
    });

  } catch (err) {
    console.log("POST category error:", err);
    return NextResponse.json(
      { error: "Failed to add category" },
      { status: 500 }
    );
  }
}