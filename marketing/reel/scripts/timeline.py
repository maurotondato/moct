import json,sys,os
S=sys.argv[1]
START={"L1":0.30,"L2":3.00,"L3":7.40,"L4":10.40,"L5":14.40,"L6":21.60,"L7":26.80,"L8":30.00}
out={"start":START,"words":{}, "dur":37.0}
for k,v in START.items():
    w=json.load(open(f"{S}/vo/{k}.mp3.json"))
    out["words"][k]=[[round(v+a,3),round(d,3),txt] for a,d,txt in w]
json.dump(out,open(f"{S}/reel/timeline.json","w"),ensure_ascii=False,indent=0)
open(f"{S}/reel/timeline.js","w").write("window.TL="+json.dumps(out,ensure_ascii=False)+";")
for k in START: print(k, [(a,t) for a,_,t in out["words"][k]])
