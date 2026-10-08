"""Música + SFX + mezcla del reel de moctLab. Todo sintetizado."""
import json, sys
import numpy as np
from scipy import signal
from scipy.io import wavfile

S = sys.argv[1]
SR = 48000
DUR = 37.0
N = int(SR * (DUR + 0.0))
rng = np.random.default_rng(7)
TL = json.load(open(f"{S}/reel/timeline.json"))

def wt(line, word, nth=0):
    c = 0
    for a, d, w in TL["words"][line]:
        if w.lower().startswith(word.lower()):
            if c == nth:
                return a
            c += 1
    raise KeyError(word)

def buf():
    return np.zeros((N, 2))

def place(dst, x, t, gain=1.0, pan=0.0):
    """Suma x (mono o estéreo) en dst a partir de t segundos."""
    i = int(round(t * SR))
    if i >= len(dst):
        return
    if x.ndim == 1:
        l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * l * 1.414, x * r * 1.414], 1)
    if i < 0:
        x = x[-i:]; i = 0
    n = min(len(x), len(dst) - i)
    dst[i:i + n] += x[:n] * gain

def tt(d):
    return np.arange(int(d * SR)) / SR

def noise(d):
    return rng.standard_normal(int(d * SR))

def lp(x, f, o=2):
    sos = signal.butter(o, min(f, SR / 2 * 0.95), 'low', fs=SR, output='sos'); return signal.sosfilt(sos, x, axis=0)
def hp(x, f, o=2):
    sos = signal.butter(o, f, 'high', fs=SR, output='sos'); return signal.sosfilt(sos, x, axis=0)
def bp(x, f1, f2, o=2):
    sos = signal.butter(o, [f1, f2], 'band', fs=SR, output='sos'); return signal.sosfilt(sos, x, axis=0)

def sweep_lp(x, fcurve, block=256):
    """Lowpass con cutoff variable por bloques (fcurve en Hz por muestra)."""
    y = np.zeros_like(x); zi = None
    for s in range(0, len(x), block):
        f = float(np.clip(fcurve[min(s, len(fcurve) - 1)], 30, SR / 2 * 0.9))
        sos = signal.butter(2, f, 'low', fs=SR, output='sos')
        if zi is None:
            zi = np.zeros((sos.shape[0], 2) + x.shape[1:])
        y[s:s + block], zi = signal.sosfilt(sos, x[s:s + block], axis=0, zi=zi)
    return y

def env_adsr(n, a, d, s, r, sr=SR, hold=None):
    a, d, r = int(a * sr), int(d * sr), int(r * sr)
    hold = n - a - d - r if hold is None else int(hold * sr)
    hold = max(hold, 0)
    e = np.concatenate([np.linspace(0, 1, max(a, 1)), np.linspace(1, s, max(d, 1)), np.full(hold, s), np.linspace(s, 0, max(r, 1))])
    return np.pad(e, (0, max(0, n - len(e))))[:n]

def polyblep_saw(freq, d, phase0=0.0):
    n = int(d * SR)
    f = np.full(n, freq) if np.isscalar(freq) else freq[:n]
    dt = f / SR
    ph = (phase0 + np.cumsum(dt)) % 1.0
    y = 2 * ph - 1
    m = ph < dt; tt_ = ph[m] / dt[m]; y[m] -= tt_ + tt_ - tt_ * tt_ - 1
    m = ph > 1 - dt; tt_ = (ph[m] - 1) / dt[m]; y[m] -= tt_ * tt_ + tt_ + tt_ + 1
    return y

def mtof(m):
    return 440 * 2 ** ((m - 69) / 12)

def reverb_ir(dur=2.2, damp=6000, pre=0.012, seed=1):
    r = np.random.default_rng(seed)
    n = int(dur * SR); t = np.arange(n) / SR
    e = np.exp(-t * 6.9 / dur)
    ir = r.standard_normal((n, 2)) * e[:, None]
    ir = lp(ir, damp, 1)
    ir = np.vstack([np.zeros((int(pre * SR), 2)), ir])
    ir[0] += 0
    return ir / np.sqrt((ir ** 2).sum(0)).max() * 0.9

