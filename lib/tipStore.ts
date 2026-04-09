import AsyncStorage from '@react-native-async-storage/async-storage';

const K_DISMISSED = '@cc/dismissed_tips';

let dismissed: string[] = [];
let hydrated = false;

export async function hydrateTips(): Promise<void> {
  if (hydrated) return;
  try {
    const raw = await AsyncStorage.getItem(K_DISMISSED);
    dismissed = raw ? JSON.parse(raw) : [];
  } catch {
    dismissed = [];
  }
  hydrated = true;
}

export function isDismissed(tipId: string): boolean {
  return dismissed.includes(tipId);
}

export async function dismissTip(tipId: string): Promise<void> {
  if (!dismissed.includes(tipId)) {
    dismissed = [...dismissed, tipId];
    await AsyncStorage.setItem(K_DISMISSED, JSON.stringify(dismissed));
  }
}

export async function restoreTips(tipIds: string[]): Promise<void> {
  dismissed = dismissed.filter((id) => !tipIds.includes(id));
  await AsyncStorage.setItem(K_DISMISSED, JSON.stringify(dismissed));
}
