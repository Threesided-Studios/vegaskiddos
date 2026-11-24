import puppeteer from "puppeteer-core";
const URL = process.argv[2] || "https://vegaskiddos.com/event/recuRIY1VF7NOn8ig";
const OUT = "/workspace/vegaskiddos/shots/mommy-me-tea";
const views = [
  ["desktop", { width: 1440, height: 900, deviceScaleFactor: 1 }],
  ["phone-portrait", { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["phone-landscape", { width: 844, height: 390, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ["tablet", { width: 820, height: 1180, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
];
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: "new", args: ["--no-sandbox"] });
for (const [name, vp] of views) {
  const p = await b.newPage();
  await p.setViewport(vp);
  if (vp.isMobile) await p.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1");
  const res = await p.goto(URL + "?shot=" + Date.now(), { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise(r => setTimeout(r, 1500));
  const imgs = await p.$$eval("img", els => els.map(e => ({ src: e.currentSrc || e.src, w: e.getBoundingClientRect().width, ok: e.complete && e.naturalWidth > 0 })).filter(i => /recuRIY1VF7NOn8ig/.test(i.src)));
  await p.screenshot({ path: `${OUT}/${name}.png` });
  console.log(name, res.status(), JSON.stringify(imgs));
  await p.close();
}
await b.close();
