import { Card } from '@/types/card'
import { CardType } from './card'

export enum GameStep {
  PreGame,
  Game,
  PostGame,
  Final,
  Tentative,
}

export function calculateHandValue(hand: Card[]): number {
  let total = 0
  let aceCount = 0

  hand.forEach((card) => {
    if (card.flipped) {
      return
    }
    switch (card.type) {
      case CardType.Ace:
        aceCount++
        total += 11 // Assume Ace is 11 initially
        break
      case CardType.Two:
        total += 2
        break
      case CardType.Three:
        total += 3
        break
      case CardType.Four:
        total += 4
        break
      case CardType.Five:
        total += 5
        break
      case CardType.Six:
        total += 6
        break
      case CardType.Seven:
        total += 7
        break
      case CardType.Eight:
        total += 8
        break
      case CardType.Nine:
        total += 9
        break
      case CardType.Ten:
      case CardType.Jack:
      case CardType.Queen:
      case CardType.King:
        total += 10
        break
      default:
        throw new Error(`Unknown card type: ${card.type}`)
    }
  })

  // Adjust for Aces if total exceeds 21
  while (total > 21 && aceCount > 0) {
    total -= 10 // Treat one Ace as 1 instead of 11
    aceCount--
  }

  return total
}