IR_BIG = reverb_ir(2.6, 5500, seed=3)
IR_SMALL = reverb_ir(0.9, 7000, seed=4)

def reverb(x, ir, wet=0.3):
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    y = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], 1)
    return x * (1 - wet) + y * wet

def delay_pp(x, t, fb=0.35, mix_=0.3, n=6):
    """Ping-pong delay sobre señal estéreo."""
    out = x.copy(); d = int(t * SR); g = mix_
    for k in range(1, n + 1):
        side = 0 if k % 2 else 1
        sh = np.zeros_like(x)
        if d * k < len(x):
            sh[d * k:, side] = (x[:-d * k, 0] + x[:-d * k, 1]) * 0.5
        out += lp(sh, 4500, 1) * g
        g *= fb
    return out

def soft(x, drive=1.0):
    return np.tanh(x * drive) / np.tanh(drive)

# ------------------------------------------------------------------ instrumentos
BPM = 120; BEAT = 60 / BPM; BAR = BEAT * 4; S16 = BEAT / 4

def kick(d=0.5, f0=170, f1=46):
    t = tt(d)
    f = f1 + (f0 - f1) * np.exp(-t * 38)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 6.5)
    click = hp(noise(0.012), 2500) * np.exp(-tt(0.012) * 300) * 0.35
    body[:len(click)] += click
    return soft(body * 1.6, 1.4) * 0.95

def clap():
    d = 0.35; out = np.zeros(int(d * SR))
    for k, off in enumerate([0, 0.011, 0.022]):
        n = bp(noise(0.03), 900, 3200) * np.exp(-tt(0.03) * 120)
        i = int(off * SR); out[i:i + len(n)] += n * (0.7 if k < 2 else 1)
    tail = bp(noise(d), 1000, 4000) * np.exp(-tt(d) * 14) * 0.35
    out += tail
    return out * 0.9

def hat(open_=False):
    d = 0.32 if open_ else 0.05
    x = hp(noise(d), 7500, 4) * np.exp(-tt(d) * (11 if open_ else 90))
    return x * (0.5 if open_ else 0.4)

def snare():
    d = 0.25
    tone = np.sin(2 * np.pi * 190 * tt(d)) * np.exp(-tt(d) * 25) * 0.5
    nz = bp(noise(d), 1500, 7000) * np.exp(-tt(d) * 18)
    return (tone + nz) * 0.7

def pluck(m, d=0.32, cut=3200, bright=1.0):
    f = mtof(m)
    x = polyblep_saw(f, d) * 0.6 + polyblep_saw(f * 1.004, d, 0.3) * 0.4
    t = tt(d)
    fc = 300 + cut * bright * np.exp(-t * 18)
    y = sweep_lp(x[:, None], fc)[:, 0]
    return y * np.exp(-t * 7) * 0.5

def supersaw(ms, d, cut=2400, voices=5, det=0.12):
    n = int(d * SR); L = np.zeros(n); R = np.zeros(n)
    for m in ms:
        for v in range(voices):
            dv = (v - (voices - 1) / 2) / ((voices - 1) / 2) * det
            f = mtof(m + dv)
            w = polyblep_saw(f, d, rng.random())
            pan = (v / (voices - 1)) * 2 - 1
            L += w * (1 - pan) * 0.5; R += w * (1 + pan) * 0.5
    x = np.stack([L, R], 1) / (len(ms) * voices) * 2.2
    return lp(x, cut, 2)

def sub(m, d):
    t = tt(d)
    return np.sin(2 * np.pi * mtof(m) * t)

