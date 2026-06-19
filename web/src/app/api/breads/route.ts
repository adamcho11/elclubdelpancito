import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const breads = await prisma.bread.findMany({ orderBy: { name: "asc" } })
    return NextResponse.json(breads)
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
