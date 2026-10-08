import sys, numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
m=WhisperModel("small", device="cpu", compute_type="int8")
for f in sys.argv[1:]:
    sr,x=wavfile.read(f); x=x.astype(np.float32)/32768
    x=resample_poly(x,1,3).astype(np.float32)
    segs,info=m.transcribe(x, language="es")
    print(f, "|", " ".join(s.text for s in segs))
