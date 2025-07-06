import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing library
configure({ testIdAttribute: 'data-testid' });

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock SpeechSynthesis
global.speechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => []),
  onvoiceschanged: null,
};

// Mock SpeechSynthesisUtterance
global.SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
  constructor(text) {
    this.text = text;
    this.rate = 1;
    this.pitch = 1;
    this.volume = 1;
    this.lang = 'en-US';
  }
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

jest.mock('react-i18next', () => {
  return {
    useTranslation: () => ({
      t: (key) => key,
      i18n: {
        language: 'en',
        changeLanguage: jest.fn()
      }
    }),
    initReactI18next: {
      type: '3rdParty',
      init: jest.fn()
    }
  };
});

// Mock react-calendar
jest.mock('react-calendar', () => {
  return function MockCalendar(props) {
    return <div data-testid="calendar" {...props} />;
  };
});

// Mock recharts
jest.mock('recharts', () => ({
  ComposedChart: ({ children, ...props }) => (
    <div data-testid="composed-chart" {...props}>
      {children}
    </div>
  ),
  Line: (props) => <div data-testid="line-chart" {...props} />,
  Bar: (props) => <div data-testid="bar-chart" {...props} />,
  XAxis: (props) => <div data-testid="x-axis" {...props} />,
  YAxis: (props) => <div data-testid="y-axis" {...props} />,
  CartesianGrid: (props) => <div data-testid="cartesian-grid" {...props} />,
  Tooltip: (props) => <div data-testid="tooltip" {...props} />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
}));

// Mock react-icons
jest.mock('react-icons/wi', () => ({
  WiDaySunny: () => <div data-testid="wi-day-sunny">☀️</div>,
  WiCloudy: () => <div data-testid="wi-cloudy">☁️</div>,
  WiRain: () => <div data-testid="wi-rain">🌧️</div>,
  WiSnow: () => <div data-testid="wi-snow">❄️</div>,
  WiThunderstorm: () => <div data-testid="wi-thunderstorm">⛈️</div>,
  WiFog: () => <div data-testid="wi-fog">🌫️</div>,
}));

jest.mock('react-icons/fa', () => ({
  FaSearch: () => <div data-testid="fa-search">🔍</div>,
  FaMapMarkerAlt: () => <div data-testid="fa-map-marker-alt">📍</div>,
  FaVolumeUp: () => <div data-testid="fa-volume-up">🔊</div>,
  FaVolumeMute: () => <div data-testid="fa-volume-mute">🔇</div>,
  FaHeart: () => <div data-testid="fa-heart">❤️</div>,
  FaBell: () => <div data-testid="fa-bell">🔔</div>,
}));

jest.mock('react-icons/md', () => ({
  MdLightMode: () => <div data-testid="md-light-mode">☀️</div>,
  MdDarkMode: () => <div data-testid="md-dark-mode">🌙</div>,
  MdAccessibility: () => <div data-testid="md-accessibility">♿</div>,
}));

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};
global.navigator.geolocation = mockGeolocation;

// Mock Notification API
global.Notification = {
  requestPermission: jest.fn(() => Promise.resolve('granted')),
  permission: 'granted',
};

// Mock service worker
global.navigator.serviceWorker = {
  register: jest.fn(() => Promise.resolve()),
  ready: Promise.resolve(),
};

// Mock push manager
global.PushManager = class PushManager {
  subscribe() {
    return Promise.resolve({
      toJSON: () => ({ endpoint: 'test-endpoint' }),
    });
  }
  getSubscription() {
    return Promise.resolve(null);
  }
};

// Mock service worker registration
global.ServiceWorkerRegistration = class ServiceWorkerRegistration {
  pushManager = new PushManager();
}

// Mock push subscription
global.PushSubscription = class PushSubscription {
  toJSON() {
    return { endpoint: 'test-endpoint' };
  }
}

// Mock navigator.geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn()
  }
});

// Mock speech synthesis
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: jest.fn(),
    cancel: jest.fn()
  }
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: jest.fn().mockImplementation(() => ({
    onstart: null,
    onend: null,
    onerror: null
  }))
}); 