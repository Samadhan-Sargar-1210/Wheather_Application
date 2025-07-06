import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import hi from './locales/hi.json'
import mr from './locales/mr.json'
import ta from './locales/ta.json'

const resources = {
  en: {
    translation: {
      weather: {
        title: 'Weather App',
        welcome: {
          message: 'Welcome to Weather App',
          description: 'Get real-time weather information for any city'
        },
        search: {
          placeholder: 'Enter city name...',
          button: 'Search',
          location: 'Use My Location'
        },
        loading: {
          text: 'Loading weather data...'
        },
        error: {
          'City not found': 'City not found',
          'Invalid API key': 'Invalid API key',
          'Rate limit exceeded': 'Rate limit exceeded',
          'Failed to fetch weather data': 'Failed to fetch weather data',
          'Network error': 'Network error',
          'Failed to fetch forecast data': 'Failed to fetch forecast data',
          'Failed to fetch AQI data': 'Failed to fetch AQI data',
          'Failed to fetch weather alerts': 'Failed to fetch weather alerts',
          'Invalid coordinates': 'Invalid coordinates',
          'Coordinates out of range': 'Coordinates out of range',
          'City name is required': 'City name is required'
        },
        humidity: 'Humidity',
        wind: 'Wind',
        pressure: 'Pressure',
        visibility: 'Visibility',
        forecast: {
          title: '5-Day Forecast',
          chart: {
            title: 'Temperature & Rain Chance',
            temperature: 'Temperature',
            rain_chance: 'Rain Chance'
          }
        },
        aqi: {
          title: 'Air Quality Index',
          good: 'Good',
          fair: 'Fair',
          moderate: 'Moderate',
          poor: 'Poor',
          very_poor: 'Very Poor',
          health: {
            title: 'Health Advisory',
            good: 'Air quality is good. Enjoy outdoor activities.',
            fair: 'Air quality is acceptable. Sensitive individuals may experience symptoms.',
            moderate: 'Air quality is moderate. Limit outdoor activities.',
            poor: 'Air quality is poor. Avoid outdoor activities.',
            very_poor: 'Air quality is very poor. Stay indoors.'
          },
          pollutants: {
            title: 'Pollutant Breakdown'
          },
          recommendations: {
            title: 'Recommendations',
            stay_indoors: 'Stay indoors when possible',
            avoid_exercise: 'Avoid outdoor exercise',
            use_mask: 'Consider using a mask outdoors'
          }
        },
        alerts: {
          title: 'Weather Alerts',
          loading: 'Loading alerts...',
          view_details: 'View Details',
          active_until: 'Active until',
          safety_recommendations: 'Safety Recommendations'
        },
        precautions: {
          title: 'Weather Precautions',
          city_residents: 'City Residents',
          children: 'Children',
          farmers: 'Farmers',
          animals: 'Animals'
        },
        voice: {
          speak: 'Speak Weather',
          stop: 'Stop Speaking'
        },
        speaking: {
          text: 'Current weather in {{city}} is {{temp}} degrees Celsius with {{condition}}'
        },
        theme: {
          selector: 'Theme Selector',
          light: 'Light Theme',
          dark: 'Dark Theme',
          'high-contrast': 'High Contrast Theme'
        },
        location: {
          button: 'Use My Location'
        },
        farmer: {
          calendar: {
            title: 'Farmer Advisory Calendar',
            legend: {
              title: 'Legend',
              sowing: 'Optimal Sowing',
              rainfall: 'Expected Rainfall',
              protection: 'Crop Protection',
              harvest: 'Harvest Time'
            }
          }
        }
      }
    }
  },
  hi: {
    translation: {
      weather: {
        title: 'मौसम ऐप',
        welcome: {
          message: 'मौसम ऐप में आपका स्वागत है',
          description: 'किसी भी शहर के लिए रीयल-टाइम मौसम की जानकारी प्राप्त करें'
        },
        search: {
          placeholder: 'शहर का नाम दर्ज करें...',
          button: 'खोजें',
          location: 'मेरा स्थान उपयोग करें'
        },
        loading: {
          text: 'मौसम डेटा लोड हो रहा है...'
        },
        error: {
          'City not found': 'शहर नहीं मिला',
          'Invalid API key': 'अमान्य API कुंजी',
          'Rate limit exceeded': 'दर सीमा पार हो गई',
          'Failed to fetch weather data': 'मौसम डेटा प्राप्त करने में विफल',
          'Network error': 'नेटवर्क त्रुटि',
          'Failed to fetch forecast data': 'पूर्वानुमान डेटा प्राप्त करने में विफल',
          'Failed to fetch AQI data': 'AQI डेटा प्राप्त करने में विफल',
          'Failed to fetch weather alerts': 'मौसम अलर्ट प्राप्त करने में विफल',
          'Invalid coordinates': 'अमान्य निर्देशांक',
          'Coordinates out of range': 'निर्देशांक सीमा से बाहर',
          'City name is required': 'शहर का नाम आवश्यक है'
        },
        humidity: 'आर्द्रता',
        wind: 'हवा',
        pressure: 'दबाव',
        visibility: 'दृश्यता',
        forecast: {
          title: '5-दिन का पूर्वानुमान',
          chart: {
            title: 'तापमान और बारिश की संभावना',
            temperature: 'तापमान',
            rain_chance: 'बारिश की संभावना'
          }
        },
        aqi: {
          title: 'वायु गुणवत्ता सूचकांक',
          good: 'अच्छा',
          fair: 'स्वीकार्य',
          moderate: 'मध्यम',
          poor: 'खराब',
          very_poor: 'बहुत खराब',
          health: {
            title: 'स्वास्थ्य सलाह',
            good: 'वायु गुणवत्ता अच्छी है। बाहरी गतिविधियों का आनंद लें।',
            fair: 'वायु गुणवत्ता स्वीकार्य है। संवेदनशील व्यक्तियों को लक्षण हो सकते हैं।',
            moderate: 'वायु गुणवत्ता मध्यम है। बाहरी गतिविधियों को सीमित करें।',
            poor: 'वायु गुणवत्ता खराब है। बाहरी गतिविधियों से बचें।',
            very_poor: 'वायु गुणवत्ता बहुत खराब है। घर के अंदर रहें।'
          },
          pollutants: {
            title: 'प्रदूषक विवरण'
          },
          recommendations: {
            title: 'सिफारिशें',
            stay_indoors: 'जब संभव हो तो घर के अंदर रहें',
            avoid_exercise: 'बाहरी व्यायाम से बचें',
            use_mask: 'बाहर मास्क का उपयोग करने पर विचार करें'
          }
        },
        alerts: {
          title: 'मौसम अलर्ट',
          loading: 'अलर्ट लोड हो रहे हैं...',
          view_details: 'विवरण देखें',
          active_until: 'सक्रिय रहेगा',
          safety_recommendations: 'सुरक्षा सिफारिशें'
        },
        precautions: {
          title: 'मौसम सावधानियां',
          city_residents: 'शहरी निवासी',
          children: 'बच्चे',
          farmers: 'किसान',
          animals: 'पशु'
        },
        voice: {
          speak: 'मौसम बोलें',
          stop: 'बोलना बंद करें'
        },
        speaking: {
          text: '{{city}} में वर्तमान मौसम {{temp}} डिग्री सेल्सियस है और {{condition}} है'
        },
        theme: {
          selector: 'थीम चयनकर्ता',
          light: 'हल्की थीम',
          dark: 'गहरी थीम',
          'high-contrast': 'उच्च विपरीत थीम'
        },
        location: {
          button: 'मेरा स्थान उपयोग करें'
        },
        farmer: {
          calendar: {
            title: 'किसान सलाह कैलेंडर',
            legend: {
              title: 'लेजेंड',
              sowing: 'इष्टतम बुवाई',
              rainfall: 'अपेक्षित वर्षा',
              protection: 'फसल संरक्षण',
              harvest: 'कटाई का समय'
            }
          }
        }
      }
    }
  },
  es: {
    translation: {
      weather: {
        title: 'Aplicación del Clima',
        welcome: {
          message: 'Bienvenido a la Aplicación del Clima',
          description: 'Obtén información meteorológica en tiempo real para cualquier ciudad'
        },
        search: {
          placeholder: 'Ingrese el nombre de la ciudad...',
          button: 'Buscar',
          location: 'Usar mi ubicación'
        },
        loading: {
          text: 'Cargando datos del clima...'
        },
        error: {
          'City not found': 'Ciudad no encontrada',
          'Invalid API key': 'Clave API inválida',
          'Rate limit exceeded': 'Límite de solicitudes excedido',
          'Failed to fetch weather data': 'No se pudo obtener datos del clima',
          'Network error': 'Error de red',
          'Failed to fetch forecast data': 'No se pudo obtener el pronóstico',
          'Failed to fetch AQI data': 'No se pudo obtener el AQI',
          'Failed to fetch weather alerts': 'No se pudo obtener alertas meteorológicas',
          'Invalid coordinates': 'Coordenadas inválidas',
          'Coordinates out of range': 'Coordenadas fuera de rango',
          'City name is required': 'El nombre de la ciudad es obligatorio'
        },
        humidity: 'Humedad',
        wind: 'Viento',
        pressure: 'Presión',
        visibility: 'Visibilidad',
        forecast: {
          title: 'Pronóstico de 5 días',
          chart: {
            title: 'Temperatura y probabilidad de lluvia',
            temperature: 'Temperatura',
            rain_chance: 'Probabilidad de lluvia'
          }
        },
        aqi: {
          title: 'Índice de Calidad del Aire',
          good: 'Bueno',
          fair: 'Aceptable',
          moderate: 'Moderado',
          poor: 'Malo',
          very_poor: 'Muy malo',
          health: {
            title: 'Consejo de salud',
            good: 'La calidad del aire es buena. Disfruta de actividades al aire libre.',
            fair: 'La calidad del aire es aceptable. Personas sensibles pueden experimentar síntomas.',
            moderate: 'La calidad del aire es moderada. Limita las actividades al aire libre.',
            poor: 'La calidad del aire es mala. Evita actividades al aire libre.',
            very_poor: 'La calidad del aire es muy mala. Permanece en interiores.'
          },
          pollutants: {
            title: 'Desglose de contaminantes'
          },
          recommendations: {
            title: 'Recomendaciones',
            stay_indoors: 'Permanece en interiores cuando sea posible',
            avoid_exercise: 'Evita el ejercicio al aire libre',
            use_mask: 'Considera usar una mascarilla al aire libre'
          }
        },
        alerts: {
          title: 'Alertas Meteorológicas',
          loading: 'Cargando alertas...',
          view_details: 'Ver detalles',
          active_until: 'Activo hasta',
          safety_recommendations: 'Recomendaciones de seguridad'
        },
        precautions: {
          title: 'Precauciones meteorológicas',
          city_residents: 'Residentes de la ciudad',
          children: 'Niños',
          farmers: 'Agricultores',
          animals: 'Animales'
        },
        voice: {
          speak: 'Hablar el clima',
          stop: 'Detener voz'
        },
        speaking: {
          text: 'El clima actual en {{city}} es de {{temp}} grados Celsius con {{condition}}'
        },
        theme: {
          selector: 'Selector de tema',
          light: 'Luz',
          dark: 'Oscuro',
          'high-contrast': 'Alto Contraste'
        },
        location: {
          button: 'Usar mi ubicación'
        },
        farmer: {
          calendar: {
            title: 'Calendario del Agricultor',
            legend: {
              title: 'Leyenda',
              sowing: 'Siembra',
              rainfall: 'Lluvia',
              protection: 'Protección',
              harvest: 'Cosecha'
            }
          }
        }
      }
    }
  },
  mr: { translation: mr },
  ta: { translation: ta },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n 