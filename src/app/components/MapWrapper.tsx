'use client'
import * as React from 'react'
import Map, { Marker } from 'react-map-gl'

import 'mapbox-gl/dist/mapbox-gl.css'
import './mapWrapper.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN // Set your mapbox token here

console.log(MAPBOX_TOKEN)

export default function MapWrapper() {
  return (
    <div className="grid min-h-screen">
      <Map
        initialViewState={{
          latitude: 37.8,
          longitude: -122.4,
          zoom: 14,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker longitude={-122.4} latitude={37.8} color="red" />
      </Map>
    </div>
  )
}
