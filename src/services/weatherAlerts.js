// Weather Alerts Service
// Handles severe weather alerts and safety recommendations

// Alert severity levels
export const ALERT_LEVELS = {
  MINOR: 'minor',
  MODERATE: 'moderate',
  SEVERE: 'severe',
  EXTREME: 'extreme'
}

// Alert types
export const ALERT_TYPES = {
  STORM: 'storm',
  CYCLONE: 'cyclone',
  FLOOD: 'flood',
  HEATWAVE: 'heatwave',
  COLD_WAVE: 'cold_wave',
  DROUGHT: 'drought',
  WILDFIRE: 'wildfire',
  TORNADO: 'tornado',
  HURRICANE: 'hurricane',
  BLIZZARD: 'blizzard',
  FOG: 'fog',
  DUST_STORM: 'dust_storm'
}

// Get alert color based on severity
export const getAlertColor = (severity) => {
  switch (severity) {
    case ALERT_LEVELS.MINOR:
      return '#FFD700' // Gold
    case ALERT_LEVELS.MODERATE:
      return '#FF8C00' // Orange
    case ALERT_LEVELS.SEVERE:
      return '#FF4500' // Red-Orange
    case ALERT_LEVELS.EXTREME:
      return '#8B0000' // Dark Red
    default:
      return '#FFD700'
  }
}

// Get alert icon based on type
export const getAlertIcon = (type) => {
  switch (type) {
    case ALERT_TYPES.STORM:
      return '⛈️'
    case ALERT_TYPES.CYCLONE:
      return '🌀'
    case ALERT_TYPES.FLOOD:
      return '🌊'
    case ALERT_TYPES.HEATWAVE:
      return '🔥'
    case ALERT_TYPES.COLD_WAVE:
      return '❄️'
    case ALERT_TYPES.DROUGHT:
      return '🏜️'
    case ALERT_TYPES.WILDFIRE:
      return '🔥'
    case ALERT_TYPES.TORNADO:
      return '🌪️'
    case ALERT_TYPES.HURRICANE:
      return '🌀'
    case ALERT_TYPES.BLIZZARD:
      return '❄️'
    case ALERT_TYPES.FOG:
      return '🌫️'
    case ALERT_TYPES.DUST_STORM:
      return '💨'
    default:
      return '⚠️'
  }
}

