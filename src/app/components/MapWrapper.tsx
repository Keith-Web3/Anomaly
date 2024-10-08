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
import volumeMuted from '@/assets/volume_muted.svg'

import Analysis from './Analysis'
import { getAnomalyTable } from '@/actions'

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
  _id: string
}

export default function MapWrapper() {
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets')
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false)
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
  }>({ latitude: 0, longitude: 0 })
  const [anomalyData, setAnomalyData] = useState<Anomaly[]>([])
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
    _id: '',
  })

  useEffect(() => {
    getAnomalyTable().then(res => {
      if (res.error) {
        toast.error('Error fetching anomaly data')
        return
      }
      setAnomalyData(res)
    })
  }, [])

  return (
    <>
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
            'flex items-center w-max mx-auto rounded fixed inset-[1em_50%_auto_auto] z-[2] overflow-hidden translate-x-1/2 shadow-[0_1.5px_4.4px_#00000033] bg-white',
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
        <div className="grid min-h-screen h-full">
          {!!anomalyData.length && (
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
                  color="red"
                  onClick={() => {
                    setSelectedAnomaly(anomaly)
                    setUserLocation({
                      latitude: +anomaly.Latitude,
                      longitude: +anomaly.Longitude,
                    })
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
