const BASE_URL = 'https://road-anomaly-1672548ad216.herokuapp.com'

export async function getUserLocation(lng: number, lat: number) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    lng
  )},${encodeURIComponent(lat)}.json?access_token=${
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  }`

  const response = await fetch(url)
  const data = await response.json()
  return data.features[0]?.place_name || 'Location not found'
}

export async function getGraphData() {
  const res = await fetch(`${BASE_URL}/api/distance-time/graph`)

  if (!res.ok) {
    return { error: 'Something went wrong, please reload.' }
  }

  const data = await res.json()

  return data.data
}

export const getAnomalyTable = async function () {
  const res = await fetch(`${BASE_URL}/api/roads`)

  const data = await res.json()

  return data.data
}
