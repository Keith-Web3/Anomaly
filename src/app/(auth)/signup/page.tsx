import Image from 'next/image'
import roadImg from '../../assets/road.svg'
import googleImg from '../../assets/google.svg'
import eyeImg from '../../assets/eye.svg'

export default function SignUp() {
  return (
    <div className="min-h-screen p-4 grid place-content-center">
      <form className="w-max min-w-[350px]">
        <div>
          <Image src={roadImg} alt="road" className="mx-auto" />
          <p className="text-[#831DD3] text-center capitalize text-lg font-bold">
            anomaly
          </p>
        </div>
        <p className="text-center text-[#222222] mb-4 mt-6 font-medium text-lg">
          Get started
        </p>
        <button className="flex items-center border-none outline-none bg-[#F6F6F6] w-full cursor-pointer gap-2 px-5 py-3 justify-center rounded-lg">
          <Image src={googleImg} alt="google" />
          <span className="text-[#747474] font-medium">
            Sign in with google
          </span>
        </button>
        <p className="text-center text-[#969696] text-sm my-4">or</p>
        <input
          type="email"
          placeholder="Email address"
          className="border border-[#E5E5E5] rounded-lg outline-none placeholder:text-[#747474] w-full mb-4 py-3 px-5"
        />
        <label
          htmlFor="password"
          className="flex items-center border border-[#E5E5E5] rounded-lg outline-none w-full py-3 px-5"
        >
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="border-none outline-none w-full placeholder:text-[#747474]"
          />
          <Image src={eyeImg} alt="eye" className="cursor-pointer" />
        </label>
        <button className="text-center bg-[#831DD3] border-none outline-none cursor-pointer w-full px-5 py-3 mt-4 rounded-lg text-white capitalize font-medium">
          create account
        </button>
      </form>
    </div>
  )
}
