import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { z } from 'zod'
import { newDeck } from './card'

export const deckAtom = atom(newDeck())

const numberSchema = z.number().int().nonnegative()

export const gameCountAtom = atomWithStorage('gameCount', 0, {
  getItem(key, initialValue) {
    const storedValue = localStorage.getItem(key)
    try {
      return numberSchema.parse(JSON.parse(storedValue ?? ''))
    } catch {
      return initialValue
    }
  },
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem(key) {
    localStorage.removeItem(key)
  },
})

export const gamesWonAtom = atomWithStorage('gamesWon', 0, {
  getItem(key, initialValue) {
    const storedValue = localStorage.getItem(key)
    try {
      return numberSchema.parse(JSON.parse(storedValue ?? ''))
    } catch {
      return initialValue
    }
  },
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem(key) {
    localStorage.removeItem(key)
  },
})

export const gamesLostAtom = atomWithStorage('gamesLost', 0, {
  getItem(key, initialValue) {
    const storedValue = localStorage.getItem(key)
    try {
      return numberSchema.parse(JSON.parse(storedValue ?? ''))
    } catch {
      return initialValue
    }
  },
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem(key) {
    localStorage.removeItem(key)
  },
})