# ------------------------------------------------------------------ armonía
# Am  F  C  G  (i VI III VII), un acorde por compás
CH = [(57, [69, 72, 76]), (53, [65, 69, 72]), (48, [67, 72, 76]), (55, [67, 71, 74])]
def chord_at(t):
    return CH[int(t // BAR) % 4]

music = buf(); drums = buf(); bassb = buf(); pad = buf(); arp = buf()

def section(t):
    if t < 2.95: return 'hook'
    if t < 7.15: return 'pain'
    if t < 10.0: return 'calm'
    if t < 26.5: return 'drop'
    if t < 30.0: return 'break'
    if t < 34.0: return 'drop2'
    return 'end'

K = kick(); CL = clap(); HC = hat(); HO = hat(True); SN = snare()

# drums
nb = int(DUR / BEAT)
for b in range(nb):
    t = b * BEAT; sec = section(t)
    if sec in ('drop', 'drop2'):
        place(drums, K, t, 1.0)
        if b % 2 == 1: place(drums, CL, t, 0.55)
        place(drums, HO, t + BEAT / 2, 0.28, 0.15)
        for s in range(4):
            place(drums, HC, t + s * S16, 0.18 + 0.08 * (s % 2), -0.25)
    elif sec == 'pain':
        place(drums, lp(K, 900), t, 0.85)
        for s in range(4):
            place(drums, HC, t + s * S16, 0.14 + 0.05 * (s % 2), -0.2)
        if b % 2 == 1: place(drums, lp(CL, 2500), t, 0.3)
    elif sec == 'hook':
        if b % 2 == 0: place(drums, lp(K, 400), t, 0.75)
        for s in range(2):
            place(drums, HC, t + s * BEAT / 2, 0.12, 0.3)
# rolls into drops
for (a, b_) in [(8.5, 9.9), (28.5, 29.9)]:
    t = a; i = 0
    while t < b_:
        prog = (t - a) / (b_ - a)
        place(drums, SN, t, 0.12 + 0.45 * prog ** 1.5, 0.0)
        step = BEAT / 2 if prog < 0.35 else (BEAT / 4 if prog < 0.75 else BEAT / 8)
        t += step

# bass: off-beat rolling 16ths + sub
for s in range(int(DUR / S16)):
    t = s * S16; sec = section(t)
    root, _ = chord_at(t)
    if sec in ('drop', 'drop2', 'pain'):
        if s % 4 == 0 and sec != 'pain':
            continue  # deja lugar al bombo
        m = root - 12 + (12 if s % 4 == 3 else 0)
        n = pluck(m, S16 * 0.95, cut=1100 if sec != 'pain' else 500, bright=1)
        place(bassb, n, t, 0.85 if sec != 'pain' else 0.6)
for b in range(int(DUR / BEAT)):
    t = b * BEAT; sec = section(t)
    root, _ = chord_at(t)
    if sec in ('drop', 'drop2', 'hook', 'pain'):
        x = sub(root - 24, BEAT * 0.95) * env_adsr(int(BEAT * 0.95 * SR), 0.005, 0.1, 0.8, 0.05)
        place(bassb, x, t, 0.5 if sec != 'hook' else 0.35)

# pad por compás
for bar in range(int(np.ceil(DUR / BAR))):
    t = bar * BAR; sec = section(t + 0.01)
    root, notes = chord_at(t)
    cut = {'hook': 900, 'pain': 1300, 'calm': 1800, 'drop': 2800, 'break': 2200, 'drop2': 3200, 'end': 2600}[sec]
    x = supersaw([n - 12 for n in notes] + [notes[0]], BAR + 0.4, cut=cut)
    e = env_adsr(len(x), 0.25 if sec != 'drop' else 0.05, 0.4, 0.8, 0.45)
    x *= e[:, None]
    g = {'hook': 0.25, 'pain': 0.28, 'calm': 0.38, 'drop': 0.3, 'break': 0.42, 'drop2': 0.32, 'end': 0.0}[sec]
    place(pad, x, t, g)

# arp
pattern = [0, 1, 2, 1, 2, 3, 2, 1]
for s in range(int(DUR / S16)):
    t = s * S16; sec = section(t)
    if sec not in ('drop', 'drop2', 'break', 'calm'):
        continue
    if sec == 'calm' and t < 8.0:
        continue
    root, notes = chord_at(t)
    tones = notes + [notes[0] + 12]
    m = tones[pattern[s % 8]] + (12 if (sec == 'drop2' or (sec == 'drop' and t > 18)) and s % 8 in (3, 5) else 0)
    br = 0.5 if sec in ('calm', 'break') else 1.0
    place(arp, pluck(m, 0.3, cut=2600, bright=br), t, 0.32 if sec != 'calm' else 0.18, pan=0.35 * np.sin(s * 0.7))

# sidechain (pump) sobre pad/bajo/arp en drops
def pump_env():
    e = np.ones(N)
    for b in range(nb):
        t = b * BEAT
        if section(t) in ('drop', 'drop2'):
            i = int(t * SR); L = int(BEAT * SR)
            seg = 1 - 0.75 * np.exp(-np.arange(L) / SR * 14)
            e[i:i + L] = np.minimum(e[i:i + L], seg[:len(e[i:i + L])])
    return e
PE = pump_env()[:, None]
pad = reverb(pad, IR_BIG, 0.35) * PE
arp = delay_pp(arp, BEAT * 0.75, 0.4, 0.35)
arp = reverb(arp, IR_BIG, 0.25) * PE
bassb = bassb * (0.35 + 0.65 * PE)
drums = drums + reverb(drums, IR_SMALL, 0.12) * 0.0

# corte en el "glitch" (7.15) y vacío antes del drop
def gate(x, a, b, fade=0.01):
    i, j = int(a * SR), int(b * SR); f = int(fade * SR)
    x[i:j] *= 0
    x[max(0, i - f):i] *= np.linspace(1, 0, min(f, i))[:, None]
for X in (drums, bassb, arp):
    gate(X, 9.92, 10.0)
    gate(X, 34.0, DUR)
gate(drums, 7.15, 8.5)
gate(bassb, 7.15, 10.0)

music = drums * 0.9 + bassb * 0.9 + pad + arp

# final: acorde largo + cola
root, notes = CH[0]
fin = supersaw([n - 12 for n in notes] + notes, 3.2, cut=3000) * np.exp(-tt(3.2) * 1.2)[:, None]
place(music, reverb(fin, IR_BIG, 0.5), 34.0, 0.55)
place(music, sub(33, 2.5) * np.exp(-tt(2.5) * 1.5), 34.0, 0.5)
# filtro global: abre en "pain" hacia el corte; cerrado en break
fc = np.full(N, 18000.0)
tA = np.arange(N) / SR
m1 = (tA >= 2.95) & (tA < 7.15); fc[m1] = 900 + (tA[m1] - 2.95) / 4.2 * 9000
m2 = (tA >= 26.5) & (tA < 30.0); fc[m2] = 1500 + ((tA[m2] - 26.5) / 3.5) ** 2 * 14000
m3 = tA < 2.95; fc[m3] = 2500
music = sweep_lp(music, fc, 512)

# ------------------------------------------------------------------ SFX
sfx = buf()

def whoosh(d=0.5, f0=300, f1=6000, up=True):
    x = noise(d)
    t = tt(d)
    fcurve = f0 * (f1 / f0) ** (t / d if up else 1 - t / d)
    y = sweep_lp(x[:, None], fcurve, 128)[:, 0]
    y = hp(y, 150)
    e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return y * e * 0.6

def whip(d=0.38):
    a = whoosh(d, 400, 9000, True)
    return reverb(a, IR_SMALL, 0.25)

def impact(big=1.0):
    d = 2.6
    t = tt(d)
    f = 30 + 70 * np.exp(-t * 7)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    crash = hp(lp(noise(d), 9000), 2500) * np.exp(-t * 4.5) * 0.12
    thump = lp(noise(0.08), 300) * np.exp(-tt(0.08) * 50) * 1.5
    x = boom * 1.1 + crash * big
    x[:len(thump)] += thump
    return reverb(soft(x, 1.5), IR_BIG, 0.35)

def riser(d, f0=200, f1=8000):
    t = tt(d)
    x = noise(d)
    fcu = f0 * (f1 / f0) ** (t / d) ** 1.6
    y = sweep_lp(x[:, None], fcu, 128)[:, 0]
    tone = polyblep_saw(np.full(len(t), 1) * (110 * 2 ** (3 * (t / d) ** 2)), d) * 0.15
    e = (t / d) ** 2.2
    return reverb((y * 0.5 + lp(tone, 4000)) * e, IR_BIG, 0.3)

def rev_whoosh(d=0.6):
    x = reverb(hp(noise(0.4), 2000) * np.exp(-tt(0.4) * 6), IR_BIG, 0.9)[:int(d * SR)]
    return x[::-1] * 0.5

def blip(f=1200, d=0.07, g=0.4):
    t = tt(d)
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 60) * g

def tick(f=3500):
    return bp(noise(0.02), f * 0.7, min(f * 1.4, 20000)) * np.exp(-tt(0.02) * 300) * 0.6

def keyclick():
    x = bp(noise(0.03), 1800, 6000) * np.exp(-tt(0.03) * 180)
    x += np.sin(2 * np.pi * 180 * tt(0.03)) * np.exp(-tt(0.03) * 120) * 0.3
    return x * 0.5

def ping(f=1318.5):
    t = tt(0.6)
    x = (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.01 * t) + 0.2 * np.sin(2 * np.pi * f * 3.02 * t)) * np.exp(-t * 9)
    return x * 0.25

