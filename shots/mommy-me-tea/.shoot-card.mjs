import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: "new", args: ["--no-sandbox"] });
for (const [name, vp] of [["card-desktop",{width:1280,height:900}],["card-phone-portrait",{width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true}]]) {
  const p = await b.newPage(); await p.setViewport(vp);
  const r = await p.goto("https://vegaskiddos.com/venue/thel-tea-room?shot="+Date.now(), { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise(r=>setTimeout(r,1500));
  const info = await p.$$eval("img", els => els.filter(e=>/recuRIY1VF7NOn8ig/.test(e.currentSrc||e.src)).map(e=>{const i=e.getBoundingClientRect();const c=e.closest("a,article")?.getBoundingClientRect();return {img:Math.round(i.width),card:c&&Math.round(c.width),ok:e.naturalWidth>0}}));
  const el = await p.$("img[src*='recuRIY1VF7NOn8ig']"); if (el) await el.evaluate(e=>e.scrollIntoView({block:"center"}));
  await new Promise(r=>setTimeout(r,500));
  await p.screenshot({ path: `/workspace/vegaskiddos/shots/mommy-me-tea/${name}.png` });
  console.log(name, r.status(), JSON.stringify(info)); await p.close();
}
await b.close();
