let context: AudioContext | null = null;

function audioContext(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
  context ??= new AudioContext();
  return context;
}

function tone(ctx: AudioContext, frequency: number, start: number, duration: number): void {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
}

export function playOrderChime(): void {
  const ctx = audioContext();
  if (!ctx) return;
  void ctx.resume().catch(() => undefined);
  const now = ctx.currentTime;
  tone(ctx, 880, now, 0.25);
  tone(ctx, 1175, now + 0.18, 0.35);
}

export function unlockAudio(): void {
  const ctx = audioContext();
  if (ctx && ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
}
