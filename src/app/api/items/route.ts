import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const visa = searchParams.get("visa") || "tourist"
  const category = searchParams.get("category")?.toLowerCase()
  
  const client = await clientPromise
  const db = client.db("packabroad")
  
  try {
    let allItems: any[] = []
    
    // If category is "documents", only fetch from documents collection
    if (category?.toLowerCase() === "documents") {
      try {
        const documentsData = await db.collection("documents").find({}).toArray()
        
        // Extract documents based on visa type from the nested structure
        allItems = documentsData.reduce((acc: any[], doc: any) => {
          if (doc.documents_required) {
            let visaKey = ""
            if (visa === "tourist") visaKey = "travel_visa"
            else if (visa === "student") visaKey = "student_visa"
            else if (visa === "work") visaKey = "work_visa"
            
            if (doc.documents_required[visaKey] && Array.isArray(doc.documents_required[visaKey])) {
              // Convert string items to objects with name and sub_category
              const documents = doc.documents_required[visaKey].map((item: string) => ({
                name: item,
                sub_category: "Documents"
              }))
              acc.push(...documents)
            }
          }
          return acc
        }, [])
        
        console.log(`Fetched ${allItems.length} documents for visa type: ${visa}`)
      } catch (docError) {
        console.log("Documents collection not found or empty")
      }
    } else {
      // Fetch from personal collection
      const personalItems = await db.collection("personal").find({}).toArray()
      
      // Fetch from documents collection and filter by visa type
      let documentsItems: any[] = []
      try {
        const documentsData = await db.collection("documents").find({}).toArray()
        
        // Extract documents based on visa type from the nested structure
        documentsItems = documentsData.reduce((acc: any[], doc: any) => {
          if (doc.documents_required) {
            let visaKey = ""
            if (visa === "tourist") visaKey = "travel_visa"
            else if (visa === "student") visaKey = "student_visa"
            else if (visa === "work") visaKey = "work_visa"
            
            if (doc.documents_required[visaKey] && Array.isArray(doc.documents_required[visaKey])) {
              // Convert string items to objects with name and sub_category
              const documents = doc.documents_required[visaKey].map((item: string) => ({
                name: item,
                sub_category: "Documents"
              }))
              acc.push(...documents)
            }
          }
          return acc
        }, [])
      } catch (docError) {
        console.log("Documents collection not found or empty, continuing with personal items only")
      }
      
      // Combine both collections
      allItems = [...personalItems, ...documentsItems]
      console.log(`Fetched ${personalItems.length} personal items and ${documentsItems.length} documents for visa type: ${visa}`)
    }
    
    return NextResponse.json(allItems)
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}
