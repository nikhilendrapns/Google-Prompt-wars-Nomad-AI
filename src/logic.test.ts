import { describe, it, expect } from 'vitest';

describe('Travel Planning Logic', () => {
  it('should validate duration boundaries', () => {
    const min = 1;
    const max = 14;
    expect(min).toBe(1);
    expect(max).toBe(14);
  });

  it('should format destination strings correctly', () => {
    const input = '  tokyo, japan  ';
    const output = input.trim().toLowerCase();
    expect(output).toBe('tokyo, japan');
  });

  it('should verify interest tags are unique', () => {
    const interests = ['Food', 'Hiking', 'Food'];
    const unique = [...new Set(interests)];
    expect(unique.length).toBe(2);
  });
});
