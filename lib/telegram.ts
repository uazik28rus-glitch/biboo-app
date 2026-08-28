export function getTg(): any | null {
  try { return (window as any).Telegram?.WebApp || null; }
  catch { return null; }
}

export function isTg(): boolean { return !!getTg(); }

export function tgReady(): void {
  try { getTg()?.ready(); } catch {}
}

export function tgExpand(): void {
  try { getTg()?.expand(); } catch {}
}

export function tgHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' = 'light'): void {
  try {
    const tg = getTg();
    if (!tg?.HapticFeedback) return;
    const map: Record<string, string> = {
      light: 'impactLight', medium: 'impactMedium', heavy: 'impactHeavy',
      success: 'notificationSuccess', error: 'notificationError', warning: 'notificationWarning'
    };
    tg.HapticFeedback.impactOccurred?.(map[type] || 'impactLight');
  } catch {}
}

export function tgInitData(): string {
  try { return getTg()?.initData || ''; } catch { return ''; }
}
