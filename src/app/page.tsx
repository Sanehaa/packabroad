"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Lottie from "lottie-react";
import animationData from "../../public/New York to Paris (2).json";
import cloudsAnimation from "../../public/clouds.json";

import { ArrowRight, Palette, FolderKanban, CheckCircle } from "lucide-react";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [showClouds, setShowClouds] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const doorTimer = setTimeout(() => setOpen(true), 1500);

    const cloudsTimer = setTimeout(() => setShowClouds(true), 2500);

    const backgroundTimer = setTimeout(() => {
      setShowClouds(false);
      setShowBackground(true);
      setShowContent(true);
    }, 6000);

    return () => {
      clearTimeout(doorTimer);
      clearTimeout(cloudsTimer);
      clearTimeout(backgroundTimer);
    };
  }, []);

  const features = [
    {
      title: "Personalized",
      desc: "Tailored to your country & visa",
      icon: <Palette className="w-8 h-8 text-[#5EBDDC]" />,
    },
    {
      title: "Organized",
      desc: "All essentials in categories",
      icon: <FolderKanban className="w-8 h-8 text-[#D48346]" />,
    },
    {
      title: "Peace of Mind",
      desc: "Never forget what matters",
      icon: <CheckCircle className="w-8 h-8 text-[#AECECE]" />,
    },
  ];

  return (
    <div className={`double-door ${open ? "open" : ""}`}>
      <main className="reveal-screen flex flex-col ">
        <section className="relative h-screen flex items-center justify-center bg-[#00213F] overflow-hidden">
          {showClouds && (
            <div className="absolute inset-0 z-20 bg-[#00213F] w-full h-full">
              <Lottie
                animationData={cloudsAnimation}
                loop={false}
                autoplay={true}
                rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
                style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0 }}
              />
            </div>
          )}

          {showBackground && (
            <div className="absolute inset-0 z-0 bg-[#00213F]">
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div
            className={`relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 transition-opacity duration-1000 ${
              showContent ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="max-w-xl text-left md:pr-10">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                PLAN YOUR <br />
                <span className="whitespace-nowrap">MOVE ABROAD 🧳</span>
              </h1>

              <p className="text-white/90 text-lg mb-8">
                Get a personalized travel checklist with everything you need to
                prepare from documents to daily essentials.
              </p>

              <Link href="/generate-checklist">
                <Button
                  size="lg"
                  className="bg-white text-black text-lg px-8 py-4 rounded-[15px] shadow-lg hover:bg-gray-200 flex items-center gap-2"
                >
                  Get My Checklist
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <div className="grid grid-cols-3 gap-6 mt-10 text-white/90 text-sm">
                {features.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 transition"
                  >
                    <div className="mb-3">{item.icon}</div>
                    <p className="font-semibold">{item.title}</p>
                    <span className="block text-xs text-white/80 text-center mt-1">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

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
