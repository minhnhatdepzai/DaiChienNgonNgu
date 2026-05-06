export class SettingsStore {
  getAvatar(player: 1 | 2): string | null {
    return localStorage.getItem(`avatar_p${player}`);
  }

  setAvatar(player: 1 | 2, url: string | null) {
    if (url) {
      localStorage.setItem(`avatar_p${player}`, url);
    } else {
      localStorage.removeItem(`avatar_p${player}`);
    }
  }
}

export const settingsStore = new SettingsStore();
