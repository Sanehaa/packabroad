import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  const client = await clientPromise
  const db = client.db("packabroad") // same name as in URI
  const items = await db.collection("personal").find({}).toArray()
  return NextResponse.json(items)
}
