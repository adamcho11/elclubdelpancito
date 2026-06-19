import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { category: "asc" } })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
