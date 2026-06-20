import { describe, it, expect, vi, afterEach } from 'vitest';
import { getSecureRandom } from './secureRandom';

describe('getSecureRandom', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a valid random number between 0 and 1', () => {
    const spy = vi.spyOn(crypto, 'getRandomValues').mockImplementation((array) => {
      array[0] = 2147483648; // half of 0xffffffff + 1
    });

    const result = getSecureRandom();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.any(Uint32Array));
    expect(result).toBeCloseTo(0.5);
  });

  it('should handle minimum value (0)', () => {
    vi.spyOn(crypto, 'getRandomValues').mockImplementation((array) => {
      array[0] = 0;
    });

    const result = getSecureRandom();
    expect(result).toBe(0);
  });

  it('should handle maximum possible value (just under 1)', () => {
    vi.spyOn(crypto, 'getRandomValues').mockImplementation((array) => {
      array[0] = 0xffffffff;
    });

    const result = getSecureRandom();
    expect(result).toBeLessThan(1);
    expect(result).toBeGreaterThan(0.999999);
  });
});