def ding(f=1760):
    t = tt(1.0)
    x = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.5 * t)) * np.exp(-t * 6)
    return reverb(x * 0.22, IR_SMALL, 0.3)

def pop(f=600):
    t = tt(0.09)
    fr = f * (1 + 2 * np.exp(-t * 60))
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 45) * 0.45

def shimmer(d=1.4, base=2093):
    t = tt(d); x = np.zeros(len(t))
    for k, f in enumerate([base, base * 1.25, base * 1.5, base * 2, base * 2.5]):
        x += np.sin(2 * np.pi * f * t + k) * np.exp(-t * (2.5 + k)) * np.clip(t * 20 - k * 0.8, 0, 1)
    return reverb(x * 0.12, IR_BIG, 0.5)

def glitch_burst(d=0.15, seed=0):
    r = np.random.default_rng(seed)
    n = int(d * SR); x = np.zeros(n)
    i = 0
    while i < n:
        L = int(r.uniform(0.008, 0.03) * SR)
        kind = r.integers(3)
        seg = (np.sign(np.sin(2 * np.pi * r.uniform(200, 2000) * np.arange(L) / SR)) * 0.3 if kind == 0
               else bp(r.standard_normal(L), 500, 6000) * 0.6 if kind == 1 else np.zeros(L))
        x[i:i + L] = seg[:n - i]; i += L
    return x * 0.6

