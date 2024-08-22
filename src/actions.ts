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
        username: 'placeholder',
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
  console.log(data)

  return data.data
}
