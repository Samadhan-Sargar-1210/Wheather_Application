import precautionsData from '../data/weather_precautions.json'

/**
 * Get precautions for a given weather condition and user group.
 * @param {string} weatherCondition - e.g. 'rain', 'sunny', 'cold', 'snow', 'storm', 'fog'
 * @param {string} userGroup - e.g. 'city_residents', 'farmers', 'small_children', 'animals_livestock', 'commuters', 'elderly', 'athletes'
 * @returns {string[]} Array of precaution messages, or [] if none found.
 */
export function getPrecautions(weatherCondition, userGroup) {
  if (!weatherCondition || !userGroup) return []
  const group = precautionsData[weatherCondition]
  if (!group) return []
  return group[userGroup] || []
}

/**
 * Get all user groups for a weather condition.
 */
export function getUserGroupsForCondition(weatherCondition) {
  if (!weatherCondition) return []
  const group = precautionsData[weatherCondition]
  if (!group) return []
  return Object.keys(group)
} 