// Get safety recommendations based on alert type and severity
export const getSafetyRecommendations = (type, severity) => {
  const recommendations = {
    [ALERT_TYPES.STORM]: {
      [ALERT_LEVELS.MINOR]: [
        "Stay indoors and away from windows",
        "Secure loose objects outside",
        "Monitor local weather updates"
      ],
      [ALERT_LEVELS.MODERATE]: [
        "Stay indoors and away from windows",
        "Secure loose objects outside",
        "Avoid driving if possible",
        "Keep emergency supplies ready"
      ],
      [ALERT_LEVELS.SEVERE]: [
        "Seek shelter immediately",
        "Stay away from windows and doors",
        "Avoid driving - roads may be dangerous",
        "Keep emergency supplies and documents ready",
        "Monitor emergency broadcasts"
      ],
      [ALERT_LEVELS.EXTREME]: [
        "Seek immediate shelter in a sturdy building",
        "Stay away from all windows and doors",
        "Do not attempt to drive",
        "Keep emergency supplies and important documents ready",
        "Monitor emergency broadcasts continuously",
        "Be prepared to evacuate if ordered"
      ]
    },
    [ALERT_TYPES.CYCLONE]: {
      [ALERT_LEVELS.MINOR]: [
        "Monitor cyclone updates",
        "Secure loose objects",
        "Prepare emergency supplies"
      ],
      [ALERT_LEVELS.MODERATE]: [
        "Stay indoors and away from windows",
        "Secure all loose objects",
        "Prepare emergency supplies",
        "Monitor official updates"
      ],
      [ALERT_LEVELS.SEVERE]: [
        "Seek shelter in a sturdy building",
        "Stay away from windows and doors",
        "Prepare for power outages",
        "Keep emergency supplies ready",
        "Monitor official emergency broadcasts"
      ],
      [ALERT_LEVELS.EXTREME]: [
        "Seek immediate shelter in a designated safe location",
        "Stay away from all windows and doors",
        "Prepare for extended power outages",
        "Keep emergency supplies and important documents ready",
        "Monitor official emergency broadcasts continuously",
        "Be prepared to evacuate immediately if ordered"
      ]
    },
    [ALERT_TYPES.FLOOD]: {
      [ALERT_LEVELS.MINOR]: [
        "Avoid low-lying areas",
        "Do not walk through floodwaters",
        "Monitor water levels"
      ],
      [ALERT_LEVELS.MODERATE]: [
        "Avoid low-lying areas and floodwaters",
        "Move to higher ground if necessary",
        "Do not drive through flooded roads",
        "Monitor official updates"
      ],
      [ALERT_LEVELS.SEVERE]: [
        "Move to higher ground immediately",
        "Do not walk or drive through floodwaters",
        "Avoid bridges over fast-moving water",
        "Keep emergency supplies ready",
        "Monitor official emergency broadcasts"
      ],
      [ALERT_LEVELS.EXTREME]: [
        "Evacuate to higher ground immediately",
        "Do not attempt to walk or drive through floodwaters",
        "Avoid all bridges and low-lying areas",
        "Keep emergency supplies and important documents ready",
        "Monitor official emergency broadcasts continuously",
        "Follow evacuation orders immediately"
      ]
    },
    [ALERT_TYPES.HEATWAVE]: {
      [ALERT_LEVELS.MINOR]: [
        "Stay hydrated",
        "Avoid prolonged sun exposure",
        "Wear light clothing"
      ],
      [ALERT_LEVELS.MODERATE]: [
        "Stay hydrated and cool",
        "Avoid outdoor activities during peak hours",
        "Wear light, loose clothing",
        "Use air conditioning if available"
      ],
      [ALERT_LEVELS.SEVERE]: [
        "Stay indoors in air-conditioned spaces",
        "Drink plenty of water",
        "Avoid outdoor activities",
        "Check on elderly and vulnerable individuals",
        "Monitor for heat-related illness symptoms"
      ],
      [ALERT_LEVELS.EXTREME]: [
        "Stay indoors in air-conditioned spaces only",
        "Drink plenty of water and avoid alcohol",
        "Avoid all outdoor activities",
        "Check on elderly, children, and vulnerable individuals frequently",
        "Monitor for heat-related illness symptoms",
        "Seek medical attention immediately if symptoms occur"
      ]
    },
    [ALERT_TYPES.COLD_WAVE]: {
      [ALERT_LEVELS.MINOR]: [
        "Dress warmly",
        "Limit outdoor exposure",
        "Keep home heated"
      ],
      [ALERT_LEVELS.MODERATE]: [
        "Dress in layers",
        "Limit outdoor exposure",
        "Keep home heated",
        "Check on elderly neighbors"
      ],
      [ALERT_LEVELS.SEVERE]: [
        "Stay indoors as much as possible",
        "Dress in multiple layers",
        "Keep home heated",
        "Check on elderly and vulnerable individuals",
        "Avoid unnecessary travel"
      ],
      [ALERT_LEVELS.EXTREME]: [
        "Stay indoors unless absolutely necessary",
        "Dress in multiple warm layers",
        "Keep home heated and insulated",
        "Check on elderly, children, and vulnerable individuals frequently",
        "Avoid all unnecessary travel",
        "Be prepared for power outages"
      ]
    }
  }

  return recommendations[type]?.[severity] || [
    "Stay informed about local weather conditions",
    "Follow official safety recommendations",
    "Keep emergency supplies ready"
  ]
}

