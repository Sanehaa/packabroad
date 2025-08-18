"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles } from "lucide-react"
import countryList from "react-select-country-list"
import { useRouter } from "next/navigation"

export default function MovingFormPage() {
  const [form, setForm] = useState({
    country: "",
    visa: "",
    days: "",
  })

  const [suggestion, setSuggestion] = useState("")
  const countries = useMemo(() => countryList().getData(), [])

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

const router = useRouter()

const handleContinue = () => {
  if (!form.country || !form.visa || !form.days) {
    setSuggestion("💡 Please fill in all fields for your dreamy move abroad ✈️💖")
  } else {
    router.push(
      `/categories?country=${encodeURIComponent(form.country)}&visa=${encodeURIComponent(form.visa)}&days=${encodeURIComponent(form.days)}`
    )
  }
}

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 px-4">
      <Card className="max-w-lg w-full rounded-3xl shadow-lg border-0 bg-white/70 backdrop-blur-sm p-6">
        <CardContent className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <Sparkles className="mx-auto mb-3 text-pink-400" size={28} />
            <h1 className="text-3xl font-serif text-pink-600">Plan Your Dreamy Move</h1>
            <p className="text-sm text-gray-500">Just a few details to get started 💌</p>
          </div>

          {/* Country */}
          <Select onValueChange={(v) => handleChange("country", v)}>
            <SelectTrigger className="rounded-full bg-white/80">
              <SelectValue placeholder="Where are you moving to? 🌍" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.value} value={c.label}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Visa */}
          <Select onValueChange={(v) => handleChange("visa", v)}>
            <SelectTrigger className="rounded-full bg-white/80">
              <SelectValue placeholder="What visa do you have? 📜" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student Visa</SelectItem>
              <SelectItem value="work">Work Visa</SelectItem>
              <SelectItem value="tourist">Tourist Visa</SelectItem>
            </SelectContent>
          </Select>

          {/* Days */}
          <Input
            placeholder="How many days will you stay? 🗓️"
            type="number"
            className="rounded-full bg-white/80"
            onChange={(e) => handleChange("days", e.target.value)}
          />

          {/* Suggestion */}
          {suggestion && (
            <div className="text-center text-pink-500 text-sm italic bg-pink-50/70 p-3 rounded-2xl shadow-inner">
              {suggestion}
            </div>
          )}

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            className="w-full rounded-full bg-pink-400 hover:bg-pink-500 text-white shadow-md transition-all"
          >
            Continue ✨
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
