'use client'

import React, {
  useEffect,
  useRef,
  useState,
  useReducer,
  Dispatch,
  SetStateAction,
} from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useFormStatus, useFormState } from 'react-dom'

import starsImg from '@/assets/stars.svg'
import whiteRoad from '@/assets/road-white.svg'
import redRoad from '@/assets/road-red.svg'
import cancelImg from '@/assets/cancel.svg'

import { Anomaly } from './MapWrapper'
import { predictAnomaly } from '@/actions'
import LoadingSpinner from './LoadingSpinner'
import toast from 'react-hot-toast'
import Chart from './LineChart'
import { XIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

type AnomalyState = 'idle' | 'detected' | 'none'
interface AnalysisProps {
  isVoiceMuted: boolean
  userLocation: { latitude: number; longitude: number }
  pathAction: (payload: FormData) => void
  setShowAnomalies: Dispatch<SetStateAction<boolean>>
  showAnomalies: boolean
  anomaly?: Anomaly
}

type ActionType =
  | 'Accel_X'
  | 'Accel_Y'
  | 'Accel_Z'
  | 'Anomaly'
  | 'Gyro_X'
  | 'Gyro_Y'
  | 'Gyro_Z'
  | 'Latitude'
  | 'Longitude'
  | 'Vibration'

function reducer(
  state: Anomaly | undefined,
  action:
    | { type: ActionType; payload: string }
    | { type: 'reset-all'; payload: Anomaly }
) {
  if (action.type === 'reset-all') {
    return action.payload
  }
  const anomaly = { ...state }

  anomaly[action.type] = action.payload
  return anomaly as Anomaly | undefined
}

function Analysis({
  isVoiceMuted,
  pathAction,
  anomaly,
  userLocation,
  showAnomalies,
  setShowAnomalies,
}: AnalysisProps) {
  const [anomalyState, setAnomalyState] = useState<AnomalyState>('idle')
  const [anomalyMessage, setAnomalyMessage] = useState<string>('')
  const [isGraphShown, setIsGraphShown] = useState<boolean>(false)
  const [isPathFormShown, setIsPathFormShown] = useState<boolean>(false)
  const [isPredictShown, setIsPredictShown] = useState<boolean>(false)
  const [derivedAnomaly, dispatchAnomaly] = useReducer(reducer, anomaly!)

  const [state, formAction] = useFormState(
    predictAnomaly,
    JSON.stringify({ id: -1 })
  )

  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (anomalyMessage === '') return
    buttonRef.current!.click()
  }, [anomalyMessage])

  useEffect(() => {
    dispatchAnomaly({ type: 'reset-all', payload: anomaly! })
  }, [anomaly?.Latitude, anomaly?.Longitude])

  const anomalyPrediction = JSON.parse(state)
  useEffect(() => {
    if (anomalyPrediction.id === -1) return
    if (anomalyPrediction.error) {
      toast.error(anomalyPrediction.error)
      return
    }

    const isThereAnomaly = anomalyPrediction.anomaly

    if (isThereAnomaly) {
      console.log('this worked')
      const anomalyDistance = (Math.random() * 100).toFixed(1)
      setAnomalyState('detected')
      setAnomalyMessage(
        `There's an upcoming road anomaly ${anomalyDistance}km away from you.#!${Math.random()}` //do this to ensure messages are always unique and voice is triggered on each prediction
      )
      return
    }

    setAnomalyState('none')
    setAnomalyMessage(`No anomaly detected, keep moving.#!${Math.random()}`)
  }, [anomalyPrediction.id])

  return (
    <>
      <div className="col-start-1 col-end-2 row-start-1 py-8 relative z-[1]">
        <form
          className={twMerge(
            'rounded-3xl shadow-[0_0_60px_#0000001A] bg-white w-max z-[1] h-max ml-4 my-auto',
            isPredictShown ? 'p-6' : ''
          )}
          action={formAction}
        >
          {isPredictShown && (
            <>
              <XIcon
                onClick={() => setIsPredictShown(false)}
                className="ml-auto cursor-pointer"
              />
              <button
                ref={buttonRef}
                className="hidden"
                type="button"
                onClick={() => {
                  if (isVoiceMuted) return
                  const msg = new SpeechSynthesisUtterance(
                    anomalyMessage.split('#!')[0]
                  )

                  msg.pitch = 1.0 // Normal pitch for a balanced tone
                  msg.rate = 0.95 // Slightly slower rate to mimic natural speech
                  msg.volume = 0.9 // Slightly lower volume for a softer, more natural sound
                  msg.lang = 'en-US' // English language (US)

                  const voices = window.speechSynthesis.getVoices()
                  msg.voice =
                    voices.find(
                      voice =>
                        voice.name.includes('English') &&
                        voice.name.includes('Female')
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
                  htmlFor="Accel_X"
                  className="text-[#686868] text-sm flex flex-col items-start gap-2"
                >
                  x-axis
                  <input
                    type="number"
                    name="Accel_X"
                    value={derivedAnomaly?.Accel_X}
                    onChange={e =>
                      dispatchAnomaly({
                        type: 'Accel_X',
                        payload: e.target.value,
                      })
                    }
                    required
                    className="border border-[#F1F1F1] rounded px-3 py-3 text-black w-[75px] outline-none"
                  />
                </label>
                <label
                  htmlFor="Accel_Y"
                  className="text-[#686868] text-sm flex flex-col items-start gap-2"
                >
                  y-axis
                  <input
                    type="number"
                    name="Accel_Y"
                    value={derivedAnomaly?.Accel_Y}
                    onChange={e =>
                      dispatchAnomaly({
                        type: 'Accel_Y',
                        payload: e.target.value,
                      })
                    }
                    required
                    className="border border-[#F1F1F1] rounded px-3 py-3 text-black w-[75px] outline-none"
                  />
                </label>
                <label
                  htmlFor="Accel_Z"
                  className="text-[#686868] text-sm flex flex-col items-start gap-2"
                >
                  z-axis
                  <input
                    type="number"
                    name="Accel_Z"
                    value={derivedAnomaly?.Accel_Z}
                    onChange={e =>
                      dispatchAnomaly({
                        type: 'Accel_Z',
                        payload: e.target.value,
                      })
                    }
                    required
                    className="border border-[#F1F1F1] rounded px-3 py-3 text-black w-[75px] outline-none"
                  />
                </label>
                <p className="text-[#222222] bg-[#EFEFEF] rounded px-4 py-[0.7em] self-end w-full text-center">
                  m/s<sup>2</sup>
                </p>
              </div>
              <p className="mt-4 text-[#262626] font-medium mb-1">
                Angular velocity
              </p>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="Gyro_X"
                  className="text-[#686868] text-sm flex flex-col items-start gap-2"
                >
                  x-axis
                  <input
                    type="number"
                    name="Gyro_X"
                    value={derivedAnomaly?.Gyro_X}
                    onChange={e =>
                      dispatchAnomaly({
                        type: 'Gyro_X',
                        payload: e.target.value,
                      })
                    }
                    required
                    className="border border-[#F1F1F1] rounded px-3 py-3 text-black w-[75px] outline-none"
                  />
                </label>
                <label
                  htmlFor="Gyro_Y"
                  className="text-[#686868] text-sm flex flex-col items-start gap-2"
                >
                  y-axis
                  <input
                    type="number"
                    name="Gyro_Y"
                    value={derivedAnomaly?.Gyro_Y}
                    onChange={e =>
                      dispatchAnomaly({
                        type: 'Gyro_Y',
                        payload: e.target.value,
                      })
                    }
                    required
                    className="border border-[#F1F1F1] rounded px-3 py-3 text-black w-[75px] outline-none"
                  />
                </label>
                <label
                  htmlFor="Gyro_Z"
                  className="text-[#686868] text-sm flex flex-col items-start gap-2"
                >
                  z-axis
                  <input
                    type="number"
                    name="Gyro_Z"
                    value={derivedAnomaly?.Gyro_Z}
                    onChange={e =>
                      dispatchAnomaly({
                        type: 'Gyro_Z',
                        payload: e.target.value,
                      })
                    }
                    required
                    className="border border-[#F1F1F1] rounded px-3 py-3 text-black w-[75px] outline-none"
                  />
                </label>
                <p className="text-[#222222] bg-[#EFEFEF] rounded px-4 py-[0.7em] self-end w-full text-center">
                  rad/s
                </p>
              </div>
              <p className="mt-4 text-[#262626] font-medium mb-1">Vibration</p>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  name="Vibration"
                  value={derivedAnomaly?.Vibration}
                  onChange={e =>
                    dispatchAnomaly({
                      type: 'Vibration',
                      payload: e.target.value,
                    })
                  }
                  required
                  className="border border-[#F1F1F1] rounded px-5 py-3 w-[calc(75px + 1em)] text-black outline-none"
                />
                <p className="text-[#222222] text-center bg-[#EFEFEF] rounded px-4 py-[0.8em] self-end w-full">
                  -
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="mt-4 text-[#262626] font-medium mb-1">
                      Longitude
                    </p>
                    <input
                      type="string"
                      name="Longitude"
                      value={`${derivedAnomaly?.Longitude}`}
                      onChange={e =>
                        dispatchAnomaly({
                          type: 'Longitude',
                          payload: e.target.value,
                        })
                      }
                      required
                      className="border border-[#F1F1F1] rounded px-5 py-3 text-black w-[calc((257px_-_0.5em)/2)] outline-none"
                    />
                  </div>
                  <div>
                    <p className="mt-4 text-[#262626] font-medium mb-1">
                      Latitude
                    </p>
                    <input
                      type="string"
                      name="Latitude"
                      value={`${derivedAnomaly?.Latitude}`}
                      onChange={e =>
                        dispatchAnomaly({
                          type: 'Latitude',
                          payload: e.target.value,
                        })
                      }
                      required
                      className="border border-[#F1F1F1] rounded px-5 py-3 text-black w-[calc((257px_-_0.5em)/2)] outline-none"
                    />
                  </div>
                </div>
                <p className="text-[#222222] text-center bg-[#EFEFEF] rounded px-4 py-[0.8em] self-end w-full">
                  &deg;(N/S)
                </p>
              </div>
              <PredictButton />
              {anomalyState !== 'idle' && anomalyMessage !== '' && (
                <>
                  <div className="h-[2px] bg-[#E1E1E1] my-6" />
                  <div>
                    <p className="capitalize text-[#262626] text-lg mb-2">
                      result
                    </p>
                    {anomalyState === 'detected' ? (
                      <div className="text-white bg-[#D91515] p-4 rounded-lg">
                        <Image
                          src={whiteRoad}
                          alt="road"
                          className="mx-auto w-10"
                        />
                        <p className="font-medium text-center mt-4 text-lg">
                          Anomaly detected!
                        </p>
                        <p className="text-center text-sm opacity-90">
                          Keep your heads up
                        </p>
                      </div>
                    ) : (
                      <div className="text-white bg-[#11940E] p-4 rounded-lg">
                        <Image
                          src={whiteRoad}
                          alt="road"
                          className="mx-auto w-10"
                        />
                        <p className="font-medium text-center mt-4 text-lg">
                          No anomaly detected!
                        </p>
                        <p className="text-center text-sm opacity-90">
                          Keep moving
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
          {isGraphShown && (
            <div
              className="fixed grid inset-0 cursor-pointer z-10 bg-black/70"
              onClick={() => setIsGraphShown(false)}
            >
              <Chart setIsGraphShown={setIsGraphShown} />
            </div>
          )}
          <div className="fixed flex items-center gap-4 inset-[auto_50%_1em_auto] translate-x-1/2 w-max">
            <button
              className="bg-[#831DD3] cursor-pointer border-none outline-none text-white px-5 py-3 rounded capitalize"
              type="button"
              onClick={() => setIsPredictShown(prev => !prev)}
            >
              {isPredictShown ? 'Hide Prediction' : 'Show Prediction'}
            </button>
            <button
              className="bg-[#831DD3] cursor-pointer border-none outline-none text-white px-5 py-3 rounded capitalize"
              type="button"
              onClick={() => setShowAnomalies(prev => !prev)}
            >
              {showAnomalies ? 'Show path' : 'Show anomalies'}
            </button>
            <button
              className="bg-[#831DD3] cursor-pointer border-none outline-none text-white px-5 py-3 rounded capitalize"
              type="button"
              onClick={() => setIsGraphShown(true)}
            >
              show graph
            </button>
            <button
              className="bg-[#831DD3] cursor-pointer border-none outline-none text-white px-5 py-3 rounded capitalize"
              type="button"
              onClick={() => setIsPathFormShown(true)}
            >
              set destination
            </button>
          </div>
        </form>
        {isPathFormShown && (
          <div
            onClick={() => setIsPathFormShown(false)}
            className="fixed grid inset-0 cursor-pointer bg-black/70"
          >
            <form
              onClick={e => e.stopPropagation()}
              action={pathAction}
              className="bg-white p-8 cursor-auto rounded-lg m-auto max-w-120"
            >
              <XIcon
                onClick={() => {
                  setIsPathFormShown(false)
                }}
                className="ml-auto cursor-pointer"
              />
              <p className="mb-2 font-semibold text-black">From:</p>
              <input
                name="from"
                placeholder="Enter state name"
                className="border border-[#F1F1F1] rounded px-5 py-3 text-black outline-none w-full"
              />
              <p className="mt-4 font-semibold text-black">To:</p>
              <input
                name="to"
                placeholder="Enter state name"
                className="border border-[#F1F1F1] rounded px-5 py-3 text-black outline-none w-full"
              />
              <SubmitPathButton />
            </form>
          </div>
        )}
      </div>
      <AnimatePresence>
        {anomalyMessage !== '' && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: '0' }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="flex items-start gap-3 fixed inset-[1em_1em_auto_auto]"
          >
            <div
              className="p-2 bg-white rounded-full cursor-pointer"
              onClick={() => setAnomalyMessage('')}
            >
              <Image src={cancelImg} alt="close" className="w-4" />
            </div>
            <div className="flex items-start gap-2 rounded-lg shadow-[0_0_80px_#00000029] p-4 bg-white">
              <div className="w-16 h-16 rounded-full bg-[#FEF2F1] grid place-items-center">
                <Image src={redRoad} alt="red road" />
              </div>
              <p className="capitalize font-semibold text-lg max-w-[290px]">
                {anomalyMessage.split('#!')[0]}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const PredictButton = function () {
  const { pending } = useFormStatus()
  return (
    <button
      disabled={pending}
      className="flex items-center gap-2 capitalize font-medium bg-[#831DD3] disabled:bg-[#D3D3D3] rounded cursor-pointer px-5 py-3 w-full mt-4 justify-center text-white"
      type="submit"
    >
      <Image src={starsImg} alt="predict" className="w-6" />
      predict
      {pending && (
        <LoadingSpinner radii={20} ringWidth={3} ringColor="#ffffff" />
      )}
    </button>
  )
}
const SubmitPathButton = function () {
  const { pending } = useFormStatus()
  return (
    <button
      disabled={pending}
      className="flex items-center gap-2 capitalize font-medium bg-[#831DD3] disabled:bg-[#D3D3D3] rounded cursor-pointer px-5 py-3 w-max mx-auto mt-4 justify-center text-white"
      type="submit"
    >
      submit
      {pending && (
        <LoadingSpinner radii={20} ringWidth={3} ringColor="#ffffff" />
      )}
    </button>
  )
}

export default Analysis
