import { NextResponse } from "next/server";

import Product from "@/lib/models/Product";
import { connectDB } from "@/lib/db";

// ✅ DELETE product

export async function DELETE(req, { params }) { // 1. Destructure params here
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


