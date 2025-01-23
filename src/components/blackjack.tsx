import { useCallback, useEffect, useRef, useState } from 'react'
import { type Card as TCard } from '@/types/card'
import { randomCard } from '@/utils/card'
import { motion, TargetAndTransition, useSpring } from 'motion/react'
import Card from './card'
import { calculateHandValue, GameStep } from '@/utils/blackjack'
import { useAtom } from 'jotai'
import { gameCountAtom, gamesLostAtom, gamesWonAtom } from '@/utils/atom'
import CountUp from 'react-countup'

function Blackjack() {
  const mainULRef = useRef<HTMLUListElement>(null)
  const dealerULRef = useRef<HTMLUListElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCount, setGameCount] = useAtom(gameCountAtom)
  const [gamesWon, setGamesWon] = useAtom(gamesWonAtom)
  const [gamesLost, setGamesLost] = useAtom(gamesLostAtom)
  const [devMode] = useState(false)

  const [gameStep, setGameStep] = useState(GameStep.PreGame)

  const [awaitingChoice, setAwaitingChoice] = useState(false)

  const [mainScore, setMainScore] = useState(0)
  const [dealerScore, setDealerScore] = useState(0)

  const [mainHand, setMainHand] = useState<TCard[]>([])
  const [dealerHand, setDealerHand] = useState<TCard[]>([])

  const ulWidth =
    (mainULRef.current?.offsetWidth ?? 0) +
    (mainHand.length > 1 ? -mainHand.length * 55 : 0)

  const mainHandOffset = useSpring((window.innerWidth - ulWidth) / 2, {
    bounce: 0,
  })

  const dealerHandOffset = useSpring((window.innerWidth - ulWidth) / 2, {
    bounce: 0,
  })

  const [animationComplete, setAnimationComplete] = useState<boolean[]>(
    new Array(mainHand.length).fill(false),
  )

  const [mainFinalYValues, setMainFinalYValues] = useState(
    mainHand.map(() => Math.floor(Math.random() * 20) - 5),
  )

  // const [dealerFinalYValues, setDealerFinalYValues] = useState(
  //   dealerHand.map(() => Math.floor(Math.random() * 20) - 5),
  // )

  useEffect(() => {
    const doResize = () => {
      const ulWidth =
        (mainULRef.current?.offsetWidth ?? 0) +
        (mainHand.length > 1 ? -mainHand.length * 55 : 0)
      mainHandOffset.set((window.innerWidth - ulWidth) / 2)
    }

    setMainFinalYValues((mainFinalYValues) => {
      return [...mainFinalYValues, Math.floor(Math.random() * 20) - 5]
    })

    doResize() // Initial call to center on mount
    window.addEventListener('resize', doResize)

    return () => window.removeEventListener('resize', doResize)
  }, [mainHand, mainHandOffset])

  useEffect(() => {
    const doResize = () => {
      const ulWidth = dealerULRef.current?.offsetWidth ?? 0
      dealerHandOffset.set((window.innerWidth - ulWidth) / 2)
    }

    // setDealerFinalYValues((dealerFinalYValues) => {
    //   return [...dealerFinalYValues, Math.floor(Math.random() * 20) - 5]
    // })

    doResize() // Initial call to center on mount
    window.addEventListener('resize', doResize)

    return () => window.removeEventListener('resize', doResize)
  }, [dealerHand, dealerHandOffset])

  const dealCards = useCallback(() => {
    const cards: TCard[] = []

    for (let i = 0; i < 5; i++) {
      cards.push(randomCard())
    }

    if (devMode) {
      while (true) {
        for (let i = 0; i < 5; i++) {
          cards.push(randomCard())
        }

        const mainValue = calculateHandValue([cards[0], cards[3]])

        const dealerValue = calculateHandValue([cards[1], cards[2]])

        if (mainValue === 21 && dealerValue === 21) {
          break
        } else {
          cards.length = 0
        }
      }
    }

    cards[1].flipped = true

    setMainHand([cards[0], cards[3]])

    setDealerHand([cards[1], cards[2]])
  }, [devMode])

  useEffect(() => {
    if (gameStep === GameStep.PostGame) {
      setDealerHand((prev) => {
        prev[0].flipped = false
        return [...prev]
      })
    }
  }, [gameStep])

  useEffect(() => {
    if (mainScore === dealerScore && gameStep === GameStep.PostGame) {
      // Push!
      setGameStep(GameStep.Final)
    }

    if (dealerScore < 17 && gameStep === GameStep.PostGame) {
      const card = randomCard(false)

      setTimeout(() => setDealerHand((prev) => [...prev, card]), 1000)
    }

    if (dealerScore >= 17 && gameStep === GameStep.PostGame) {
      setGameStep(GameStep.Final)
      setGameStarted(false)
      setGameCount((prev) => {
        return ++prev
      })

      // these conditions could be handled better
      // but i'd rather avoid a scenario where I accidentally use else and cause faulty conditions

      if (dealerScore > mainScore) {
        setGamesLost((prev) => ++prev)
      } else if (dealerScore < mainScore) {
        setGamesWon((prev) => ++prev)
      }
    }
  }, [
    dealerScore,
    mainScore,
    gameStep,
    setGameCount,
    setGamesLost,
    setGamesWon,
  ])

  return (
    <>
      <div className='fixed w-full h-full bg-stone-950 heropattern-diagonallines-stone-800/50 -z-20 top-0'></div>
      <motion.ul
        ref={mainULRef}
        className={`fixed flex m-4`}
        style={{
          x: mainHandOffset,
          bottom: 20,
        }}>
        {mainHand
          ? mainHand.map((item, index, cards) => {
              return (
                <motion.li
                  key={`${item.id}-${item.type}-${item.suit}-${index}`}
                  whileHover={{ y: -50, transition: { bounce: 0, delay: 0 } }}
                  initial={{
                    opacity: 0,
                    y: -window.innerHeight,
                    rotateX: 80,
                    rotateY: 80,
                    translateZ: 90,
                    x: -(index * 100),
                  }}
                  onAnimationComplete={() => {
                    setAnimationComplete((prev) => {
                      const updated = [...prev]
                      updated[index] = true

                      return updated
                    })

                    const total = calculateHandValue(mainHand)

                    setMainScore(total)

                    if (total > 21) {
                      setGameStep(GameStep.Tentative)
                      setGameStarted(false)
                      return
                    }

                    if (total === 21) {
                      setGameStep(GameStep.PostGame)
                      return
                    }

                    if (cards.length === 2) {
                      setAwaitingChoice(true)
                      setGameStep(GameStep.Game)
                    }

                    if (gameStep === GameStep.Game) {
                      setAwaitingChoice(true)
                    }
                  }}
                  style={{
                    pointerEvents: animationComplete[index] ? 'auto' : 'none',
                  }}
                  animate={{
                    opacity: 1,
                    y: mainFinalYValues[index],

                    rotateX: 0,
                    rotateY: 0,
                    x: -(index * 55),
                    transition: {
                      delay:
                        gameStep === GameStep.PreGame ? index * 0.4 + 0.2 : 0,
                    },
                  }}>
                  <Card
                    isFlipped={item.flipped}
                    type={item.type}
                    suit={item.suit}
                  />
                </motion.li>
              )
            })
          : null}
      </motion.ul>

      <motion.ul
        ref={dealerULRef}
        className={`fixed flex gap-2 m-4`}
        style={{
          x: dealerHandOffset,
          height: 240,
        }}>
        {dealerHand.map((item, index, cards) => {
          console.log(cards)
          return (
            <motion.li
              key={`${item.id}-${item.type}-${item.suit}-${index + 1}`}
              whileHover={{ y: 0, transition: { bounce: 0, delay: 0 } }}
              initial={{
                opacity: 0,
                y: -window.innerHeight,
                rotateX: 80,
                rotateY: 80,
                translateZ: 90,
              }}
              onAnimationComplete={() => {
                const total = calculateHandValue(dealerHand)

                setDealerScore(total)
              }}
              animate={{
                opacity: 1,
                y: 0,

                rotateX: 0,
                rotateY: 0,
                //x: index > 0 ? 100 * index : 0,
                //x: -index * 100,
                transition: {
                  delay: gameStep === GameStep.PreGame ? index * 0.4 : 0, // Staggered delay
                },
              }}>
              <Card
                isFlipped={item.flipped}
                type={item.type}
                suit={item.suit}
              />
            </motion.li>
          )
        })}
      </motion.ul>

      <div className='bg-stone-800/10 backdrop-blur-lg p-2 rounded-md m-2 w-auto absolute'>
        <div>
          Dealer's score:{' '}
          <CountUp end={dealerScore} preserveValue={true} duration={0.8} />
        </div>
        <div>
          Main score:{' '}
          <CountUp end={mainScore} preserveValue={true} duration={0.8} />
        </div>

        <motion.button
          disabled={gameStarted}
          animate={getAnimateState(!gameStarted)}
          onClick={() => {
            setGameStep(GameStep.PreGame)
            setAwaitingChoice(false)
            setMainScore(0)
            setDealerScore(0)
            setMainHand(() => [])
            setDealerHand(() => [])
            setGameStarted(true)

            dealCards()
          }}>
          Click to start game
        </motion.button>

        <motion.div
          initial={{ opacity: 0, visibility: 'hidden' }}
          animate={{
            opacity: awaitingChoice ? 1 : 0,
            visibility: awaitingChoice ? 'visible' : 'hidden',
          }}>
          <p>Make a choice</p>
          <div className='flex gap-4'>
            <button
              className='bg-stone-800 p-2 rounded-md'
              disabled={!awaitingChoice}
              onClick={() => {
                const card = randomCard(false)

                setMainHand((prev) => [...prev, card])

                setAwaitingChoice(false)
              }}>
              Hit
            </button>
            <button
              className='bg-stone-800 p-2 rounded-md'
              disabled={!awaitingChoice}
              onClick={() => {
                setGameStep(GameStep.PostGame)

                setAwaitingChoice(false)
              }}>
              Stand
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, visibility: 'hidden' }}
          animate={getAnimateState(gameStep === GameStep.Tentative)}>
          <p>Bust :(</p>
          <button
            className='text-sm w-20'
            onClick={() => {
              setDealerHand((prev) => {
                prev[0].flipped = false

                const value = calculateHandValue(dealerHand)

                setDealerScore(value)
                return [...prev]
              })
            }}>
            Click to see the dealer's face-down card (if you're curious)
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, visibility: 'hidden' }}
          animate={{ ...getAnimateState(mainScore === 21) }}>
          Blackjack!
        </motion.div>

        <motion.div
          initial={{ opacity: 0, visibility: 'hidden' }}
          animate={{
            ...getAnimateState(
              mainScore !== 0 && dealerScore !== 0 && mainScore === dealerScore,
            ),
            transition: { delay: gameStarted ? 500 : 0 },
          }}>
          Push!
        </motion.div>

        <motion.div>
          Games played: <CountUp end={gameCount} preserveValue={true} />
        </motion.div>
        <motion.div>
          Games lost: <CountUp end={gamesLost} preserveValue={true} />
        </motion.div>
        <motion.div>
          Games won: <CountUp end={gamesWon} preserveValue={true} />
        </motion.div>
      </div>
    </>
  )
}

const getAnimateState = (condition: boolean): TargetAndTransition => ({
  opacity: condition ? 1 : 0,
  visibility: condition ? 'visible' : 'hidden',
})

export default Blackjack
