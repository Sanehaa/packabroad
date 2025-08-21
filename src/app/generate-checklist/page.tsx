"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import countryList from "react-select-country-list"
import { useRouter } from "next/navigation"
import Lottie from "lottie-react"
import cloudsAnimation from "../../../public/clouds.json"
import passportAnimation from "../../../public/passport.json"
import hotairballoonAnimation from "../../../public/hotairballoon.json"

export default function MovingFormPage() {
  const [form, setForm] = useState({
    country: "",
    visa: "",
    days: "",
  })
  const [suggestion, setSuggestion] = useState("")
  const [loading, setLoading] = useState(true)

  const countries = useMemo(() => countryList().getData(), [])
  const router = useRouter()

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

const handleContinue = () => {
  if (!form.country || !form.visa || !form.days) {
    setSuggestion("💡 Please fill in all fields for your dreamy move abroad ✈️💖")
  } else {
    router.push(
      `/categories?country=${encodeURIComponent(form.country)}&visa=${encodeURIComponent(form.visa)}&days=${encodeURIComponent(form.days)}`
    )
  }
}


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#00213F]">
        <div className="absolute inset-0">
          <Lottie
            animationData={cloudsAnimation}
            loop={false}
            autoplay
            rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    )
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-[#00213F] relative overflow-hidden">
      <div className="absolute inset-0 flex justify-between items-center pointer-events-none z-0">
        <Lottie animationData={hotairballoonAnimation} loop autoplay className="w-1/3 h-auto" />
        <Lottie animationData={hotairballoonAnimation} loop autoplay className="w-1/3 h-auto" />
      </div>

   <div className="absolute flex justify-center items-center z-0 
                top-1/2 left-1/2 translate-x-26 -translate-y-70 rotate-50">
  <Lottie
    animationData={passportAnimation}
    loop
    autoplay
    className="w-[220px] h-[220px] opacity-70"
  />
</div>


      <div className="relative w-96 bg-[#8B4513] rounded-2xl shadow-2xl p-6 border-4 border-[#5C3317] z-10">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-8 bg-[#5C3317] rounded-t-lg"></div>
        <div className="absolute -bottom-4 left-6 w-6 h-6 bg-[#cf8c17] rounded-full"></div>
        <div className="absolute -bottom-4 right-6 w-6 h-6 bg-[#cf8c17] rounded-full"></div>

        <h2 className="text-2xl font-bold text-center text-white mb-6">Travel Form</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              What visa do you have?
            </label>
            <Select onValueChange={(val) => handleChange("visa", val)}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select visa type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Worker</SelectItem>
<SelectItem value="tourist">Travel</SelectItem>
<SelectItem value="student">Student</SelectItem>

              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              How many days will you stay?
            </label>
            <input
              type="number"
              value={form.days}
              onChange={(e) => handleChange("days", e.target.value)}
              placeholder="e.g., 30"
              className="w-full bg-white text-black rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Where are you moving to?
            </label>
            <Select onValueChange={(val) => handleChange("country", val)}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {countries.map((c) => (
                  <SelectItem key={c.value} value={c.label}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleContinue}
            className="w-full mt-4 bg-[#5C3317] text-white font-semibold py-2 rounded-lg shadow-md hover:bg-[#3d2310] transition"
          >
            Submit
          </Button>

          {suggestion && (
            <p className="text-sm text-yellow-300 text-center mt-2">{suggestion}</p>
          )}
        </form>
      </div>
    </main>
  )
}