// Mock function to get weather alerts (replace with real API call)
export const getMockWeatherAlerts = async (city) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Simulate different alert scenarios based on city
  const cityLower = city.toLowerCase()
  
  // Simulate severe weather for certain cities
  if (cityLower.includes('storm') || cityLower.includes('cyclone')) {
    return [
      {
        id: 1,
        type: ALERT_TYPES.STORM,
        severity: ALERT_LEVELS.SEVERE,
        title: 'Severe Thunderstorm Warning',
        description: 'Severe thunderstorms with heavy rain, strong winds, and possible hail expected.',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        area: city,
        color: getAlertColor(ALERT_LEVELS.SEVERE),
        icon: getAlertIcon(ALERT_TYPES.STORM),
        recommendations: getSafetyRecommendations(ALERT_TYPES.STORM, ALERT_LEVELS.SEVERE)
      }
    ]
  }
  
  if (cityLower.includes('flood') || cityLower.includes('rain')) {
    return [
      {
        id: 2,
        type: ALERT_TYPES.FLOOD,
        severity: ALERT_LEVELS.MODERATE,
        title: 'Flood Watch',
        description: 'Heavy rainfall may cause flooding in low-lying areas.',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
        area: city,
        color: getAlertColor(ALERT_LEVELS.MODERATE),
        icon: getAlertIcon(ALERT_TYPES.FLOOD),
        recommendations: getSafetyRecommendations(ALERT_TYPES.FLOOD, ALERT_LEVELS.MODERATE)
      }
    ]
  }
  
  if (cityLower.includes('heat') || cityLower.includes('hot')) {
    return [
      {
        id: 3,
        type: ALERT_TYPES.HEATWAVE,
        severity: ALERT_LEVELS.SEVERE,
        title: 'Heat Wave Warning',
        description: 'Extreme heat conditions with temperatures exceeding normal levels.',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        area: city,
        color: getAlertColor(ALERT_LEVELS.SEVERE),
        icon: getAlertIcon(ALERT_TYPES.HEATWAVE),
        recommendations: getSafetyRecommendations(ALERT_TYPES.HEATWAVE, ALERT_LEVELS.SEVERE)
      }
    ]
  }
  
  if (cityLower.includes('cold') || cityLower.includes('snow')) {
    return [
      {
        id: 4,
        type: ALERT_TYPES.COLD_WAVE,
        severity: ALERT_LEVELS.MODERATE,
        title: 'Cold Wave Alert',
        description: 'Unusually cold temperatures expected with possible frost.',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
        area: city,
        color: getAlertColor(ALERT_LEVELS.MODERATE),
        icon: getAlertIcon(ALERT_TYPES.COLD_WAVE),
        recommendations: getSafetyRecommendations(ALERT_TYPES.COLD_WAVE, ALERT_LEVELS.MODERATE)
      }
    ]
  }
  
  // Random alerts for other cities (20% chance)
  if (Math.random() < 0.2) {
    const alertTypes = Object.values(ALERT_TYPES)
    const severities = Object.values(ALERT_LEVELS)
    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)]
    
    return [
      {
        id: Math.floor(Math.random() * 1000),
        type: randomType,
        severity: randomSeverity,
        title: `${randomType.charAt(0).toUpperCase() + randomType.slice(1)} Alert`,
        description: `Weather conditions may cause ${randomType} in the area.`,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        area: city,
        color: getAlertColor(randomSeverity),
        icon: getAlertIcon(randomType),
        recommendations: getSafetyRecommendations(randomType, randomSeverity)
      }
    ]
  }
  
  return []
}

// Mock function to get weather alerts by coordinates
export const getMockWeatherAlertsByCoords = async (lat, lon) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Simulate alerts based on coordinates (random)
  if (Math.random() < 0.3) {
    const alertTypes = [ALERT_TYPES.STORM, ALERT_TYPES.FLOOD, ALERT_TYPES.HEATWAVE]
    const severities = [ALERT_LEVELS.MINOR, ALERT_LEVELS.MODERATE]
    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)]
    
    return [
      {
        id: Math.floor(Math.random() * 1000),
        type: randomType,
        severity: randomSeverity,
        title: `${randomType.charAt(0).toUpperCase() + randomType.slice(1)} Watch`,
        description: `Weather conditions may cause ${randomType} in your area.`,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        area: 'Your Location',
        color: getAlertColor(randomSeverity),
        icon: getAlertIcon(randomType),
        recommendations: getSafetyRecommendations(randomType, randomSeverity)
      }
    ]
  }
  
  return []
} 