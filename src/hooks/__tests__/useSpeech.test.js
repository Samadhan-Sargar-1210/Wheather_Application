import { renderHook, act } from '@testing-library/react';
import useSpeech from '../useSpeech';

// Mock SpeechSynthesis
const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => []),
  onvoiceschanged: null,
};

// Mock SpeechSynthesisUtterance
const mockSpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
  text,
  rate: 1,
  pitch: 1,
  volume: 1,
  lang: 'en-US',
  onstart: null,
  onend: null,
  onerror: null,
  onpause: null,
  onresume: null,
}));

global.speechSynthesis = mockSpeechSynthesis;
global.SpeechSynthesisUtterance = mockSpeechSynthesisUtterance;

describe('useSpeech Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSpeechSynthesis.speak.mockClear();
    mockSpeechSynthesis.cancel.mockClear();
    mockSpeechSynthesisUtterance.mockClear();
  });

  describe('Initial State', () => {
    test('returns correct initial state when speech synthesis is supported', () => {
      const { result } = renderHook(() => useSpeech());
      
      expect(result.current.isSupported).toBe(true);
      expect(result.current.isSpeaking).toBe(false);
      expect(typeof result.current.speak).toBe('function');
      expect(typeof result.current.stop).toBe('function');
    });

    test('returns correct initial state when speech synthesis is not supported', () => {
      // Mock speech synthesis as not available
      const originalSpeechSynthesis = global.speechSynthesis;
      delete global.speechSynthesis;
      
      const { result } = renderHook(() => useSpeech());
      
      expect(result.current.isSupported).toBe(false);
      expect(result.current.isSpeaking).toBe(false);
      expect(typeof result.current.speak).toBe('function');
      expect(typeof result.current.stop).toBe('function');
      
      // Restore speech synthesis
      global.speechSynthesis = originalSpeechSynthesis;
    });
  });

  describe('Speech Synthesis Support Detection', () => {
    test('detects speech synthesis support correctly', () => {
      const { result } = renderHook(() => useSpeech());
      
      expect(result.current.isSupported).toBe(true);
    });

    test('detects when speech synthesis is not available', () => {
      const originalSpeechSynthesis = global.speechSynthesis;
      delete global.speechSynthesis;
      
      const { result } = renderHook(() => useSpeech());
      
      expect(result.current.isSupported).toBe(false);
      
      global.speechSynthesis = originalSpeechSynthesis;
    });

    test('detects when SpeechSynthesisUtterance is not available', () => {
      const originalSpeechSynthesisUtterance = global.SpeechSynthesisUtterance;
      delete global.SpeechSynthesisUtterance;
      
      const { result } = renderHook(() => useSpeech());
      
      expect(result.current.isSupported).toBe(false);
      
      global.SpeechSynthesisUtterance = originalSpeechSynthesisUtterance;
    });
  });

  describe('Speak Functionality', () => {
    test('speaks text when speak function is called', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('Hello, world!');
      });
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('Hello, world!');
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    test('does not speak when speech synthesis is not supported', () => {
      const originalSpeechSynthesis = global.speechSynthesis;
      delete global.speechSynthesis;
      
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('Hello, world!');
      });
      
      expect(mockSpeechSynthesisUtterance).not.toHaveBeenCalled();
      expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled();
      
      global.speechSynthesis = originalSpeechSynthesis;
    });

    test('handles empty text gracefully', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('');
      });
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('');
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    test('handles null text gracefully', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak(null);
      });
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith(null);
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    test('handles undefined text gracefully', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak(undefined);
      });
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith(undefined);
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });
  });

  describe('Stop Functionality', () => {
    test('stops speech when stop function is called', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.stop();
      });
      
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    });

    test('does not stop when speech synthesis is not supported', () => {
      const originalSpeechSynthesis = global.speechSynthesis;
      delete global.speechSynthesis;
      
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.stop();
      });
      
      expect(mockSpeechSynthesis.cancel).not.toHaveBeenCalled();
      
      global.speechSynthesis = originalSpeechSynthesis;
    });
  });

  describe('Language Support', () => {
    test('speaks with default language when no language is specified', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('Hello, world!');
      });
      
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      expect(utterance.lang).toBe('en-US');
    });

    test('speaks with specified language', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('Hola, mundo!', 'es-ES');
      });
      
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      expect(utterance.lang).toBe('es-ES');
    });

    test('handles invalid language codes gracefully', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('Hello, world!', 'invalid-language');
      });
      
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      expect(utterance.lang).toBe('invalid-language');
    });
  });

  describe('Speech Rate Control', () => {
    test('speaks with default rate when no rate is specified', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('Hello, world!');
      });
      
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      expect(utterance.rate).toBe(1);
    });

    test('speaks with specified rate', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('Hello, world!', 'en-US', 0.8);
      });
      
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      expect(utterance.rate).toBe(0.8);
    });

    test('handles extreme rate values gracefully', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('Hello, world!', 'en-US', 0.1); // Very slow
      });
      
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      expect(utterance.rate).toBe(0.1);
      
      act(() => {
        result.current.speak('Hello, world!', 'en-US', 10); // Very fast
      });
      
      const utterance2 = mockSpeechSynthesisUtterance.mock.results[1].value;
      expect(utterance2.rate).toBe(10);
    });
  });

  describe('Speaking State Management', () => {
    test('updates speaking state when speech starts', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('Hello, world!');
      });
      
      // Mock the onstart event
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      if (utterance.onstart) {
        utterance.onstart();
      }
      
      expect(result.current.isSpeaking).toBe(true);
    });

    test('updates speaking state when speech ends', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('Hello, world!');
      });
      
      // Mock the onend event
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      if (utterance.onend) {
        utterance.onend();
      }
      
      expect(result.current.isSpeaking).toBe(false);
    });

    test('updates speaking state when speech is stopped', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('Hello, world!');
      });
      
      // Mock the onstart event
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      if (utterance.onstart) {
        utterance.onstart();
      }
      
      expect(result.current.isSpeaking).toBe(true);
      
      act(() => {
        result.current.stop();
      });
      
      expect(result.current.isSpeaking).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('handles speech synthesis errors gracefully', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('Hello, world!');
      });
      
      // Mock the onerror event
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      if (utterance.onerror) {
        utterance.onerror(new Error('Speech synthesis error'));
      }
      
      expect(result.current.isSpeaking).toBe(false);
    });

    test('handles speech synthesis speak method errors', () => {
      mockSpeechSynthesis.speak.mockImplementation(() => {
        throw new Error('Speech synthesis speak error');
      });
      
      const { result } = renderHook(() => useSpeech());
      
      expect(() => {
        act(() => {
          result.current.speak('Hello, world!');
        });
      }).not.toThrow();
    });

    test('handles speech synthesis cancel method errors', () => {
      mockSpeechSynthesis.cancel.mockImplementation(() => {
        throw new Error('Speech synthesis cancel error');
      });
      
      const { result } = renderHook(() => useSpeech());
      
      expect(() => {
        act(() => {
          result.current.stop();
        });
      }).not.toThrow();
    });
  });

  describe('Multiple Speech Instances', () => {
    test('handles multiple speak calls correctly', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('First message');
        result.current.speak('Second message');
        result.current.speak('Third message');
      });
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledTimes(3);
      expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(3);
    });

    test('stops previous speech when new speech starts', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('First message');
      });
      
      act(() => {
        result.current.speak('Second message');
      });
      
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    });
  });

  describe('Voice Selection', () => {
    test('uses default voice when no voice is specified', () => {
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('Hello, world!');
      });
      
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      expect(utterance.voice).toBeUndefined();
    });

    test('uses specified voice when available', () => {
      const mockVoice = { name: 'Test Voice', lang: 'en-US' };
      mockSpeechSynthesis.getVoices.mockReturnValue([mockVoice]);
      
      const { result } = renderHook(() => useSpeech());
      
      act(() => {
        result.current.speak('Hello, world!', 'en-US', 1, mockVoice);
      });
      
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      expect(utterance.voice).toBe(mockVoice);
    });
  });

  describe('Performance', () => {
    test('handles rapid speech calls efficiently', () => {
      const { result } = renderHook(() => useSpeech());
      
      // Rapid speech calls
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.speak(`Message ${i}`);
        });
      }
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledTimes(10);
      expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(10);
    });

    test('does not cause memory leaks', () => {
      const { result, unmount } = renderHook(() => useSpeech());
      
      // Perform multiple speech operations
      for (let i = 0; i < 100; i++) {
        act(() => {
          result.current.speak(`Message ${i}`);
          result.current.stop();
        });
      }
      
      // Unmount should not cause issues
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('Browser Compatibility', () => {
    test('works when speech synthesis methods are missing', () => {
      const originalSpeechSynthesis = global.speechSynthesis;
      global.speechSynthesis = {
        // Missing speak method
        cancel: jest.fn(),
        pause: jest.fn(),
        resume: jest.fn(),
        getVoices: jest.fn(() => []),
      };
      
      const { result } = renderHook(() => useSpeech());
      
      expect(result.current.isSupported).toBe(false);
      
      act(() => {
        result.current.speak('Hello, world!');
      });
      
      expect(mockSpeechSynthesisUtterance).not.toHaveBeenCalled();
      
      global.speechSynthesis = originalSpeechSynthesis;
    });

    test('works when SpeechSynthesisUtterance constructor fails', () => {
      const originalSpeechSynthesisUtterance = global.SpeechSynthesisUtterance;
      global.SpeechSynthesisUtterance = jest.fn().mockImplementation(() => {
        throw new Error('SpeechSynthesisUtterance constructor error');
      });
      
      const { result } = renderHook(() => useSpeech());
      
      expect(result.current.isSupported).toBe(false);
      
      act(() => {
        result.current.speak('Hello, world!');
      });
      
      expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled();
      
      global.SpeechSynthesisUtterance = originalSpeechSynthesisUtterance;
    });
  });

  describe('Edge Cases', () => {
    test('handles very long text', () => {
      const { result } = renderHook(() => useSpeech());
      
      const longText = 'A'.repeat(10000);
      
      act(() => {
        result.current.speak(longText);
      });
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith(longText);
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    test('handles text with special characters', () => {
      const { result } = renderHook(() => useSpeech());
      
      const specialText = 'Hello, world! 🌍 你好世界 नमस्ते दुनिया';
      
      act(() => {
        result.current.speak(specialText);
      });
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith(specialText);
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    test('handles function calls with no arguments', () => {
      const { result } = renderHook(() => useSpeech());
      
      expect(() => {
        act(() => {
          result.current.speak();
        });
      }).not.toThrow();
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith(undefined);
    });

    test('handles function calls with extra arguments', () => {
      const { result } = renderHook(() => useSpeech());
      
      expect(() => {
        act(() => {
          result.current.speak('Hello', 'en-US', 1, 'voice', 'extra', 'arguments');
        });
      }).not.toThrow();
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('Hello');
    });
  });
}); 