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

export const getRoute = async function (initialState: string, data: FormData) {
  const from = (data.get('from') as string).trim().toLowerCase()
  const to = (data.get('to') as string).trim().toLowerCase()

  try {
    const locationData = await Promise.all([
      fetch(`${BASE_URL}/api/nigeria/nigeria/states/${from}`),
      fetch(`${BASE_URL}/api/nigeria/nigeria/states/${to}`),
    ])
    const [fromLocation, toLocation] = await Promise.all(
      locationData.map(res => res.json())
    )
    const res = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLocation.longitude},${fromLocation.latitude};${toLocation.longitude},${toLocation.latitude}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    )

    if (!res.ok) throw new Error('Error fetching route')
    const data = await res.json()
    console.log(data.routes[0].geometry)
    return JSON.stringify({
      success: true,
      data: data.routes[0].geometry,
      id: Math.random(),
      from: {
        fromLatitude: fromLocation.latitude,
        fromLongitude: fromLocation.longitude,
      },
    })
  } catch (err) {
    console.log(err)
    return JSON.stringify({ error: 'Error fetching route', id: Math.random() })
  }
}
