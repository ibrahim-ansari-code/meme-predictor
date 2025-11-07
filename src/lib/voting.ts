/**
 * Voting Service
 * 
 * This file handles all voting logic using JavaScript functions instead of database functions.
 * This approach is easier to understand and debug.
 */

import { supabase, type Character, type Vote } from './supabase'
import { calculateEloChange, getResultForA } from './elo'

/**
 * Process a vote between two characters
 * @param characterAId - ID of the first character
 * @param characterBId - ID of the second character
 * @param winnerId - ID of the winner (null for draw/tie)
 * @returns Object with ELO changes and vote information
 */
export async function processVote(
  characterAId: string,
  characterBId: string,
  winnerId: string | null
) {
  try {
    // Step 1: Fetch both characters to get their current ELO ratings
    const { data: characters, error: fetchError } = await supabase
      .from('characters')
      .select('*')
      .in('id', [characterAId, characterBId])

    if (fetchError) throw fetchError
    if (!characters || characters.length !== 2) {
      throw new Error('Could not find both characters')
    }

    // Find which is A and which is B
    const characterA = characters.find(c => c.id === characterAId) as Character
    const characterB = characters.find(c => c.id === characterBId) as Character

    if (!characterA || !characterB) {
      throw new Error('Could not find both characters')
    }

    // Step 2: Calculate ELO changes using our JavaScript function
    const resultA = getResultForA(winnerId, characterAId)
    const eloCalculation = calculateEloChange(
      characterA.elo_rating,
      characterB.elo_rating,
      resultA
    )

    // Step 3: Update both characters in the database
    // We'll use a transaction-like approach by updating both sequentially
    // (Supabase doesn't support transactions in the client, but updates are atomic)

    // Determine win/loss/draw stats for character A
    const aWins = resultA === 1.0 ? 1 : 0
    const aLosses = resultA === 0.0 ? 1 : 0
    const aDraws = resultA === 0.5 ? 1 : 0

    // Determine win/loss/draw stats for character B (opposite of A)
    const bWins = resultA === 0.0 ? 1 : 0
    const bLosses = resultA === 1.0 ? 1 : 0
    const bDraws = resultA === 0.5 ? 1 : 0

    // Update character A
    const { error: updateAError } = await supabase
      .from('characters')
      .update({
        elo_rating: eloCalculation.newEloA,
        total_votes: characterA.total_votes + 1,
        wins: characterA.wins + aWins,
        losses: characterA.losses + aLosses,
        draws: characterA.draws + aDraws,
      })
      .eq('id', characterAId)

    if (updateAError) throw updateAError

    // Update character B
    const { error: updateBError } = await supabase
      .from('characters')
      .update({
        elo_rating: eloCalculation.newEloB,
        total_votes: characterB.total_votes + 1,
        wins: characterB.wins + bWins,
        losses: characterB.losses + bLosses,
        draws: characterB.draws + bDraws,
      })
      .eq('id', characterBId)

    if (updateBError) throw updateBError

    // Step 4: Record the vote in the votes table
    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .insert({
        character_a_id: characterAId,
        character_b_id: characterBId,
        winner_id: winnerId,
        elo_change_a: eloCalculation.changeA,
        elo_change_b: eloCalculation.changeB,
        elo_before_a: characterA.elo_rating,
        elo_before_b: characterB.elo_rating,
        elo_after_a: eloCalculation.newEloA,
        elo_after_b: eloCalculation.newEloB,
      })
      .select()
      .single()

    if (voteError) throw voteError

    // Step 5: Return the results for displaying to the user
    return {
      vote: vote as Vote,
      characterA: {
        ...characterA,
        elo_rating: eloCalculation.newEloA,
      },
      characterB: {
        ...characterB,
        elo_rating: eloCalculation.newEloB,
      },
      eloChanges: {
        characterA: {
          before: characterA.elo_rating,
          after: eloCalculation.newEloA,
          change: eloCalculation.changeA,
        },
        characterB: {
          before: characterB.elo_rating,
          after: eloCalculation.newEloB,
          change: eloCalculation.changeB,
        },
      },
    }
  } catch (error) {
    console.error('Error processing vote:', error)
    throw error
  }
}

/**
 * Get two random characters for a matchup
 * @returns Two different characters
 */
export async function getRandomMatchup(): Promise<[Character, Character] | null> {
  try {
    // Get all characters
    const { data: characters, error } = await supabase
      .from('characters')
      .select('*')
      .order('elo_rating', { ascending: false })

    if (error) throw error
    if (!characters || characters.length < 2) {
      return null
    }

    // Pick two random characters
    const shuffled = [...characters].sort(() => Math.random() - 0.5)
    return [shuffled[0], shuffled[1]]
  } catch (error) {
    console.error('Error getting random matchup:', error)
    return null
  }
}

/**
 * Get leaderboard (all characters sorted by ELO)
 * @returns Array of characters sorted by ELO rating
 */
export async function getLeaderboard(): Promise<Character[]> {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('elo_rating', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return []
  }
}

