"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const [open, setOpen] = useState(false);

  // Auto-open doors after 1.5s
  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`double-door ${open ? "open" : ""}`}>
      {/* Content behind the doors */}
      <main className="reveal-screen flex flex-col">
        {/* Hero */}
        <section className="relative h-screen flex items-center justify-center bg-[#7b1e20]">
          <div className="absolute inset-0"></div>

          <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
            {/* Left Text */}
            <div className="max-w-xl text-left md:pr-10">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                PLAN YOUR <br /> MOVE ABROAD
              </h1>
              <p className="text-white/90 text-lg mb-8">
                Get a personalized travel checklist with everything you need to
                prepare — from documents to daily essentials.
              </p>
              <Link href="/generate-checklist">
                <Button
                  size="lg"
                  className="bg-white text-black text-lg px-8 py-4 rounded-full shadow-lg hover:bg-gray-200"
                >
                  Get My Checklist
                </Button>
              </Link>

              {/* Benefits row */}
              <div className="grid grid-cols-3 gap-4 mt-10 text-white/90 text-sm">
                <div className="text-center">
                  <p className="font-semibold">Personalized</p>
                  <span className="block text-xs">
                    Tailored to your country & visa
                  </span>
                </div>
                <div className="text-center">
                  <p className="font-semibold">Organized</p>
                  <span className="block text-xs">
                    All essentials in categories
                  </span>
                </div>
                <div className="text-center">
                  <p className="font-semibold">Peace of Mind</p>
                  <span className="block text-xs">
                    Never forget what matters
                  </span>
                </div>
              </div>
            </div>

            {/* Right Checklist Preview */}
            <div className="relative mt-10 md:mt-0">
              <img
                src="/checklist-preview.png"
                alt="Checklist preview"
                className="w-[300px] md:w-[380px] rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 right-0 bg-white rounded-xl p-4 shadow-xl">
                <h3 className="font-bold text-base">Essential Travel Checklist</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Includes documents, packing, health, and more.
                </p>
                <span className="font-semibold text-lg">Free</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories styled like product cards */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Everything You Need, Organized
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Documents & Admin",
                  desc: "Visas, insurance, and contracts.",
                },
                {
                  title: "Finances",
                  desc: "Banking, cards, and budgeting tools.",
                },
                {
                  title: "Health & Insurance",
                  desc: "Coverage, medicines, and emergency info.",
                },
                {
                  title: "Packing Essentials",
                  desc: "Clothing, electronics, and adapters.",
                },
                {
                  title: "Local Must-Haves",
                  desc: "Registrations, SIM cards, transport passes.",
                },
                {
                  title: "First Week Setup",
                  desc: "Groceries, orientation, and settling in.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition cursor-pointer"
                >
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-[#f5f5f5] text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Plan Your Journey?
          </h2>
          <Button size="lg" className="px-8 py-4 text-lg">
            Start Checklist
          </Button>
        </section>
      </main>

      {/* Doors */}
      <div className="door left-door" />
      <div className="door right-door" />

      <style jsx>{`
        .double-door {
          position: relative;
          width: 100%;
          height: 100vh;
          perspective: 2000px;
          overflow: hidden;
          background: black;
        }
        .reveal-screen {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow-y: auto;
        }
        .door {
          position: absolute;
          width: 50%;
          height: 100%;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          transform-style: preserve-3d;
          transition: transform 1.5s ease;
          z-index: 1;
        }
        .left-door {
          left: 0;
          background-image: url("left.png");
          transform-origin: left center;
        }
        .right-door {
          right: 0;
          background-image: url("right.png");
          transform-origin: right center;
        }
        .double-door.open .left-door {
          transform: rotateY(120deg);
        }
        .double-door.open .right-door {
          transform: rotateY(-120deg);
        }
      `}</style>
    </div>
  );
}
