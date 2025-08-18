import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"  

export async function GET(req: Request, { params }: { params: { category: string } }) {
  const client = await clientPromise
  const db = client.db("packabroad") 
  const collection = db.collection(params.category.toLowerCase()) 

  const items = await collection.find({}).toArray()
  return NextResponse.json(items)
}
