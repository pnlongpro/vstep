/**
 * Badge Helpers - Easy integration for triggering badges
 * 
 * Usage in practice components:
 * 
 * import { triggerBadgeCheck } from '../utils/badgeHelpers';
 * 
 * // When user completes a reading exercise with 85% score:
 * const newBadges = triggerBadgeCheck('reading', 85);
 * if (newBadges.length > 0 && onBadgeUnlocked) {
 *   onBadgeUnlocked(newBadges[0]); // Show first unlocked badge
 * }
 */

import { incrementCompletedTests, BadgeDefinition } from './badgeService';

export type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';

/**
 * Trigger badge check after completing an exercise
 * @param skill - The skill that was practiced
 * @param score - Score percentage (0-100), optional
 * @returns Array of newly unlocked badges
 */
export function triggerBadgeCheck(skill: SkillType, score?: number): BadgeDefinition[] {
  return incrementCompletedTests(skill, score);
}

/**
 * Demo function to simulate completing exercises
 * Useful for testing badge system
 */
export function demoCompleteBatch(skill: SkillType, count: number = 1, score: number = 75): BadgeDefinition[] {
  const allNewBadges: BadgeDefinition[] = [];
  
  for (let i = 0; i < count; i++) {
    const badges = incrementCompletedTests(skill, score);
    badges.forEach(badge => {
      if (!allNewBadges.find(b => b.id === badge.id)) {
        allNewBadges.push(badge);
      }
    });
  }
  
  return allNewBadges;
}
