import { Icon } from '@iconify/react'
import Blackjack from './components/blackjack'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './components/ui/hover-card'
import Markdown from 'react-markdown'
import info from '@/assets/info.md?raw'
import { markdowns } from './utils/info'
import { motion } from 'motion/react'

function App() {
  console.log(info)
  return (
    <>
      <Blackjack />
      <div className='top-0 right-0 fixed m-2'>
        <HoverCard>
          <HoverCardTrigger>
            <motion.div
              className='cursor-help'
              whileHover={{
                scale: 1.2,
                transition: { stiffness: 100, damping: 25 },
              }}>
              <Icon icon='material-symbols:info' width='32' height='32' />
            </motion.div>
          </HoverCardTrigger>
          <HoverCardContent className='text-sm'>
            <Markdown components={markdowns}>{info}</Markdown>
          </HoverCardContent>
        </HoverCard>
      </div>
    </>
  )
}

export default App