def thud():
    t = tt(0.5)
    x = np.sin(2 * np.pi * (45 + 60 * np.exp(-t * 25)) * t) * np.exp(-t * 9)
    x += lp(noise(0.5), 1500) * np.exp(-t * 30) * 0.6
    return reverb(soft(x * 1.5, 1.3), IR_SMALL, 0.3)

def typing(a, b, rate=0.065, g=0.25, seed=1):
    r = np.random.default_rng(seed); t = a
    while t < b:
        place(sfx, keyclick(), t, g * r.uniform(0.6, 1.0), r.uniform(-0.3, 0.3))
        t += rate * r.uniform(0.6, 1.4)

# hook
place(sfx, impact(0.6), 0.03, 0.55)
typing(0.35, 2.85, 0.07, 0.16, 1)
place(sfx, whoosh(0.4, 800, 5000), wt('L1', 'mano') + 0.1, 0.25, 0.3)  # marker
# whips
for tw, pan in [(2.95, 0), (4.70, 0.2), (14.15, 0), (16.15, 0.2), (18.05, -0.2), (21.45, 0.2), (23.82, -0.2), (26.65, 0), (29.85, 0), (31.45, 0)]:
    place(sfx, whip(), tw - 0.22, 0.55, pan)
# excel chips
for n in range(3):
    t0 = 3.25 + n * 0.48
    place(sfx, keyclick(), t0, 0.5, -0.3); place(sfx, keyclick(), t0 + 0.05, 0.4, -0.3)
    place(sfx, whoosh(0.3, 1000, 7000), t0 + 0.05, 0.22, 0.0)
    place(sfx, pop(700 + 120 * n), t0 + 0.3, 0.5, 0.3)
    place(sfx, keyclick(), t0 + 0.3, 0.45, 0.3)
