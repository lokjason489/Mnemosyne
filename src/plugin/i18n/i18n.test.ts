import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import sc from './locales/sc.json';
import tc from './locales/tc.json';

describe('i18n translation parity', () => {
  const enKeys = Object.keys(en).sort();
  const scKeys = Object.keys(sc).sort();
  const tcKeys = Object.keys(tc).sort();

  it('all locale files should contain the same set of keys', () => {
    expect(scKeys).toEqual(enKeys);
    expect(tcKeys).toEqual(enKeys);
  });

  it('no translation value should be empty', () => {
    for (const [key, value] of Object.entries(en)) {
      expect(value, `en.${key} is empty`).toBeTruthy();
    }
    for (const [key, value] of Object.entries(sc)) {
      expect(value, `sc.${key} is empty`).toBeTruthy();
    }
    for (const [key, value] of Object.entries(tc)) {
      expect(value, `tc.${key} is empty`).toBeTruthy();
    }
  });

  it('contains newly added game keys', () => {
    const essentialKeys = [
      'NumberTest_Result',
      'BallTest_Result',
      'Ball_memorize',
      'Ball_perfect',
      'Ball_close',
      'Ball_effort',
      'Ball_spot_on',
      'Ball_off_by',
      'Stoop_hint',
      'Stoop_exceptional',
      'Stoop_great_session',
      'avg_per_round',
      'Number_keyboard_hint',
      'Number_excellent',
      'Number_keep_training',
      'Memory_desc',
      'Memory_get_ready',
      'Memory_watch',
      'Memory_repeat',
      'Memory_level_cleared',
      'Memory_current_score',
      'Memory_next_round',
      'Memory_game_over',
      'Memory_game_over_desc',
      'cognitive_lab',
      'change_language',
      'toggle_theme',
    ];

    for (const key of essentialKeys) {
      expect(tc).toHaveProperty(key);
      expect(sc).toHaveProperty(key);
      expect(en).toHaveProperty(key);
    }
  });
});
