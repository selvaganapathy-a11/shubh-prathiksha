"use client";

import { useState } from "react";
{/** import Envelope from "../components/Envelope";
import ScratchCard from "../components/ScratchCard";*/}
import SaveTheDate from "@/components/SaveTheDate";
export default function Page() {
  return <SaveTheDate />;
}
{/** 
export default function Home() {
  const [opened, setOpened] = useState(false);

  const openMap = () => {
    window.open(
      "https://www.google.com/maps?q=ITC+Kences+Mahabalipuram",
      "_blank"
    );
  };

  return (
    <>
     
      {!opened ? (
        <Envelope onOpen={() => setOpened(true)} />
      ) : (
        
        <main className="relative min-h-screen flex items-center justify-center">

       
          <div
            className="fixed inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/couple.jpg')",
              backgroundPosition: "center top",
            }}
          />

          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />

          
          <div className="relative z-10 flex flex-col items-center text-center px-6">

            
            <h1 className="text-[28px] md:text-5xl text-[#3b2b2b] mb-2">
              Save The Date
            </h1>

            
            <h2 className="text-[26px] md:text-4xl font-bold text-[#2c1e1e] leading-tight">
              SHUBH
              <span className="block italic text-xl">&</span>
              PRATHIKSHA
            </h2>

            <div className="my-6">
              <ScratchCard />
            </div>

       
            <button
              onClick={openMap}
              className="bg-black text-white px-5 py-2 rounded-full shadow-lg"
            >
              📍 View Location
            </button>

         
            <div className="mt-4 text-[14px] md:text-lg">
              <p className="font-semibold">ITC KENCES,</p>
              <p>Mahabalipuram</p>
            </div>

            
            <p className="mt-3 text-xs italic">
              Formal Invitation to Follow
            </p>

            <p className="mt-1 text-xs tracking-widest">
              *SCRATCH TO REVEAL*
            </p>

          </div>
        </main>
      )}
    </>
  );
}
*/}