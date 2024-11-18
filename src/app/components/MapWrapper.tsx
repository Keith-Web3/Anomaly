'use client'
import { useState, useEffect } from 'react'
import Map, { Marker } from 'react-map-gl'
import { twMerge } from 'tailwind-merge'
import { Roboto } from 'next/font/google'
import Image from 'next/image'
import toast from 'react-hot-toast'

import 'mapbox-gl/dist/mapbox-gl.css'
import './mapWrapper.css'
import volume from '@/assets/volume.svg'
import cancel from '@/assets/cancel.svg'
import volumeMuted from '@/assets/volume_muted.svg'

import Analysis from './Analysis'
import { getAnomalyTable, getUserLocation } from '@/utils'
import { useQuery } from '@tanstack/react-query'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN // Set your mapbox token here
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['500', '400'],
})

export interface Anomaly {
  Accel_X: string
  Accel_Y: string
  Accel_Z: string
  Anomaly: string
  Gyro_X: string
  Gyro_Y: string
  Gyro_Z: string
  Latitude: string
  Longitude: string
  Vibration: string
  Speed: number
  _id: string
}

export default function MapWrapper() {
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets')
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false)
  const [isMapInfoShown, setIsMapInfoShown] = useState<boolean>(false)
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
  }>({ latitude: 0, longitude: 0 })
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly>({
    Accel_X: '',
    Accel_Y: '',
    Accel_Z: '',
    Anomaly: '',
    Gyro_X: '',
    Gyro_Y: '',
    Gyro_Z: '',
    Latitude: '',
    Longitude: '',
    Vibration: '',
    Speed: 0,
    _id: '',
  })

  const { data: anomalyData, isSuccess: isAnomalyDataReady } = useQuery<
    Anomaly[]
  >({
    queryKey: ['anomaly_table'],
    queryFn: getAnomalyTable,
  })
  const {
    data: locationString,
    isLoading: isLocationLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['user_location', userLocation.latitude, userLocation.longitude],
    queryFn: () =>
      getUserLocation(userLocation.longitude, userLocation.latitude),
  })

  return (
    <>
      {isMapInfoShown && (
        <div
          onClick={() => setIsMapInfoShown(false)}
          className="fixed z-20 inset-0 cursor-pointer bg-black/70 grid"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="m-auto min-w-[300px] cursor-auto w-max rounded-lg bg-white shadow-md p-6"
          >
            <Image
              src={cancel}
              alt="cancel"
              className="w-4 mb-2 h-4 cursor-pointer ml-auto"
              onClick={() => setIsMapInfoShown(false)}
            />
            <p className="text-[#262626] mb-2">
              <span className="text-[#686868] text-sm">Speed:</span>{' '}
              {selectedAnomaly.Speed}
            </p>
            <p className="text-[#262626] mb-2">
              <span className="text-[#686868] text-sm">Type:</span>{' '}
              {selectedAnomaly.Anomaly ?? 'Pothole'}
            </p>
            <p className="text-[#262626] mb-2">
              <span className="text-[#686868] text-sm">Location:</span>{' '}
              {isLocationLoading
                ? 'Loading location...'
                : isSuccess
                ? locationString
                : 'Error loading location'}
            </p>
            <p className="text-[#262626]">
              <span className="text-[#686868] text-sm">Time:</span>{' '}
              {getCurrentTime()}
            </p>
          </div>
        </div>
      )}
      <div className="col-start-1 col-end-3 row-start-1">
        <button
          className="w-14 h-14 rounded-full bg-white grid place-content-center fixed inset-[50%_1em_auto_auto] translate-y-[-50%] z-[1] shadow-[0_0_69px_#00000029]"
          onClick={() => setIsVoiceMuted(prev => !prev)}
        >
          {!isVoiceMuted ? (
            <Image src={volume} alt="volume" className="w-[75%] mx-auto" />
          ) : (
            <Image src={volumeMuted} alt="mute" className="w-[75%] mx-auto" />
          )}
        </button>
        <div
          className={twMerge(
            'flex items-center w-max mx-auto rounded fixed inset-[1em_50%_auto_auto] z-[1] overflow-hidden translate-x-1/2 shadow-[0_1.5px_4.4px_#00000033] bg-white',
            roboto.className
          )}
        >
          <button
            className={twMerge(
              'outline-none cursor-pointer bg-white px-5 py-3 text-[#565656] capitalize border-r-2 border-[#F2F2F2]',
              mapStyle === 'streets' && 'font-medium text-black'
            )}
            onClick={() => setMapStyle('streets')}
          >
            map
          </button>
          <button
            className={twMerge(
              'border-none outline-none cursor-pointer bg-white px-5 py-3 text-[#565656] capitalize',
              mapStyle === 'satellite' && 'font-medium text-black'
            )}
            onClick={() => setMapStyle('satellite')}
          >
            satellite
          </button>
        </div>
        <div className="grid h-screen sticky top-0">
          {!!anomalyData?.length && isSuccess && (
            <Map
              initialViewState={{
                latitude: +anomalyData[0].Latitude,
                longitude: +anomalyData[0].Longitude,
                zoom: 14,
              }}
              style={{ width: '100%', height: '100%' }}
              mapStyle={
                mapStyle === 'streets'
                  ? 'mapbox://styles/mapbox/streets-v11'
                  : 'mapbox://styles/mapbox/satellite-streets-v12'
              }
              mapboxAccessToken={MAPBOX_TOKEN}
              onClick={e => {
                console.log(e)
                setUserLocation({
                  latitude: e.lngLat.lat,
                  longitude: e.lngLat.lng,
                })
              }}
            >
              {anomalyData.map(anomaly => (
                <Marker
                  longitude={+anomaly.Longitude}
                  latitude={+anomaly.Latitude}
                  key={anomaly._id}
                  className="cursor-pointer"
                  color={anomaly.Anomaly === 'None' ? 'green' : 'red'}
                  onClick={() => {
                    setSelectedAnomaly(anomaly)
                    console.log(anomaly)
                    setUserLocation({
                      latitude: +anomaly.Latitude,
                      longitude: +anomaly.Longitude,
                    })
                    setIsMapInfoShown(true)
                  }}
                />
              ))}
            </Map>
          )}
        </div>
      </div>
      <Analysis
        isVoiceMuted={isVoiceMuted}
        userLocation={userLocation}
        anomaly={selectedAnomaly}
      />
    </>
  )
}

function getCurrentTime() {
  const now = new Date()

  // Options for a human-readable date format
  const options = {
    year: 'numeric', // e.g., "2024"
    month: 'long', // e.g., "November"
    day: 'numeric', // e.g., "14"
    hour: 'numeric', // e.g., "3"
    minute: '2-digit', // e.g., "45"
    hour12: true, // 12-hour format with AM/PM
  }

  return now.toLocaleString('en-US', options as Intl.DateTimeFormatOptions)
}
