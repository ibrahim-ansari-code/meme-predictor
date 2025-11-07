/**
 * ELO Rating System Functions
 * 
 * These functions calculate ELO rating changes based on matchups.
 * This is the same logic that would be in database functions, but in JavaScript.
 */

const K_FACTOR = 32 // Standard K-factor for ELO systems

/**
 * Calculate the expected score (probability of winning) for a player
 * @param eloA - ELO rating of player A
 * @param eloB - ELO rating of player B
 * @returns Expected score for player A (0 to 1)
 */
export function calculateExpectedScore(eloA: number, eloB: number): number {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400))
}

/**
 * Calculate new ELO ratings after a match
 * @param eloA - Current ELO of character A
 * @param eloB - Current ELO of character B
 * @param resultA - Result for character A: 1 = win, 0.5 = draw, 0 = loss
 * @returns Object with new ELOs and changes
 */
export function calculateEloChange(
  eloA: number,
  eloB: number,
  resultA: number // 1 for win, 0.5 for draw, 0 for loss
) {
  // Calculate expected scores
  const expectedA = calculateExpectedScore(eloA, eloB)
  const expectedB = calculateExpectedScore(eloB, eloA)

  // Calculate new ELO ratings
  const newEloA = eloA + K_FACTOR * (resultA - expectedA)
  const newEloB = eloB + K_FACTOR * ((1 - resultA) - expectedB)

  return {
    newEloA: Math.round(newEloA * 100) / 100, // Round to 2 decimal places
    newEloB: Math.round(newEloB * 100) / 100,
    changeA: Math.round((newEloA - eloA) * 100) / 100,
    changeB: Math.round((newEloB - eloB) * 100) / 100,
  }
}

/**
 * Determine the result value for character A based on winner
 * @param winnerId - ID of the winning character (null for draw)
 * @param characterAId - ID of character A
 * @returns Result value: 1 = A wins, 0.5 = draw, 0 = A loses
 */
export function getResultForA(winnerId: string | null, characterAId: string): number {
  if (winnerId === null) return 0.5 // Draw
  if (winnerId === characterAId) return 1.0 // A wins
  return 0.0 // A loses
}

