"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface CountdownTimerProps {
  targetDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
}) => {
  const calculateTimeLeft = (): TimeLeft | {} => {
    const difference = +new Date(targetDate) - +new Date()
    let timeLeft: TimeLeft | {} = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft | {}>(calculateTimeLeft())

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  const padWithZero = (value: number) => value.toString().padStart(2, "0")

  const timerComponents: string[] = []

  Object.keys(timeLeft).forEach((interval) => {
    const key = interval as keyof TimeLeft
    // @ts-ignore
    if (timeLeft[key] === undefined) {
      return
    }
    // @ts-ignore
    timerComponents.push(padWithZero(timeLeft[key]))
  })

  return (
    <div>
      {timerComponents.length ? (
        <CountdownFormatter countdown={timerComponents.join("")} />
      ) : (
        <CountdownFormatter countdown={"00000000"} />
      )}
    </div>
  )
}

const CountdownFormatter = ({ countdown }: { countdown: string }) => {
  return (
    <div>
      <div className="fixed top-[10vh] right-[50%] translate-x-[50%]  z-[0] minter-foreground">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ y: 0, opacity: 0.05 }}
          transition={{ duration: 0.5 }}
          className="relative  w-[60rem] h-[60rem]"
        >
          <Image src="/logo.svg" className="w-full h-full" alt="" fill />
        </motion.div>
      </div>

      <motion.div className="flex flex-col items-center justify-center md:h-[70vh] relative z-[10] md:pt-0 pt-8 max-w-[768px] mx-auto text-center">
        <div>
          <h2 className="neonText text-[24px] md:text-[40px] lg:text-[55px] leading-snug">
            The memegoat Defi suite will be unveiled daily
          </h2>
          <p className="md:text-[16px] mt-[14px] text-white/80">
            Want to see the amazing defi applications going live? Follow the
            countdown
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 md:gap-6 mt-[44px]">
          {/* Days */}
          <div>
            <p className="text-center text-white/70 mb-3">Days</p>
            <div className="grid grid-cols-2 gap-2 md:text-3xl text-[16px]">
              <div className="md:px-[26px] px-[12px] relative md:py-[20px] py-[8px] rounded-lg border-[1px] border-[#1AC0574D]">
                <span className="relative z-[20]">{countdown[0]}</span>
                <div className="absolute top-0 left-0 w-full h-[50%] bg-[#1AC05733]" />
                <div className="absolute bottom-0 left-0 w-full h-[50%] bg-[#114C2933]" />
              </div>
              <div className="md:px-[26px] px-[12px] relative md:py-[20px] py-[8px] rounded-lg border-[1px] border-[#1AC0574D]">
                <span className="relative z-[20]">{countdown[1]}</span>
                <div className="absolute top-0 left-0 w-full h-[50%] bg-[#1AC05733]" />
                <div className="absolute bottom-0 left-0 w-full h-[50%] bg-[#114C2933]" />
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <p className="text-center text-white/70 mb-3">Hours</p>
            <div className="grid grid-cols-2 gap-2 md:text-3xl text-[16px]">
              <div className="md:px-[26px] px-[12px] relative md:py-[20px] py-[8px] rounded-lg border-[1px] border-[#1AC0574D]">
                <span className="relative z-[20]">{countdown[2]}</span>
                <div className="absolute top-0 left-0 w-full h-[50%] bg-[#1AC05733]" />
                <div className="absolute bottom-0 left-0 w-full h-[50%] bg-[#114C2933]" />
              </div>
              <div className="md:px-[26px] px-[12px] relative md:py-[20px] py-[8px] rounded-lg border-[1px] border-[#1AC0574D]">
                <span className="relative z-[20]">{countdown[3]}</span>
                <div className="absolute top-0 left-0 w-full h-[50%] bg-[#1AC05733]" />
                <div className="absolute bottom-0 left-0 w-full h-[50%] bg-[#114C2933]" />
              </div>
            </div>
          </div>

          {/* Minutes */}
          <div>
            <p className="text-center text-white/70 mb-3">Minutes</p>
            <div className="grid grid-cols-2 gap-2 md:text-3xl text-[16px]">
              <div className="md:px-[26px] px-[12px] relative md:py-[20px] py-[8px] rounded-lg border-[1px] border-[#1AC0574D]">
                <span className="relative z-[20]">{countdown[4]}</span>
                <div className="absolute top-0 left-0 w-full h-[50%] bg-[#1AC05733]" />
                <div className="absolute bottom-0 left-0 w-full h-[50%] bg-[#114C2933]" />
              </div>
              <div className="md:px-[26px] px-[12px] relative md:py-[20px] py-[8px] rounded-lg border-[1px] border-[#1AC0574D]">
                <span className="relative z-[20]">{countdown[5]}</span>
                <div className="absolute top-0 left-0 w-full h-[50%] bg-[#1AC05733]" />
                <div className="absolute bottom-0 left-0 w-full h-[50%] bg-[#114C2933]" />
              </div>
            </div>
          </div>

          {/* Seconds */}
          <div>
            <p className="text-center text-white/70 mb-3">Seconds</p>
            <div className="grid grid-cols-2 gap-2 md:text-3xl text-[16px]">
              <div className="md:px-[26px] px-[12px] relative md:py-[20px] py-[8px] rounded-lg border-[1px] border-[#1AC0574D]">
                <span className="relative z-[20]">{countdown[6]}</span>
                <div className="absolute top-0 left-0 w-full h-[50%] bg-[#1AC05733]" />
                <div className="absolute bottom-0 left-0 w-full h-[50%] bg-[#114C2933]" />
              </div>
              <div className="md:px-[26px] px-[12px] relative md:py-[20px] py-[8px] rounded-lg border-[1px] border-[#1AC0574D]">
                <span className="relative z-[20]">{countdown[7]}</span>
                <div className="absolute top-0 left-0 w-full h-[50%] bg-[#1AC05733]" />
                <div className="absolute bottom-0 left-0 w-full h-[50%] bg-[#114C2933]" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
