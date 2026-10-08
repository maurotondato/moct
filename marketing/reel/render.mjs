import { chromium } from "playwright";
import fs from 'fs';
const [,, mode, outDir, a, b, fpsArg] = process.argv;
const b0 = await chromium.launch({args:['--disable-web-security']});
const page = await b0.newPage({viewport:{width:1080,height:1920}});
const errs=[];page.on('pageerror',e=>errs.push(String(e)));page.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await page.goto('http://127.0.0.1:8765/index.html'); await page.evaluate(()=>window.ready); await page.waitForTimeout(300);
fs.mkdirSync(outDir,{recursive:true});
let times=[];
if(mode==='times') times=a.split(',').map(Number);
else { const fps=+fpsArg; const n=Math.round((+b - +a)*fps); for(let i=0;i<n;i++) times.push(+a + i/fps); }
let i=0; const t0=Date.now();
for(const t of times){
  await page.evaluate(t=>window.render(t), t);
  const name = mode==='times' ? `t_${t.toFixed(2)}.jpg` : `f_${String(i).padStart(5,'0')}.jpg`;
  await page.screenshot({path:`${outDir}/${name}`, type:'jpeg', quality:93});
  i++; if(i%100===0) console.log(i, ((Date.now()-t0)/i).toFixed(0)+'ms/f');
}
if(errs.length) console.log('ERRS', errs.slice(0,5));
await b0.close();
