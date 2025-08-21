"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Sparkles, ArrowLeft, CheckCircle2, Circle, Download, Plus, Briefcase, FileText, Globe, Home, BookOpen, CreditCard, Luggage, Heart, Bus, Phone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import jsPDF from "jspdf"
import Lottie from "lottie-react"
import ticketAnimation from "../../../public/ticket.json"
import cloudsAnimation from "../../../public/clouds.json"

const visaCategories = {
  tourist: [
    { name: "Personal", icon: Briefcase, description: "Essential personal items" },
    { name: "Documents", icon: FileText, description: "Important paperwork" },
    { name: "Country Must-Haves", icon: Globe, description: "Country-specific requirements" },
    { name: "Packing Essentials", icon: Luggage, description: "Travel necessities" },
    { name: "Health & Insurance", icon: Heart, description: "Medical and safety" },
    { name: "Transportation", icon: Bus, description: "Getting around" },
    { name: "Emergency Contacts", icon: Phone, description: "Important numbers" },
  ],
  student: [
    { name: "Personal", icon: Briefcase, description: "Essential personal items" },
    { name: "Documents", icon: FileText, description: "Important paperwork" },
    { name: "Country Must-Haves", icon: Globe, description: "Country-specific requirements" },
    { name: "Accommodation", icon: Home, description: "Housing arrangements" },
    { name: "Study Essentials", icon: BookOpen, description: "Academic requirements" },
    { name: "Finance & Banking", icon: CreditCard, description: "Money matters" },
    { name: "Packing Essentials", icon: Luggage, description: "Travel necessities" },
    { name: "Health & Insurance", icon: Heart, description: "Medical and safety" },
    { name: "Transportation", icon: Bus, description: "Getting around" },
    { name: "Emergency Contacts", icon: Phone, description: "Important numbers" },
  ],
  work: [
    { name: "Personal", icon: Briefcase, description: "Essential personal items" },
    { name: "Documents", icon: FileText, description: "Important paperwork" },
    { name: "Country Must-Haves", icon: Globe, description: "Country-specific requirements" },
    { name: "Accommodation", icon: Home, description: "Housing arrangements" },
    { name: "Work Essentials", icon: Briefcase, description: "Professional requirements" },
    { name: "Finance & Banking", icon: CreditCard, description: "Money matters" },
    { name: "Packing Essentials", icon: Luggage, description: "Travel necessities" },
    { name: "Health & Insurance", icon: Heart, description: "Medical and safety" },
    { name: "Transportation", icon: Bus, description: "Getting around" },
    { name: "Emergency Contacts", icon: Phone, description: "Important numbers" },
  ],
}

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
  const [items, setItems] = useState<GroupedItems[]>([])
  const [loading, setLoading] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const [customItems, setCustomItems] = useState<{ [category: string]: string[] }>({})
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItemText, setNewItemText] = useState("")
  const [selectedCategoryForItem, setSelectedCategoryForItem] = useState("")
  const [showAddItemForCategory, setShowAddItemForCategory] = useState<{ [category: string]: boolean }>({})
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!selectedCategory) return
    const fetchItems = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/items`)
        const data = await res.json()

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

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(item)) {
      newChecked.delete(item)
    } else {
      newChecked.add(item)
    }
    setCheckedItems(newChecked)
  }

  const addCustomItem = (category?: string) => {
    const targetCategory = category || selectedCategoryForItem
    if (newItemText.trim() && targetCategory) {
      const updatedCustomItems = { ...customItems }
      if (!updatedCustomItems[targetCategory]) {
        updatedCustomItems[targetCategory] = []
      }
      updatedCustomItems[targetCategory].push(newItemText.trim())
      setCustomItems(updatedCustomItems)
      
      const newChecked = new Set(checkedItems)
      newChecked.add(newItemText.trim())
      setCheckedItems(newChecked)
      
      setNewItemText("")
      setShowAddItem(false)
      setSelectedCategoryForItem("")
      
      if (category) {
        const updatedShowAddItemForCategory = { ...showAddItemForCategory }
        updatedShowAddItemForCategory[category] = false
        setShowAddItemForCategory(updatedShowAddItemForCategory)
      }
    }
  }

  const toggleAddItemForCategory = (category: string) => {
    const updatedShowAddItemForCategory = { ...showAddItemForCategory }
    updatedShowAddItemForCategory[category] = !updatedShowAddItemForCategory[category]
    setShowAddItemForCategory(updatedShowAddItemForCategory)
  }

  const removeCustomItem = (category: string, item: string) => {
    const updatedCustomItems = { ...customItems }
    updatedCustomItems[category] = updatedCustomItems[category].filter(i => i !== item)
    if (updatedCustomItems[category].length === 0) {
      delete updatedCustomItems[category]
    }
    setCustomItems(updatedCustomItems)
  }

  const toggleCustomItem = (item: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(item)) {
      newChecked.delete(item)
    } else {
      newChecked.add(item)
    }
    setCheckedItems(newChecked)
  }

  const checkedCount = checkedItems.size
  const totalItems = items.reduce((sum, group) => sum + group.items.length, 0)

  const generatePDF = async () => {
    if (checkedItems.size === 0) return
    
    setGeneratingPdf(true)
    try {
      const pdf = new jsPDF()
      
      pdf.setFont("helvetica")
      
      pdf.setFontSize(24)
      pdf.setTextColor(44, 62, 80)
      pdf.text(`${selectedCategory} Checklist`, 20, 30)
      
      pdf.setFontSize(14)
      pdf.setTextColor(52, 73, 94)
      pdf.text(`${visa.charAt(0).toUpperCase() + visa.slice(1)} Visa for ${country}`, 20, 45)
      pdf.text(`Duration: ${days} days | Date: ${new Date().toLocaleDateString()}`, 20, 55)
      
      pdf.setFontSize(12)
      pdf.setTextColor(149, 165, 166)
      pdf.text(`Selected: ${checkedItems.size} of ${totalItems} items`, 20, 70)
      
      pdf.setDrawColor(52, 73, 94)
      pdf.line(20, 80, 190, 80)
      
      let yPosition = 100
      
      const selectedItemsByCategory: { [key: string]: string[] } = {}
      
      items.forEach(group => {
        const categoryName = group.sub
        const selectedInCategory = group.items.filter(item => checkedItems.has(item))
        if (selectedInCategory.length > 0) {
          selectedItemsByCategory[categoryName] = selectedInCategory
        }
      })
      
      Object.entries(customItems).forEach(([category, categoryItems]) => {
        const selectedCustomItems = categoryItems.filter(item => checkedItems.has(item))
        if (selectedCustomItems.length > 0) {
          if (selectedItemsByCategory[category]) {
            selectedItemsByCategory[category] = [...selectedItemsByCategory[category], ...selectedCustomItems]
          } else {
            selectedItemsByCategory[category] = selectedCustomItems
          }
        }
      })
      
      Object.entries(selectedItemsByCategory).forEach(([category, categoryItems]) => {
        pdf.setFontSize(16)
        pdf.setTextColor(41, 128, 185)
        pdf.setFont("helvetica", "bold")
        pdf.text(category, 20, yPosition)
        yPosition += 15
        
        pdf.setFontSize(12)
        pdf.setTextColor(44, 62, 80)
        pdf.setFont("helvetica", "normal")
        
        categoryItems.forEach(item => {
          if (yPosition > 270) {
            pdf.addPage()
            yPosition = 30
          }
          
          pdf.text(`• ${item}`, 25, yPosition)
          yPosition += 8
        })
        
        yPosition += 10 
      })
      
      pdf.save(`${selectedCategory}_checklist_${country}_${new Date().toISOString().split('T')[0]}.pdf`)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setGeneratingPdf(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#00213F]">
<div className="absolute inset-0 z-10 opacity-30">
  <Lottie
    animationData={cloudsAnimation}
    loop={true}
    autoplay={true}
    rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
    style={{ width: "100%", height: "100%" }}
  />
</div>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">

      
             <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4">
                 <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-6"
         >
           <div className="flex items-center justify-center">
             <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
               {visa.charAt(0).toUpperCase() + visa.slice(1)} Visa Checklist
             </h1>
             <div className="w-64 h-64 mb-10">
               <Lottie 
                 animationData={ticketAnimation} 
                 loop={true}
                 autoplay={true}
                 style={{ width: '100%', height: '100%' }}
               />
             </div>
           </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-blue-200">Moving to</span>
            <span className="font-semibold text-white">{country}</span>
            <span className="text-blue-200">for {days} days</span>
            <span className="text-xl">✈️</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    onClick={() => setSelectedCategory(cat.name)}
                    className="group relative p-6 text-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                                           <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                       <cat.icon className="w-12 h-12 text-white" />
                     </div>
                      <h3 className="font-semibold text-white text-lg mb-2 tracking-wide">
                        {cat.name}
                      </h3>
                      <p className="text-blue-200 text-sm opacity-80">
                        {cat.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="sidebar"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row gap-8"
            >
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6 h-fit">
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <ArrowLeft className="text-white" size={20} />
                    </button>
                    <h2 className="font-bold text-white text-xl">
                      Categories
                    </h2>
                  </div>
                  
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <Card
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                          selectedCategory === cat.name
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-blue-400"
                            : "bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <cat.icon className="w-6 h-6 text-white" />
                          <div className="text-left">
                            <div className="font-medium text-sm">{cat.name}</div>
                            <div className="text-xs opacity-70">{cat.description}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

             <motion.div
  key={selectedCategory}
  initial={{ x: 40, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: 40, opacity: 0 }}
  transition={{ duration: 0.5 }}
  className="flex-1"
>
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8 flex flex-col h-[75vh]">
     <div className="flex items-center justify-between mb-6 flex-shrink-0">
       <h2 className="text-3xl font-bold text-white">
         {selectedCategory} Checklist
       </h2>
       <div className="flex items-center gap-4">
         {totalItems > 0 && (
           <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
             <span className="text-blue-200 text-sm">Progress</span>
             <span className="text-white font-semibold">
               {checkedCount}/{totalItems}
             </span>
           </div>
         )}
         <button
           onClick={generatePDF}
           disabled={checkedItems.size === 0 || generatingPdf}
           className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
             checkedItems.size > 0 && !generatingPdf
               ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
               : 'bg-white/10 text-white/50 cursor-not-allowed'
           }`}
         >
           <Download size={18} />
           <span className="text-sm font-medium">
             {generatingPdf ? 'Generating...' : 'Save PDF'}
           </span>
         </button>
       </div>
     </div>

     <div className="overflow-y-auto pr-2 space-y-6 flex-1">
       {loading ? (
         <div className="flex items-center justify-center py-12">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
         </div>
       ) : (
         <>
           {items.map((group, idx) => (
             <motion.div
               key={`${group.sub}-${idx}`}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
             >
               <h3 className="font-semibold text-white mb-4 text-lg flex items-center gap-2">
                 <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                 {group.sub}
               </h3>
               <div className="space-y-3">
                 {group.items.map((item) => (
                   <motion.div
                     key={item}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                     onClick={() => toggleItem(item)}
                   >
                     {checkedItems.has(item) ? (
                       <CheckCircle2 className="text-green-400 flex-shrink-0" size={20} />
                     ) : (
                       <Circle className="text-white/40 flex-shrink-0" size={20} />
                     )}
                     <span className={`text-white ${checkedItems.has(item) ? 'line-through opacity-60' : ''}`}>
                       {item}
                     </span>
                   </motion.div>
                 ))}
                 
                 {customItems[group.sub] && customItems[group.sub].map((item, customIdx) => (
                   <motion.div
                     key={`custom-${group.sub}-${item}-${customIdx}`}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group border-l-2 border-green-400/50"
                   >
                     <div 
                       className="flex items-center gap-3 cursor-pointer flex-1"
                       onClick={() => toggleCustomItem(item)}
                     >
                       {checkedItems.has(item) ? (
                         <CheckCircle2 className="text-green-400 flex-shrink-0" size={20} />
                       ) : (
                         <Circle className="text-white/40 flex-shrink-0" size={20} />
                       )}
                       <span className={`text-white ${checkedItems.has(item) ? 'line-through opacity-60' : ''}`}>
                         {item}
                       </span>
                       <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Custom</span>
                     </div>
                     <button
                       onClick={() => removeCustomItem(group.sub, item)}
                       className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 p-1"
                     >
                       ×
                     </button>
                   </motion.div>
                 ))}
                 
                 {showAddItemForCategory[group.sub] && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: "auto" }}
                     exit={{ opacity: 0, height: 0 }}
                     className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10"
                   >
                     <div className="flex gap-2">
                       <input
                         type="text"
                         value={newItemText}
                         onChange={(e) => setNewItemText(e.target.value)}
                         placeholder="Enter custom item..."
                         className="flex-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 text-sm"
                         onKeyPress={(e) => e.key === 'Enter' && addCustomItem(group.sub)}
                       />
                       <button
                         onClick={() => addCustomItem(group.sub)}
                         disabled={!newItemText.trim()}
                         className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                           newItemText.trim()
                             ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                             : 'bg-white/10 text-white/50 cursor-not-allowed'
                         }`}
                       >
                         Add
                       </button>
                       <button
                         onClick={() => toggleAddItemForCategory(group.sub)}
                         className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm"
                       >
                         Cancel
                       </button>
                     </div>
                   </motion.div>
                 )}
                 
                 {!showAddItemForCategory[group.sub] && (
                   <button
                     onClick={() => toggleAddItemForCategory(group.sub)}
                     className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-white/40 transition-colors text-white/70 hover:text-white text-sm"
                   >
                     <Plus size={16} />
                     <span>Add Custom Item</span>
                   </button>
                 )}
               </div>
             </motion.div>
           ))}
           

           

         </>
       )}
     </div>
  </div>
</motion.div>

            </motion.div>
          )}
                 </AnimatePresence>
       </main>
       
       <AnimatePresence>
         {showAddItem && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             onClick={() => setShowAddItem(false)}
           >
             <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 w-full max-w-md"
               onClick={(e) => e.stopPropagation()}
             >
               <h3 className="text-xl font-bold text-white mb-4">Add Custom Item</h3>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-blue-200 mb-2">
                     Category
                   </label>
                   <select
                     value={selectedCategoryForItem}
                     onChange={(e) => setSelectedCategoryForItem(e.target.value)}
                     className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
                   >
                     <option value="">Select a category</option>
                     {items.map((group) => (
                       <option key={group.sub} value={group.sub}>
                         {group.sub}
                       </option>
                     ))}
                   </select>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-blue-200 mb-2">
                     Item Name
                   </label>
                   <input
                     type="text"
                     value={newItemText}
                     onChange={(e) => setNewItemText(e.target.value)}
                     placeholder="Enter item name..."
                     className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                     onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
                   />
                 </div>
                 
                 <div className="flex gap-3 pt-4">
                   <button
                     onClick={() => setShowAddItem(false)}
                     className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     onClick={() => addCustomItem()}
                     disabled={!newItemText.trim() || !selectedCategoryForItem}
                     className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                       newItemText.trim() && selectedCategoryForItem
                         ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                         : 'bg-white/10 text-white/50 cursor-not-allowed'
                     }`}
                   >
                     Add Item
                   </button>
                 </div>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
     </div>
   )
 }