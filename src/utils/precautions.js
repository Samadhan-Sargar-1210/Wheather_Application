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

// Dynamic Weather Precautions Generator
// Generates appropriate precautions based on temperature, weather conditions, and user groups

export const generateDynamicPrecautions = (weatherData) => {
  if (!weatherData) return {}

  const { temperature, condition, humidity, windSpeed, description } = weatherData
  const temp = temperature
  const isHot = temp >= 35
  const isWarm = temp >= 25 && temp < 35
  const isMild = temp >= 15 && temp < 25
  const isCool = temp >= 5 && temp < 15
  const isCold = temp < 5
  const isVeryCold = temp < 0

  const precautions = {
    city_residents: [],
    farmers: [],
    small_children: [],
    elderly: [],
    athletes: [],
    commuters: [],
    animals_livestock: [],
    outdoor_workers: [],
    drivers: []
  }

  // Temperature-based precautions
  if (isHot) {
    precautions.city_residents.push(
      `High temperature alert: ${temp}°C. Stay hydrated and avoid outdoor activities during peak hours (11 AM - 4 PM).`,
      "Use air conditioning or fans to stay cool. Wear light, loose-fitting clothing."
    )
    precautions.farmers.push(
      `Extreme heat (${temp}°C) may stress crops. Increase irrigation frequency and provide shade for sensitive plants.`,
      "Schedule farm work for early morning or evening hours to avoid heat exhaustion."
    )
    precautions.small_children.push(
      `High temperature (${temp}°C) - Keep children indoors during peak heat hours.`,
      "Ensure children drink plenty of water and wear light clothing if going outdoors."
    )
    precautions.elderly.push(
      `High temperature (${temp}°C) - Elderly are at higher risk. Stay in cool environments and drink extra fluids.`,
      "Avoid strenuous activities and check on elderly neighbors regularly."
    )
    precautions.athletes.push(
      `High temperature (${temp}°C) - Exercise early morning or evening only.`,
      "Increase water intake and take frequent breaks during outdoor activities."
    )
    precautions.outdoor_workers.push(
      `High temperature (${temp}°C) - Take frequent breaks in shade and drink water every 15-20 minutes.`,
      "Wear light-colored, loose clothing and use sunscreen."
    )
  } else if (isWarm) {
    precautions.city_residents.push(
      `Warm weather (${temp}°C) - Stay hydrated and wear light clothing.`,
      "Good weather for outdoor activities but avoid peak sun hours."
    )
    precautions.farmers.push(
      `Warm temperature (${temp}°C) - Monitor soil moisture and adjust irrigation as needed.`,
      "Good conditions for most crops. Continue regular farming activities."
    )
    precautions.small_children.push(
      `Warm weather (${temp}°C) - Children can play outdoors but ensure they stay hydrated.`,
      "Apply sunscreen and wear hats for outdoor activities."
    )
    precautions.athletes.push(
      `Warm weather (${temp}°C) - Good conditions for outdoor exercise.`,
      "Stay hydrated and wear appropriate clothing for your activity."
    )
  } else if (isMild) {
    precautions.city_residents.push(
      `Pleasant temperature (${temp}°C) - Ideal weather for outdoor activities.`,
      "Enjoy the comfortable weather but carry a light jacket for evening."
    )
    precautions.farmers.push(
      `Mild temperature (${temp}°C) - Excellent conditions for most agricultural activities.`,
      "Good time for planting, harvesting, and general farm maintenance."
    )
    precautions.small_children.push(
      `Pleasant weather (${temp}°C) - Great conditions for children to play outdoors.`,
      "Dress children appropriately for the mild temperature."
    )
    precautions.athletes.push(
      `Ideal temperature (${temp}°C) - Perfect conditions for outdoor sports and exercise.`,
      "Enjoy outdoor activities with moderate intensity."
    )
  } else if (isCool) {
    precautions.city_residents.push(
      `Cool temperature (${temp}°C) - Wear warm clothing and carry a jacket.`,
      "Good weather for outdoor activities but dress in layers."
    )
    precautions.farmers.push(
      `Cool temperature (${temp}°C) - Monitor crops for cold stress.`,
      "Consider frost protection for sensitive crops if temperature drops further."
    )
    precautions.small_children.push(
      `Cool weather (${temp}°C) - Dress children in warm layers.`,
      "Children can play outdoors but ensure they're properly dressed."
    )
    precautions.elderly.push(
      `Cool temperature (${temp}°C) - Elderly should wear warm clothing.`,
      "Avoid prolonged exposure to cold and keep homes adequately heated."
    )
  } else if (isCold) {
    precautions.city_residents.push(
      `Cold temperature (${temp}°C) - Wear heavy winter clothing and limit outdoor time.`,
      "Keep homes heated and avoid unnecessary outdoor activities."
    )
    precautions.farmers.push(
      `Cold temperature (${temp}°C) - Protect crops from frost damage.`,
      "Provide shelter for livestock and ensure water sources don't freeze."
    )
    precautions.small_children.push(
      `Cold weather (${temp}°C) - Keep children indoors or dress them very warmly.`,
      "Limit outdoor play time and ensure children stay warm."
    )
    precautions.elderly.push(
      `Cold temperature (${temp}°C) - Elderly are at risk of hypothermia.`,
      "Stay indoors, keep homes heated, and avoid outdoor activities."
    )
    precautions.animals_livestock.push(
      `Cold temperature (${temp}°C) - Provide warm shelter and extra feed for livestock.`,
      "Ensure water sources are not frozen and animals have adequate bedding."
    )
  } else if (isVeryCold) {
    precautions.city_residents.push(
      `Very cold temperature (${temp}°C) - Extreme cold warning. Stay indoors if possible.`,
      "Wear multiple layers, cover extremities, and avoid outdoor activities."
    )
    precautions.farmers.push(
      `Extreme cold (${temp}°C) - High risk of crop damage. Implement frost protection measures.`,
      "Provide heated shelters for livestock and ensure adequate feed supply."
    )
    precautions.small_children.push(
      `Very cold weather (${temp}°C) - Keep children indoors.`,
      "If going outdoors, dress children in multiple warm layers."
    )
    precautions.elderly.push(
      `Extreme cold (${temp}°C) - High risk for elderly. Stay indoors and keep homes heated.`,
      "Avoid all outdoor activities and check heating systems."
    )
    precautions.animals_livestock.push(
      `Extreme cold (${temp}°C) - Critical livestock protection needed.`,
      "Provide heated shelters, extra feed, and ensure water doesn't freeze."
    )
  }

  // Weather condition-based precautions
  const conditionLower = condition.toLowerCase()
  const descriptionLower = description.toLowerCase()

  if (conditionLower.includes('rain') || descriptionLower.includes('rain')) {
    precautions.city_residents.push(
      "Rain expected - Carry an umbrella and wear waterproof footwear.",
      "Be cautious of slippery surfaces and reduced visibility."
    )
    precautions.farmers.push(
      "Rain may affect farming activities. Check drainage systems and protect sensitive crops.",
      "Consider postponing outdoor farm work until weather improves."
    )
    precautions.commuters.push(
      "Rain may cause traffic delays. Allow extra travel time and drive carefully.",
      "Use headlights and maintain safe distance from other vehicles."
    )
    precautions.drivers.push(
      "Wet roads reduce traction. Drive slowly and maintain safe distance.",
      "Use windshield wipers and ensure all lights are working."
    )
    precautions.small_children.push(
      "Rainy weather - Keep children indoors or ensure they wear rain gear.",
      "Avoid outdoor play in heavy rain to prevent illness."
    )
  }

  if (conditionLower.includes('storm') || descriptionLower.includes('thunder')) {
    precautions.city_residents.push(
      "Storm warning - Stay indoors and avoid unnecessary travel.",
      "Secure loose objects and stay away from windows during storms."
    )
    precautions.farmers.push(
      "Storm may damage crops and equipment. Secure loose items and shelter livestock.",
      "Monitor weather updates and prepare for potential power outages."
    )
    precautions.small_children.push(
      "Storm warning - Keep children indoors and away from windows.",
      "Provide comfort and reassurance during thunder and lightning."
    )
    precautions.drivers.push(
      "Storm conditions - Avoid driving if possible. If driving, use extreme caution.",
      "Pull over safely if visibility becomes too poor."
    )
  }

  if (conditionLower.includes('snow') || descriptionLower.includes('snow')) {
    precautions.city_residents.push(
      "Snow expected - Wear warm, waterproof clothing and boots.",
      "Clear walkways of snow and ice for safety."
    )
    precautions.farmers.push(
      "Snow may damage crops. Implement snow protection measures.",
      "Ensure livestock have warm, dry shelter and adequate feed."
    )
    precautions.commuters.push(
      "Snow may cause significant travel delays. Consider working from home if possible.",
      "Check public transport schedules for delays and cancellations."
    )
    precautions.drivers.push(
      "Snow and ice on roads - Drive very slowly and maintain extra distance.",
      "Use winter tires if available and carry emergency supplies."
    )
  }

  if (conditionLower.includes('fog') || descriptionLower.includes('fog')) {
    precautions.commuters.push(
      "Fog reduces visibility - Allow extra travel time and drive with caution.",
      "Use low beam headlights and maintain safe distance."
    )
    precautions.drivers.push(
      "Foggy conditions - Use fog lights if available and drive slowly.",
      "Avoid sudden braking and be extra alert for other vehicles."
    )
    precautions.city_residents.push(
      "Fog reduces visibility - Be cautious when walking or cycling.",
      "Wear bright or reflective clothing if going outdoors."
    )
  }

  if (conditionLower.includes('wind') || windSpeed > 20) {
    precautions.city_residents.push(
      `Strong winds (${windSpeed} km/h) - Secure loose objects and be cautious outdoors.`,
      "Avoid outdoor activities that could be dangerous in high winds."
    )
    precautions.farmers.push(
      `Strong winds (${windSpeed} km/h) - Protect crops and secure farm equipment.`,
      "Monitor for potential damage to structures and crops."
    )
    precautions.drivers.push(
      `Strong winds (${windSpeed} km/h) - Drive carefully, especially high-profile vehicles.`,
      "Be prepared for sudden gusts and reduced vehicle control."
    )
  }

  // Humidity-based precautions
  if (humidity > 80) {
    precautions.city_residents.push(
      "High humidity - Stay hydrated and avoid strenuous outdoor activities.",
      "Use air conditioning or fans to stay comfortable."
    )
    precautions.farmers.push(
      "High humidity may promote fungal diseases in crops. Monitor for signs of infection.",
      "Ensure proper ventilation in greenhouses and storage areas."
    )
  } else if (humidity < 30) {
    precautions.city_residents.push(
      "Low humidity - Stay hydrated and use moisturizer for skin and lips.",
      "Consider using a humidifier indoors."
    )
    precautions.farmers.push(
      "Low humidity - Increase irrigation frequency to prevent crop stress.",
      "Monitor soil moisture levels more frequently."
    )
  }

  // UV Index precautions (if available)
  if (weatherData.uvIndex >= 8) {
    precautions.city_residents.push(
      "High UV index - Wear sunscreen, protective clothing, and avoid peak sun hours.",
      "Seek shade during midday hours (10 AM - 4 PM)."
    )
    precautions.small_children.push(
      "High UV index - Protect children with sunscreen, hats, and protective clothing.",
      "Limit outdoor play during peak sun hours."
    )
    precautions.outdoor_workers.push(
      "High UV index - Wear protective clothing, sunscreen, and take breaks in shade.",
      "Stay hydrated and monitor for signs of heat stress."
    )
  }

  // Remove empty arrays and return only populated precautions
  const filteredPrecautions = {}
  Object.keys(precautions).forEach(key => {
    if (precautions[key].length > 0) {
      filteredPrecautions[key] = precautions[key]
    }
  })

  return filteredPrecautions
}

// Get precautions for specific user group
export const getPrecautionsForGroup = (weatherData, userGroup) => {
  const allPrecautions = generateDynamicPrecautions(weatherData)
  return allPrecautions[userGroup] || []
}

// Get all precautions
export const getAllPrecautions = (weatherData) => {
  return generateDynamicPrecautions(weatherData)
} 