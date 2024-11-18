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

  const data = await res.json()

  const graphData: { time: string; distance: number }[] = data.data
  const latestData = trimAndSampleArray(graphData)
  const from = formatDate(latestData[0].time)
  const to = formatDate(latestData[latestData.length - 1].time)

  const change =
    ((latestData[latestData.length - 1].distance - latestData[0].distance) /
      latestData[0].distance) *
    100

  return { graphData: latestData, from, to, change }
}

export const getAnomalyTable = async function () {
  const res = await fetch(`${BASE_URL}/api/roads`)

  const data = await res.json()

  return data.data
}

function formatDate(dateString: string) {
  const date = new Date(dateString)

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // Ensures AM/PM format
  } satisfies Intl.DateTimeFormatOptions

  return new Intl.DateTimeFormat('en-US', options).format(date)
}

function trimAndSampleArray<K>(data: K[]) {
  // Trim the array to the last 200 items
  let trimmedData = data.slice(-1000)

  // If the array has 20 or fewer items, return all of them
  if (trimmedData.length <= 30) {
    return trimmedData
  }

  // Otherwise, calculate the step size to distribute 20 items evenly
  const totalItems = trimmedData.length
  const step = totalItems / 30 // Allow fractional steps for better distribution

  // Collect 20 evenly distributed items
  const result = []
  trimmedData = trimmedData.reverse()
  for (let i = 0; i < 30; i++) {
    result.push(trimmedData[Math.floor(i * step)])
  }

  return result.reverse()
}
