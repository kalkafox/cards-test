import Card from '@/components/card'
import { type Card as TCard } from '@/types/card'
import { deckAtom } from '@/utils/atom'
import { useAtom } from 'jotai'
import { motion } from 'motion/react'
import { useState } from 'react'

function TestComponent() {
  const [flipped, setFlipped] = useState(false)

  const [cards] = useAtom(deckAtom)

  const [hand] = useState(() => {
    const handDeck: TCard[] = []

    for (let i = 0; i < 5; i++) {
      if (cards.length === 0) break

      const card = cards.pop()!

      handDeck.push(card)
    }

    return handDeck
  })

  const [finalYValues] = useState(
    cards.map(() => Math.floor(Math.random() * 20) - 5)
  )

  return (
    <>
      <div className="fixed w-full h-full bg-stone-950 heropattern-diagonallines-stone-800/50 -z-20 top-0"></div>
      {/* <div className='flex gap-8 m-2'>
        <Card suit={CardSuit.Hearts} type={CardType.King} />
        <Card isFlipped={flipped} />
        <Card
          isFlipped={flipped}
          suit={CardSuit.Diamonds}
          type={CardType.Five}
        />
        <Card suit={CardSuit.Clubs} type={CardType.Queen} />
      </div> */}
      <motion.ul className="flex gap-8 justify-center m-4">
        {hand.map((item, index) => (
          <motion.li
            key={`${item.type}-${item.suit}`}
            whileHover={{ y: 0, transition: { bounce: 0 } }}
            initial={{
              opacity: 0,
              y: Math.floor(Math.random() * (200 - 150 + 1)) + 150,
              rotateX: 80,
              rotateY: 80,
              translateZ: 90,
              transformStyle: 'preserve-3d',
            }}
            animate={{
              opacity: 1,
              y: finalYValues[index],
              rotateX: 0,
              rotateY: 0,
              transformStyle: 'unset',
            }}
            transition={{ delay: index * 0.1 }}
          >
            <Card isFlipped={flipped} type={item.type} suit={item.suit} />
          </motion.li>
        ))}
      </motion.ul>

      <button
        onClick={() => {
          setFlipped((val) => !val)
        }}
      >
        Click to flip cards
      </button>
    </>
  )
}

export default TestComponent
