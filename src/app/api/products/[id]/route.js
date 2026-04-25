import { NextResponse } from "next/server";
import mongoose from "mongoose";

import Product from "@/lib/models/Product";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("GET product error:", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const body = await req.json();
    const { name, price, category, color, fabric, sizes, productDetails, image, images } = body;

    let imageList = Array.isArray(images)
      ? images.filter((u) => typeof u === "string" && u.trim()).map((u) => u.trim())
      : [];

    if (!imageList.length && typeof image === "string" && image.trim()) {
      imageList = [image.trim()];
    }
    imageList = imageList.slice(0, 4);

    if (!name || !price || !category || imageList.length === 0) {
      return NextResponse.json(
        {
          error:
            "All fields required: name, price, category, and at least one image (up to 4)",
        },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        category,
        color: color?.trim() || undefined,
        fabric: fabric?.trim() || undefined,
        sizes: Array.isArray(sizes) ? sizes.filter(s => s.trim()).map(s => s.trim()) : [],
        productDetails: productDetails?.trim() || undefined,
        image: imageList[0],
        images: imageList,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    // 2. Await params (Required in newer Next.js versions)
    const { id } = await params; 

    console.log("ID to delete:", id);

    if (!id) {
      return NextResponse.json(
        { error: "ID not found in params" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}


