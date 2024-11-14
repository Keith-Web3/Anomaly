'use server'

const BASE_URL = 'https://road-anomaly-1672548ad216.herokuapp.com'

export const signup = async function (initialState: string, data: FormData) {
  const email = data.get('email') as string
  const password = data.get('password') as string

  try {
    const res = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()
    if (data.error) {
      throw new Error(data.error)
    }
    console.log(data)
  } catch (err: any) {
    console.log('error:', err.message)
    return JSON.stringify({ error: err.message, id: Math.random() })
  }

  return JSON.stringify({ success: 'Signed up successfully' })
}

export const getAnomalyTable = async function () {
  const res = await fetch(`${BASE_URL}/api/roads`)

  if (!res.ok) {
    return { error: 'Something went wrong, please reload.' }
  }

  const data = await res.json()

  return data.data
}

export const predictAnomaly = async function (
  _initialState: string,
  formData: FormData
) {
  const anomalyFields = [
    'Accel_X',
    'Accel_Y',
    'Accel_Z',
    'Gyro_X',
    'Gyro_Y',
    'Gyro_Z',
    'Vibration',
    'Longitude',
    'Latitude',
  ]
  const parsedData: { [key: string]: FormDataEntryValue } = {}
  for (const field of anomalyFields) {
    parsedData[field] = formData.get(field)!
  }
  console.log(parsedData)

  const id = Math.random()
  try {
    const res = await fetch(`${BASE_URL}/api/roads/predict`, {
      method: 'POST',
      body: JSON.stringify(parsedData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()

    console.log(data)
    return JSON.stringify({ anomaly: data.data.Anomaly, id })
  } catch (err) {
    return JSON.stringify({ error: 'Error predicting anomaly', id })
  }
}

export async function getUserLocation(lng: number, lat: number) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    lng
  )},${encodeURIComponent(lat)}.json?access_token=${
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  }`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Error: ${response.statusText}`)
    const data = await response.json()
    return data.features[0]?.place_name || 'Location not found'
  } catch (error) {
    console.error('Geocoding failed:', error)
    return 'Error getting location'
  }
}
