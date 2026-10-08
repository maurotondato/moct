"""Uso: tts.py VOZ "texto" salida.mp3 [rate] [pitch] — guarda también salida.mp3.json con tiempos por palabra."""
import asyncio, ssl, sys, json
import edge_tts, edge_tts.communicate as c
import os
if os.environ.get("SSL_CERT_FILE"):
    c._SSL_CTX = ssl.create_default_context(cafile=os.environ["SSL_CERT_FILE"])
async def main(voice, text, out, rate="+0%", pitch="+0Hz"):
    com = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, proxy=os.environ.get('HTTPS_PROXY'), boundary="WordBoundary")
    words=[]
    with open(out,"wb") as f:
        async for ch in com.stream():
            if ch["type"]=="audio": f.write(ch["data"])
            elif ch["type"]=="WordBoundary": words.append((ch["offset"]/1e7, ch["duration"]/1e7, ch["text"]))
    json.dump(words, open(out+".json","w"), ensure_ascii=False)
a=sys.argv[1:]
asyncio.run(main(*a))
