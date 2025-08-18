"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const visaCategories = {
  tourist: [
    { name: "Personal", emoji: "🎒" },
    { name: "Documents", emoji: "📄" },
    { name: "Country Must-Haves", emoji: "🌍" },
    { name: "Packing Essentials", emoji: "🧳" },
    { name: "Health & Insurance", emoji: "💊" },
    { name: "Transportation", emoji: "🚌" },
    { name: "Emergency Contacts", emoji: "📞" },
  ],
  student: [
    { name: "Personal", emoji: "🎒" },
    { name: "Documents", emoji: "📄" },
    { name: "Country Must-Haves", emoji: "🌍" },
    { name: "Accommodation", emoji: "🏠" },
    { name: "Study Essentials", emoji: "📚" },
    { name: "Finance & Banking", emoji: "💳" },
    { name: "Packing Essentials", emoji: "🧳" },
    { name: "Health & Insurance", emoji: "💊" },
    { name: "Transportation", emoji: "🚌" },
    { name: "Emergency Contacts", emoji: "📞" },
  ],
  work: [
    { name: "Personal", emoji: "🎒" },
    { name: "Documents", emoji: "📄" },
    { name: "Country Must-Haves", emoji: "🌍" },
    { name: "Accommodation", emoji: "🏠" },
    { name: "Work Essentials", emoji: "💼" },
    { name: "Finance & Banking", emoji: "💳" },
    { name: "Packing Essentials", emoji: "🧳" },
    { name: "Health & Insurance", emoji: "💊" },
    { name: "Transportation", emoji: "🚌" },
    { name: "Emergency Contacts", emoji: "📞" },
  ],
}

// ✅ Define correct type for items
type GroupedItems = {
  sub: string
  items: string[]
}

export default function CategoriesPage() {
  const searchParams = useSearchParams()
  const visa = searchParams.get("visa") || "tourist"
  const country = searchParams.get("country")
  const days = searchParams.get("days")

  const categories = visaCategories[visa as keyof typeof visaCategories] || []
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [items, setItems] = useState<GroupedItems[]>([]) // ✅ fixed typing
  const [loading, setLoading] = useState(false)

  // Fetch items when a category is selected
  useEffect(() => {
    if (!selectedCategory) return
    const fetchItems = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/items`)
        const data = await res.json()

        // reshape db result -> { sub: "Hair", items: ["Shampoo", "Conditioner"] }
        const grouped = data.reduce((acc: any, curr: any) => {
          const sub = curr.sub_category || "General"
          if (!acc[sub]) acc[sub] = []
          acc[sub].push(curr.name)
          return acc
        }, {})

        const formatted: GroupedItems[] = Object.entries(grouped).map(
          ([sub, items]) => ({
            sub,
            items: items as string[],
          })
        )

        setItems(formatted)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [selectedCategory])

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <Sparkles className="mx-auto mb-3 text-pink-400" size={28} />
        <h1 className="text-3xl font-serif text-pink-600">
          Your {visa.charAt(0).toUpperCase() + visa.slice(1)} Visa Checklist
        </h1>
        <p className="text-sm text-gray-500 italic">
          Moving to {country} for {days} days ✈️💖
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          // 🔹 Initial Grid View
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-6"
          >
            {categories.map((cat) => (
              <Card
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="p-6 text-center rounded-2xl bg-pink-50 hover:bg-pink-100 shadow-sm cursor-pointer transition-all"
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <p className="font-medium text-pink-700">{cat.name}</p>
              </Card>
            ))}
          </motion.div>
        ) : (
          // 🔹 Sidebar + Checklist Layout
          <motion.div
            key="sidebar"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex gap-6"
          >
            {/* Sidebar */}
            <div className="w-1/3 sm:w-1/4 bg-pink-50 rounded-2xl shadow-sm p-4 h-[500px] overflow-y-auto">
              <h2 className="font-semibold text-pink-700 mb-4 text-center">
                Categories
              </h2>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <Card
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`p-4 text-center rounded-xl cursor-pointer transition-all ${
                      selectedCategory === cat.name
                        ? "bg-pink-200 shadow-md border border-pink-400"
                        : "bg-white hover:bg-pink-100"
                    }`}
                  >
                    <div className="text-2xl">{cat.emoji}</div>
                    <p className="font-medium text-pink-700 text-sm">
                      {cat.name}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Checklist */}
            <motion.div
              key={selectedCategory}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 bg-white rounded-2xl shadow p-6 h-[500px] overflow-y-auto"
            >
              <h2 className="text-xl font-semibold mb-4 text-pink-700">
                {selectedCategory} Checklist
              </h2>

              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <div className="space-y-6">
                  {items.map((group, idx) => (
                    <div
                      key={`${group.sub}-${idx}`} // ✅ fixed key
                      className="bg-pink-50 p-4 rounded-xl shadow-sm"
                    >
                      <h3 className="font-medium text-pink-700 mb-2">
                        {group.sub}
                      </h3>
                      <ul className="space-y-2">
                        {group.items.map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <input type="checkbox" className="accent-pink-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
