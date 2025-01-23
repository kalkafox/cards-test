import { CardSuit, CardType, getCardColor } from '@/utils/card'
import { Icon } from '@iconify/react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'motion/react'
import { useEffect, useRef, useState } from 'react'

function getRandomRotation(): number {
  let rotation
  do {
    rotation = Math.random() * 4 - 2 // Generates a value between -5 and 5
  } while (rotation >= 0 && rotation < 1) // Retry if the rotation is exactly 0
  return rotation
}

const ROTATION_RANGE = 32.5
const HALF_ROTATION_RANGE = 32.5 / 2

function Card({
  suit = CardSuit.Spades,
  type = CardType.Ace,
  isFlipped = false,
}: Readonly<{
  isFlipped?: boolean
  suit?: CardSuit
  type?: CardType
}>) {
  const ref = useRef<HTMLDivElement>(null)
  const [flipped, setFlipped] = useState(isFlipped)
  const [flip, setFlip] = useState(isFlipped)

  const rotation = useSpring(getRandomRotation(), { stiffness: 200 })

  const flipRotation = useSpring(flipped ? 180 : 0, { bounce: 0, damping: 15 })
  const flipZ = useSpring(0)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const xSpring = useSpring(x, { damping: 20 })
  const ySpring = useSpring(y)

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg) translateZ(20px)`

  useEffect(() => {
    flipRotation.set(flip ? 180 : 0)
    flipZ.set(50)
  }, [flip, flipRotation, flipZ])

  useEffect(() => {
    setFlip(() => isFlipped)
  }, [isFlipped])

  const cardColor = getCardColor(suit)

  return (
    <div className={`${flipped ? 'rotate-180' : ''}`}>
      <motion.div
        style={{
          rotateX: flipRotation,
          rotateY: flipRotation,
          transformStyle: 'preserve-3d',
        }}
        onUpdate={(e: { rotateX: number }) => {
          if (e.rotateX > 90 && !flipped) {
            //flipRotation.jump(90)
            setFlipped(true)
            //flipRotation.setWithVelocity(90, 180, flipRotation.getVelocity())
          }

          if (e.rotateX < 90 && flipped) {
            //flipRotation.jump(90)
            setFlipped(false)
            //flipRotation.setWithVelocity(90, 0, flipRotation.getVelocity())
          }
        }}>
        <motion.div
          ref={ref}
          onMouseMove={(e) => {
            if (!ref.current) return [0, 0]

            const rect = ref.current.getBoundingClientRect()

            const width = rect.width
            const height = rect.height

            const mouseX = (e.clientX - rect.left) * ROTATION_RANGE
            const mouseY = (e.clientY - rect.top) * ROTATION_RANGE

            const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1
            const rY = mouseX / width - HALF_ROTATION_RANGE

            x.set(rX)
            y.set(rY)
          }}
          onMouseLeave={() => {
            x.set(getRandomRotation())
            y.set(0)
          }}
          onHoverStart={() => {
            rotation.set(0)
          }}
          onHoverEnd={() => {
            rotation.set(getRandomRotation())
          }}
          className={`drop-shadow-xl border-4 border-stone-300 bg-stone-800 rounded-lg w-40 h-60 font-["Card_Characters"]`}
          onClick={() => {}}
          style={{
            transformStyle: 'preserve-3d',
            transform,
          }}>
          {flipped ? (
            <>
              <div className='absolute heropattern-texture-stone-800 h-full w-full z-20' />
              <div className='bg-gradient-to-br from-stone-500 to-stone-700 w-full h-full absolute z-10' />

              <div className='absolute flex justify-center items-center h-full w-full text-stone-100 z-30'>
                <div className='bg-stone-800 w-20 h-20 rounded-lg absolute'>
                  <Icon
                    className='absolute left-0 right-0 m-auto bottom-0 top-0'
                    icon='ion:paw'
                    width='90%'
                    height='90%'
                  />
                </div>
              </div>

              <div className='absolute w-full h-full z-20 saturate-0 opacity-40'>
                <svg viewBox='0 0 160 245' xmlns='http://www.w3.org/2000/svg'>
                  <filter id='noiseFilter'>
                    <feTurbulence
                      type='fractalNoise'
                      baseFrequency='0.65'
                      numOctaves='5'
                      stitchTiles='stitch'
                    />
                  </filter>

                  <rect width='100%' height='100%' filter='url(#noiseFilter)' />
                </svg>
              </div>
            </>
          ) : (
            <>
              <div
                className={`text-6xl p-2 font-bold absolute select-none ${cardColor}`}>
                {type}
              </div>
              <div
                className={`justify-center flex items-center h-full ${cardColor}`}>
                <Icon icon={suit} width='50%' height='50%' />
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Card