# notifs
start = 4.85
for i in range(16):
    ti = start + (i * 0.28 if i < 4 else 1.12 + (i - 4) * 0.11)
    f = [1318.5, 1567.98, 1174.66, 1760][i % 4]
    place(sfx, ping(f), ti, 0.7 if i < 4 else 0.45, (i % 3 - 1) * 0.4)
place(sfx, thud(), wt('L2', 'explotado') - 0.02, 0.7)
place(sfx, impact(0.4), wt('L2', 'explotado') - 0.02, 0.35)
place(sfx, riser(1.4, 400, 6000), 5.75, 0.35)
for k in range(8):
    tg = 6.2 + k * 0.12 * (1 - k * 0.06)
    place(sfx, glitch_burst(0.06 + 0.01 * k, k), tg, 0.18 + 0.04 * k, (k % 2) * 0.6 - 0.3)
place(sfx, glitch_burst(0.16, 99), 7.12, 0.8)
# calm
place(sfx, shimmer(2.0, 1046.5), wt('L3', 'Tranqui') - 0.05, 0.6)
place(sfx, tick(2500), wt('L3', 'Eso'), 0.2)
place(sfx, riser(1.45, 200, 9000), 8.55, 0.65)
place(sfx, rev_whoosh(0.6), 9.4, 0.6)
# drop
place(sfx, impact(1.0), 10.0, 1.0)
place(sfx, shimmer(1.6), 10.25, 0.8)
place(sfx, whoosh(0.5, 600, 4000), 10.95, 0.25)
place(sfx, rev_whoosh(0.5), 13.68, 0.35)
# dashboard
for i in range(8):
    place(sfx, blip(660 * 2 ** (i / 12 * 2), 0.06, 0.18), 14.15 + 0.45 + i * 0.07, 1.0, -0.4 + i * 0.1)
for k in range(10):
    place(sfx, tick(4500), 14.55 + k * 0.12, 0.12)
# flow
base = 16.15 + 0.25
for i in range(4):
    place(sfx, pop(500 + 80 * i), base + i * 0.12, 0.35, (-0.3 if i % 2 == 0 else 0.3))
place(sfx, ding(1568), base + 0.4, 0.6)
for i in range(3):
    a = base + 0.45 + i * 0.42
    place(sfx, whoosh(0.38, 1200, 6000), a, 0.15)
    place(sfx, ding([1760, 1975.5, 2349.3][i]), a + 0.42 * 0.9, 0.6, (0.3 if i % 2 == 0 else -0.3))
# chat
a1 = 18.05 + 0.45; a2 = a1 + 0.45; a3 = a2 + 0.6; a4 = a3 + 0.95; a5 = a4 + 0.5
place(sfx, pop(900), a1, 0.5, 0.3)
place(sfx, pop(650), a3, 0.5, -0.3)
typing(a3 + 0.02, a3 + 0.7, 0.045, 0.08, 3)
place(sfx, pop(900), a4, 0.5, 0.3)
place(sfx, pop(650), a5, 0.5, -0.3)
place(sfx, ding(2093), a5 + 0.05, 0.4)
# precio
for w, f in [('Precio', 1568), ('plazo', 1760), ('cerrados', 2093)]:
    place(sfx, ding(f), wt('L6', w) + 0.15 if w != 'cerrados' else wt('L6', w) + 0.07, 0.5)
