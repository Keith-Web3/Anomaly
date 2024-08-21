'use client'

import { useState, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import Image from 'next/image'
import toast from 'react-hot-toast'

import roadImg from '@/assets/road.svg'
import googleImg from '@/assets/google.svg'
import eyeImg from '@/assets/eye.svg'
import eyeHiddenImg from '@/assets/eye-slash.svg'

import { signup } from '@/actions'
import LoadingSpinner from '@/app/components/LoadingSpinner'

export default function SignUp() {
  const [isPasswordDisplayed, setIsPasswordDisplayed] = useState<boolean>(false)
  const [state, formAction, isPending] = useFormState(signup, '')

  console.log('state:', state)
  useEffect(() => {
    console.log('state1:', state)
    if (state === '') return

    const parsedState = JSON.parse(state)
    if ('error' in parsedState) {
      toast.error(parsedState.error)
      return
    }
    toast.success(parsedState.success)
  }, [state])

  return (
    <div className="min-h-screen p-4 grid place-content-center">
      <form className="w-max min-w-[350px]" action={formAction}>
        <div>
          <Image src={roadImg} alt="road" className="mx-auto" />
          <p className="text-[#831DD3] text-center capitalize text-lg font-bold">
            anomaly
          </p>
        </div>
        <p className="text-center text-[#222222] mb-4 mt-6 font-medium text-lg">
          Get started
        </p>
        <button
          className="flex items-center border-none outline-none bg-[#F6F6F6] w-full gap-2 px-5 py-3 justify-center rounded-lg cursor-not-allowed"
          disabled
        >
          <Image src={googleImg} alt="google" />
          <span className="text-[#747474] font-medium">
            Sign in with google
          </span>
        </button>
        <p className="text-center text-[#969696] text-sm my-4">or</p>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
          className="border border-[#E5E5E5] rounded-lg outline-none placeholder:text-[#747474] w-full mb-4 py-3 px-5"
        />
        <label
          htmlFor="password"
          className="flex items-center border border-[#E5E5E5] rounded-lg outline-none w-full py-3 px-5"
        >
          <input
            type={isPasswordDisplayed ? 'text' : 'password'}
            name="password"
            id="password"
            placeholder="Password"
            minLength={5}
            required
            className="border-none outline-none w-full placeholder:text-[#747474]"
          />
          {!isPasswordDisplayed ? (
            <Image
              src={eyeImg}
              alt="password displayed"
              className="cursor-pointer w-6"
              onClick={() => setIsPasswordDisplayed(true)}
            />
          ) : (
            <Image
              src={eyeHiddenImg}
              className="cursor-pointer w-6"
              alt="password hidden"
              onClick={() => setIsPasswordDisplayed(false)}
            />
          )}
        </label>
        <Submit />
      </form>
    </div>
  )
}

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button
      className="text-center bg-[#831DD3] border-none outline-none cursor-pointer w-full px-5 py-3 mt-4 rounded-lg text-white capitalize font-medium disabled:bg-[#d3d3d3] disabled:cursor-not-allowed flex items-center justify-center gap-3"
      disabled={pending}
    >
      create account
      {pending && (
        <LoadingSpinner radii={20} ringWidth={3} ringColor="#ffffff" />
      )}
    </button>
  )
}
