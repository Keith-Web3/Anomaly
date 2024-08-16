'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import starsImg from '../assets/stars.svg'
import whiteRoad from '../assets/road-white.svg'

type AnomalyState = 'idle' | 'detected' | 'none'
function Analysis() {
  const [anomalyState, setAnomalyState] = useState<AnomalyState>('idle')
  const buttonRef = useRef<HTMLButtonElement>(null)

  // useEffect(() => {
  //   const msg = new SpeechSynthesisUtterance('Hello, world!')
  //   speechSynthesis.cancel()
  //   speechSynthesis.speak(msg)
  //   console.log('read message')
  // }, [])

  return (
    <div className="p-6 rounded-3xl shadow-[0_0_60px_#0000001A] bg-white w-max fixed inset-[50%_auto_auto_1em] translate-y-[-50%]">
      <button
        ref={buttonRef}
        className="hidden"
        onClick={() => {
          const msg = new SpeechSynthesisUtterance(
            "Heads up! There's an anomaly 12km away from you."
          )

          msg.pitch = 1.0 // Normal pitch for a balanced tone
          msg.rate = 0.95 // Slightly slower rate to mimic natural speech
          msg.volume = 0.9 // Slightly lower volume for a softer, more natural sound
          msg.lang = 'en-US' // English language (US)

          const voices = window.speechSynthesis.getVoices()
          msg.voice =
            voices.find(
              voice =>
                voice.name.includes('English') && voice.name.includes('Female')
            ) || voices[0]

          speechSynthesis.cancel()
          speechSynthesis.speak(msg)
          console.log('read message')
        }}
      >
        hello world
      </button>
      <h1 className="text-2xl text-black font-medium">
        Prediction and Analysis
      </h1>
      <p className="capitalize mt-6 text-[#262626] font-medium mb-1">
        acceleration
      </p>
      <div className="flex items-center gap-4">
        <label
          htmlFor="x-axis"
          className="text-[#686868] text-sm flex flex-col items-start gap-2"
        >
          x-axis
          <input
            type="number"
            name="x-axis"
            className="border border-[#F1F1F1] rounded px-5 py-3 text-black w-[75px] outline-none"
          />
        </label>
        <label
          htmlFor="y-axis"
          className="text-[#686868] text-sm flex flex-col items-start gap-2"
        >
          y-axis
          <input
            type="number"
            name="y-axis"
            className="border border-[#F1F1F1] rounded px-5 py-3 text-black w-[75px] outline-none"
          />
        </label>
        <label
          htmlFor="z-axis"
          className="text-[#686868] text-sm flex flex-col items-start gap-2"
        >
          z-axis
          <input
            type="number"
            name="z-axis"
            className="border border-[#F1F1F1] rounded px-5 py-3 text-black w-[75px] outline-none"
          />
        </label>
        <p className="text-[#222222] bg-[#EFEFEF] rounded px-4 py-[0.7em] self-end">
          m/s<sup>2</sup>
        </p>
      </div>
      <p className="mt-4 text-[#262626] font-medium mb-1">Angular velocity</p>
      <div className="flex items-center gap-4">
        <label
          htmlFor="x-axis"
          className="text-[#686868] text-sm flex flex-col items-start gap-2"
        >
          x-axis
          <input
            type="number"
            name="x-axis"
            className="border border-[#F1F1F1] rounded px-5 py-3 text-black w-[75px] outline-none"
          />
        </label>
        <label
          htmlFor="y-axis"
          className="text-[#686868] text-sm flex flex-col items-start gap-2"
        >
          y-axis
          <input
            type="number"
            name="y-axis"
            className="border border-[#F1F1F1] rounded px-5 py-3 text-black w-[75px] outline-none"
          />
        </label>
        <label
          htmlFor="z-axis"
          className="text-[#686868] text-sm flex flex-col items-start gap-2"
        >
          z-axis
          <input
            type="number"
            name="z-axis"
            className="border border-[#F1F1F1] rounded px-5 py-3 text-black w-[75px] outline-none"
          />
        </label>
        <p className="text-[#222222] bg-[#EFEFEF] rounded px-4 py-[0.7em] self-end">
          rad/s
        </p>
      </div>
      <button className="flex items-center gap-2 capitalize font-medium bg-[#831DD3] rounded cursor-pointer px-5 py-3 w-full mt-4 justify-center text-white">
        <Image src={starsImg} alt="predict" className="w-6" />
        predict
      </button>
      {anomalyState !== 'idle' && (
        <>
          <div className="h-[2px] bg-[#E1E1E1] my-6" />
          <div>
            <p className="capitalize text-[#262626] text-lg mb-2">result</p>
            {anomalyState === 'detected' ? (
              <div className="text-white bg-[#D91515] p-4 rounded-lg">
                <Image src={whiteRoad} alt="road" className="mx-auto w-10" />
                <p className="font-medium text-center mt-4 text-lg">
                  Anomaly detected!
                </p>
                <p className="text-center text-sm opacity-90">
                  Keep your heads up
                </p>
              </div>
            ) : (
              <div className="text-white bg-[#11940E] p-4 rounded-lg">
                <Image src={whiteRoad} alt="road" className="mx-auto w-10" />
                <p className="font-medium text-center mt-4 text-lg">
                  No anomaly detected!
                </p>
                <p className="text-center text-sm opacity-90">Keep moving</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Analysis
