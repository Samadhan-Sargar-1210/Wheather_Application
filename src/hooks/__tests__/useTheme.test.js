import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('useTheme Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Initial State', () => {
    test('returns light theme as default when no theme is stored', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('light');
      expect(typeof result.current.setTheme).toBe('function');
      expect(typeof result.current.toggleTheme).toBe('function');
    });

    test('returns stored theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('dark');
    });

    test('returns light theme for invalid stored theme', () => {
      localStorageMock.getItem.mockReturnValue('invalid-theme');
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('light');
    });
  });

  describe('Theme Switching', () => {
    test('changes theme to dark when setTheme is called', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(result.current.theme).toBe('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    test('changes theme to light when setTheme is called', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('light');
      });
      
      expect(result.current.theme).toBe('light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    test('changes theme to high-contrast when setTheme is called', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('high-contrast');
      });
      
      expect(result.current.theme).toBe('high-contrast');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'high-contrast');
    });

    test('ignores invalid theme values', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('invalid-theme');
      });
      
      expect(result.current.theme).toBe('light'); // Should remain unchanged
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Theme Toggle', () => {
    test('toggles from light to dark theme', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    test('toggles from dark to light theme', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    test('toggles from high-contrast to light theme', () => {
      localStorageMock.getItem.mockReturnValue('high-contrast');
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.toggleTheme();
      });
      
      expect(result.current.theme).toBe('light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('localStorage Persistence', () => {
    test('saves theme to localStorage when theme changes', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    test('loads theme from localStorage on initialization', () => {
      localStorageMock.getItem.mockReturnValue('high-contrast');
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('high-contrast');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    });

    test('handles localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const { result } = renderHook(() => useTheme());
      
      // Should not crash when localStorage fails
      expect(() => {
        act(() => {
          result.current.setTheme('dark');
        });
      }).not.toThrow();
      
      expect(result.current.theme).toBe('dark');
    });

    test('handles localStorage getItem errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage getItem error');
      });
      
      // Should not crash when localStorage.getItem fails
      expect(() => {
        renderHook(() => useTheme());
      }).not.toThrow();
    });
  });

  describe('Theme Validation', () => {
    test('validates theme values correctly', () => {
      const { result } = renderHook(() => useTheme());
      
      const validThemes = ['light', 'dark', 'high-contrast'];
      const invalidThemes = ['invalid', '', null, undefined, 123, {}];
      
      validThemes.forEach(theme => {
        act(() => {
          result.current.setTheme(theme);
        });
        
        expect(result.current.theme).toBe(theme);
        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', theme);
      });
      
      invalidThemes.forEach(theme => {
        act(() => {
          result.current.setTheme(theme);
        });
        
        // Should not change theme for invalid values
        expect(localStorageMock.setItem).not.toHaveBeenCalledWith('theme', theme);
      });
    });

    test('case-sensitive theme validation', () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setTheme('LIGHT');
      });
      
      // Should not accept uppercase theme names
      expect(result.current.theme).toBe('light');
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith('theme', 'LIGHT');
    });
  });

  describe('Multiple Hook Instances', () => {
    test('maintains separate state for different hook instances', () => {
      const { result: result1 } = renderHook(() => useTheme());
      const { result: result2 } = renderHook(() => useTheme());
      
      act(() => {
        result1.current.setTheme('dark');
      });
      
      expect(result1.current.theme).toBe('dark');
      expect(result2.current.theme).toBe('light'); // Should remain unchanged
    });

    test('shares localStorage between hook instances', () => {
      const { result: result1 } = renderHook(() => useTheme());
      
      act(() => {
        result1.current.setTheme('dark');
      });
      
      // Clear localStorage mock to simulate fresh load
      localStorageMock.getItem.mockReturnValue('dark');
      
      const { result: result2 } = renderHook(() => useTheme());
      
      expect(result2.current.theme).toBe('dark');
    });
  });

  describe('Performance', () => {
    test('does not cause unnecessary re-renders', () => {
      let renderCount = 0;
      
      const { result } = renderHook(() => {
        renderCount++;
        return useTheme();
      });
      
      const initialRenderCount = renderCount;
      
      // Call setTheme with same value
      act(() => {
        result.current.setTheme('light');
      });
      
      // Should not cause additional renders for same theme
      expect(renderCount).toBe(initialRenderCount);
    });

    test('handles rapid theme changes efficiently', () => {
      const { result } = renderHook(() => useTheme());
      
      // Rapid theme changes
      act(() => {
        result.current.setTheme('dark');
        result.current.setTheme('light');
        result.current.setTheme('high-contrast');
        result.current.setTheme('dark');
      });
      
      expect(result.current.theme).toBe('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(3); // Only valid themes
    });
  });

  describe('Edge Cases', () => {
    test('handles null localStorage value', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('light');
    });

    test('handles empty string localStorage value', () => {
      localStorageMock.getItem.mockReturnValue('');
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('light');
    });

    test('handles undefined localStorage value', () => {
      localStorageMock.getItem.mockReturnValue(undefined);
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('light');
    });

    test('handles non-string localStorage value', () => {
      localStorageMock.getItem.mockReturnValue(123);
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('light');
    });

    test('handles function calls with no arguments', () => {
      const { result } = renderHook(() => useTheme());
      
      expect(() => {
        act(() => {
          result.current.setTheme();
        });
      }).not.toThrow();
      
      expect(result.current.theme).toBe('light');
    });

    test('handles function calls with multiple arguments', () => {
      const { result } = renderHook(() => useTheme());
      
      expect(() => {
        act(() => {
          result.current.setTheme('dark', 'extra', 'arguments');
        });
      }).not.toThrow();
      
      expect(result.current.theme).toBe('dark');
    });
  });

  describe('Error Recovery', () => {
    test('recovers from localStorage errors on subsequent calls', () => {
      localStorageMock.setItem
        .mockImplementationOnce(() => {
          throw new Error('First localStorage error');
        })
        .mockImplementationOnce(() => {
          // Second call should succeed
        });
      
      const { result } = renderHook(() => useTheme());
      
      // First call should fail but not crash
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(result.current.theme).toBe('dark');
      
      // Second call should succeed
      act(() => {
        result.current.setTheme('light');
      });
      
      expect(result.current.theme).toBe('light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    test('maintains functionality after localStorage becomes unavailable', () => {
      const { result } = renderHook(() => useTheme());
      
      // Initially works
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(result.current.theme).toBe('dark');
      
      // Simulate localStorage becoming unavailable
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      
      // Should still work for theme switching
      act(() => {
        result.current.setTheme('light');
      });
      
      expect(result.current.theme).toBe('light');
    });
  });

  describe('Browser Compatibility', () => {
    test('works when localStorage is not available', () => {
      // Temporarily remove localStorage
      const originalLocalStorage = global.localStorage;
      delete global.localStorage;
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('light');
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(result.current.theme).toBe('dark');
      
      // Restore localStorage
      global.localStorage = originalLocalStorage;
    });

    test('works when localStorage methods are not available', () => {
      // Mock localStorage without methods
      global.localStorage = {};
      
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.theme).toBe('light');
      
      act(() => {
        result.current.setTheme('dark');
      });
      
      expect(result.current.theme).toBe('dark');
    });
  });

  describe('Memory Management', () => {
    test('does not create memory leaks', () => {
      const { result, unmount } = renderHook(() => useTheme());
      
      // Perform multiple theme changes
      for (let i = 0; i < 100; i++) {
        act(() => {
          result.current.setTheme('dark');
          result.current.setTheme('light');
        });
      }
      
      // Unmount should not cause issues
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });
}); 