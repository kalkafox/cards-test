import { type Card } from '@/types/card'

export enum CardColor {
  Red = 'text-red-500',
  Black = 'text-zinc-800',
  White = 'text-zinc-100',
  Green = 'text-green-500',
}

export enum CardSuit {
  Spades = 'ph:spade-fill',
  Clubs = 'ph:club-fill',
  Hearts = 'ph:heart-fill',
  Diamonds = 'ph:diamond-fill',
}

export enum CardType {
  Ace = 'A',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
}

export function randomRange(min: number, max: number): number {
  if (min > max) {
    throw new Error('Min value cannot be greater than Max value.')
  }
  return Math.random() * (max - min) + min
}

export function getCardColor(suit: CardSuit): CardColor {
  switch (suit) {
    case CardSuit.Diamonds:
    case CardSuit.Hearts:
      return CardColor.Red
    case CardSuit.Clubs:
      return CardColor.Green
    default:
      return CardColor.White
  }
}

export function generateHexID(): string {
  // Generate a random 8-character hexadecimal ID
  return Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .padStart(8, '0')
}

export const randomCard = (flipped: boolean = false) => {
  const card: Card = {
    ...STATIC_DECK[Math.floor(Math.random() * STATIC_DECK.length)],
  }

  card.flipped = flipped

  card.id = generateHexID()

  return card
}

export const newDeck = () => {
  const deck: Card[] = []

  Object.values(CardSuit).forEach((suit) => {
    Object.values(CardType).forEach((type) => {
      deck.push({ suit, type, flipped: false })
    })
  })

  const shuffledDeck = [...deck]

  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]]
  }

  return shuffledDeck
}

export const STATIC_DECK = newDeck()