st = wt('L6', 'cerrados') + 0.45
place(sfx, thud(), st + 0.2, 1.0)
place(sfx, impact(0.3), st + 0.2, 0.35)
# código
typing(24.15, 26.1, 0.055, 0.2, 5)
place(sfx, shimmer(1.2, 1568), wt('L6', 'manos') + 0.1, 0.6)
place(sfx, pop(700), wt('L6', 'manos') + 0.1, 0.4)
# diagnostico
r0 = wt('L7', 'es') - 0.35
for k in range(14):
    place(sfx, tick(3000 + k * 120), r0 + 0.55 * (k / 14) ** 0.8, 0.3)
place(sfx, pop(520), wt('L7', 'es') + 0.2, 0.5)
place(sfx, whoosh(0.25, 500, 3000), wt('L7', 'sin') - 0.15, 0.3)
place(sfx, thud(), wt('L7', 'sin') - 0.02, 0.55)
place(sfx, shimmer(1.4, 2093), wt('L7', 'cargo') + 0.1, 0.8)
place(sfx, riser(1.3, 300, 9000), 28.65, 0.5)
# cta
place(sfx, keyclick(), 30.95, 1.0, 0.3)
place(sfx, pop(1100), 30.97, 0.5, 0.3)
place(sfx, ding(2637), 31.0, 0.4, 0.3)
place(sfx, impact(0.9), 31.7, 0.85)
place(sfx, shimmer(1.8), 32.0, 0.8)
place(sfx, pop(700), 34.25, 0.4)
place(sfx, tick(3000), 34.5, 0.2)
place(sfx, tick(3400), 34.7, 0.2)
place(sfx, shimmer(1.4, 2637), 35.6, 0.5)

# ------------------------------------------------------------------ VOZ
vo = np.zeros(N)
for k, t0 in TL["start"].items():
    sr, x = wavfile.read(f"{S}/vo/{k}_fx.wav")
    x = x.astype(np.float64) / 32768
    if x.ndim > 1: x = x.mean(1)
    i = int(t0 * SR); n = min(len(x), N - i)
    vo[i:i + n] += x[:n]
vo_st = reverb(vo, IR_SMALL, 0.06)

# ducking de la música bajo la voz
envv = np.abs(vo)
win = int(0.03 * SR)
envv = np.convolve(envv, np.ones(win) / win, 'same')
duck = np.clip(envv / 0.04, 0, 1)
# suavizar ataque/release
duck = signal.lfilter([1 - np.exp(-1 / (0.12 * SR))], [1, -np.exp(-1 / (0.12 * SR))], duck)
duck = np.clip(duck * 1.6, 0, 1)
gain_music = 1 - 0.55 * duck

mix = music * 0.3 * gain_music[:, None] + sfx * 0.4 + vo_st * 2.0
# fade final
fo = int(0.6 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 2
mix = soft(mix * 0.9, 1.2) * 0.9
wavfile.write(f"{S}/reel/mix_raw.wav", SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16))
wavfile.write(f"{S}/reel/vo_only.wav", SR, (np.clip(vo_st*2.0,-1,1)*32767).astype(np.int16))
wavfile.write(f"{S}/reel/sfx_only.wav", SR, (np.clip(sfx*0.4,-1,1)*32767).astype(np.int16))
wavfile.write(f"{S}/reel/musicd_only.wav", SR, (np.clip(music*0.3*gain_music[:,None],-1,1)*32767).astype(np.int16))
wavfile.write(f"{S}/reel/music_only.wav", SR, (np.clip(soft(music * 0.55, 1.2), -1, 1) * 32767).astype(np.int16))
print("ok", np.abs(mix).max())
