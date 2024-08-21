'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import starsImg from '@/assets/stars.svg'
import whiteRoad from '@/assets/road-white.svg'

type AnomalyState = 'idle' | 'detected' | 'none'
interface AnalysisProps {
  isVoiceMuted: boolean
  userLocation: {
    latitude: number
    longitude: number
  }
}

function Analysis({ isVoiceMuted, userLocation }: AnalysisProps) {
  const [anomalyState, setAnomalyState] = useState<AnomalyState>('idle')
  const [anomalyMessage, setAnomalyMessage] = useState<string>('')
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (anomalyMessage === '') return
    buttonRef.current!.click()
  }, [anomalyMessage])

  return (
    <form className="p-6 rounded-3xl shadow-[0_0_60px_#0000001A] bg-white w-max col-start-1 col-end-2 row-start-1 z-[1] h-max ml-4 my-auto">
      <button
        ref={buttonRef}
        className="hidden"
        type="button"
        onClick={() => {
          if (isVoiceMuted) return
          const msg = new SpeechSynthesisUtterance(anomalyMessage)

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
        <p className="text-[#222222] bg-[#EFEFEF] rounded px-4 py-[0.7em] self-end w-full text-center">
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
        <p className="text-[#222222] bg-[#EFEFEF] rounded px-4 py-[0.7em] self-end w-full text-center">
          rad/s
        </p>
      </div>
      <p className="mt-4 text-[#262626] font-medium mb-1">Temperature</p>
      <div className="flex items-center gap-4">
        <input
          type="number"
          name="temperature"
          className="border border-[#F1F1F1] rounded px-5 py-3 text-black w-[calc(75px + 1em)] outline-none"
        />
        <p className="text-[#222222] text-center bg-[#EFEFEF] rounded px-4 py-[0.8em] self-end w-full">
          &deg;C
        </p>
      </div>
      <p className="mt-4 text-[#262626] font-medium mb-1">Vibration</p>
      <div className="flex items-center gap-4">
        <input
          type="number"
          name="vibration"
          className="border border-[#F1F1F1] rounded px-5 py-3 w-[calc(75px + 1em)] text-black outline-none"
        />
        <p className="text-[#222222] text-center bg-[#EFEFEF] rounded px-4 py-[0.8em] self-end w-full">
          -
        </p>
      </div>
      <p className="mt-4 text-[#262626] font-medium mb-1">
        Longitude and Latitude
      </p>
      <div className="flex items-center gap-4">
        <input
          type="string"
          name="longitude and latitude"
          defaultValue={`${userLocation.longitude} ${userLocation.latitude}`}
          disabled
          className="border border-[#F1F1F1] rounded px-5 py-3 text-black w-[calc(75px + 1em)] cursor-not-allowed outline-none"
        />
        <p className="text-[#222222] text-center bg-[#EFEFEF] rounded px-4 py-[0.8em] self-end w-full">
          &deg;(N/S)
        </p>
      </div>
      <button
        className="flex items-center gap-2 capitalize font-medium bg-[#831DD3] rounded cursor-pointer px-5 py-3 w-full mt-4 justify-center text-white"
        type="submit"
      >
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
      <button
        className="bg-[#831DD3] cursor-pointer fixed inset-[auto_50%_1em_auto] translate-x-1/2 border-none outline-none text-white px-5 py-3 rounded capitalize"
        type="button"
        onClick={() => {
          const isThereAnomaly = Math.random() >= 0.5

          if (isThereAnomaly) {
            const anomalyDistance = (Math.random() * 100).toFixed(1)
            setAnomalyState('detected')
            setAnomalyMessage(
              `There's an upcoming road anomaly ${anomalyDistance}km away from you.`
            )
            return
          }
          setAnomalyState('none')
          setAnomalyMessage(`No anomaly detected, keep moving.`)
        }}
      >
        simulate anomaly
      </button>
    </form>
  )
}

export default Analysis
