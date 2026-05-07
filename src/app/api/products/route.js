import { NextResponse } from "next/server";
//import { connectDB } from "@/lib/models/db";
import Product from "@/lib/models/Product";
import { connectDB } from "@/lib/db";

// ✅ GET all products
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (err) {
    console.log("GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ✅ ADD product
export async function POST(req) {
  try {
    const body = await req.json();

    const { name, price, category, color, fabric, sellerName, sizes, productDetails, image, images } = body;

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

    await connectDB();

    const product = await Product.create({
      name,
      price,
      category,
      color: color?.trim() || undefined,
      fabric: fabric?.trim() || undefined,
      sellerName: sellerName?.trim() || "Amravati Fashion",
      sizes: Array.isArray(sizes) ? sizes.filter(s => s.trim()).map(s => s.trim()) : [],
      productDetails: productDetails?.trim() || undefined,
      image: imageList[0],
      images: imageList,
    });

    return NextResponse.json({
      success: true,
      product,
    });

  } catch (err) {
    console.log("POST error:", err);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}