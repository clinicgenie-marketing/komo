/**
 * Waterfall ambience for the hero: the recording "Mountain Audio - Garden
 * Waterfall" (bundled by Vite from this folder), looped through one volume
 * control that follows the hero's scroll.
 *
 * Set WATERFALL_SRC to null to fall back to the synthesised version, made in
 * the browser with the Web Audio API: filtered noise in two layers, a bright
 * rush and a low rumble, with a slow random surge so it never sounds like a
 * loop.
 *
 * Nothing plays until start() is called from a click (browsers require a
 * user gesture for sound).
 */
import gardenWaterfall from "./Mountain Audio - Garden Waterfall.mp3";

export const WATERFALL_SRC: string | null = gardenWaterfall;

/** Full loudness: the recording is mastered, the synthesised noise is hot. */
const MAX_GAIN = WATERFALL_SRC ? 0.6 : 0.32;

type Graph = { ctx: AudioContext; master: GainNode; stop: () => void };

let graph: Graph | null = null;
/** Target loudness 0–1, set by scroll (how much of the hero is in view). */
let level = 1;
let playing = false;

function noiseBuffer(ctx: AudioContext, seconds: number, brown: boolean) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      if (brown) {
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      } else {
        data[i] = white;
      }
    }
  }
  return buffer;
}

function build(): Graph {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  const nodes: AudioScheduledSourceNode[] = [];

  if (WATERFALL_SRC) {
    const audio = new Audio(WATERFALL_SRC);
    audio.loop = true;
    const source = ctx.createMediaElementSource(audio);
    source.connect(master);
    void audio.play();
    return { ctx, master, stop: () => audio.pause() };
  }

  // Bright rush: white noise, band-limited to the hiss of falling water.
  const rush = ctx.createBufferSource();
  rush.buffer = noiseBuffer(ctx, 6, false);
  rush.loop = true;
  const rushHigh = ctx.createBiquadFilter();
  rushHigh.type = "highpass";
  rushHigh.frequency.value = 380;
  const rushLow = ctx.createBiquadFilter();
  rushLow.type = "lowpass";
  rushLow.frequency.value = 2600;
  const rushGain = ctx.createGain();
  rushGain.gain.value = 0.55;
  rush.connect(rushHigh).connect(rushLow).connect(rushGain).connect(master);

  // Low rumble: brown noise, the weight of water landing in the basin.
  const rumble = ctx.createBufferSource();
  rumble.buffer = noiseBuffer(ctx, 8, true);
  rumble.loop = true;
  const rumbleLow = ctx.createBiquadFilter();
  rumbleLow.type = "lowpass";
  rumbleLow.frequency.value = 520;
  const rumbleGain = ctx.createGain();
  rumbleGain.gain.value = 0.9;
  rumble.connect(rumbleLow).connect(rumbleGain).connect(master);

  // Slow surges: two LFOs at unrelated rates nudge the rush's tone and
  // level, so the sound breathes rather than hums.
  const surge = (target: AudioParam, rate: number, depth: number) => {
    const lfo = ctx.createOscillator();
    lfo.frequency.value = rate;
    const amount = ctx.createGain();
    amount.gain.value = depth;
    lfo.connect(amount).connect(target);
    lfo.start();
    nodes.push(lfo);
  };
  surge(rushLow.frequency, 0.071, 700);
  surge(rushGain.gain, 0.113, 0.12);
  surge(rumbleGain.gain, 0.047, 0.15);

  rush.start();
  rumble.start();
  nodes.push(rush, rumble);
  return { ctx, master, stop: () => nodes.forEach((node) => node.stop()) };
}

function applyGain(seconds = 0.6) {
  if (!graph) return;
  const { ctx, master } = graph;
  const target = playing && !document.hidden ? MAX_GAIN * level : 0;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(target, ctx.currentTime, seconds / 3);
}

export function startWaterfall() {
  if (!graph) graph = build();
  void graph.ctx.resume();
  playing = true;
  applyGain(1.8); // a slow swell in
}

export function stopWaterfall() {
  playing = false;
  applyGain(0.5);
}

/** 0–1: how present the waterfall is (follows the hero's scroll). */
export function setWaterfallLevel(next: number) {
  level = Math.min(1, Math.max(0, next));
  applyGain(0.4);
}

document.addEventListener("visibilitychange", () => applyGain(0.3));
