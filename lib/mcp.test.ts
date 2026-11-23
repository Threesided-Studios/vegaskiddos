import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createVegasKiddosServer, TOOL_NAMES } from "./mcp/server";
import { handleMcpRequest, LocalRateLimiter } from "./mcp/handler";
import { weekendRange, firstDateInRange, ageToTier, listedEvents, type SnapshotRecord } from "./mcp/events";
import { readSubmitPrefill } from "./submitPrefill";

// Fixed clock: Wednesday Nov 25, 2026, 10:00 Las Vegas time.
const NOW = new Date("2026-11-25T18:00:00Z");

const RECORDS: SnapshotRecord[] = [
  { id: "recAAAAAAAAAAAAA1", fields: { Title: "Toddler Storytime", TitleEs: "Cuentos para peques", Description: "Songs and stories", Venue: "Summerlin Library", Address: "1771 Inner Circle Dr", Neighborhood: "summerlin", Start: "2026-11-28T17:30:00.000Z", AgeTiers: ["toddler"], PriceTier: "free", Indoor: true, Url: "https://lvccld.org/x" } },
  { id: "recAAAAAAAAAAAAA2", fields: { Title: "Holiday Lights Walk", Description: "Lights and cocoa", Venue: "Springs Preserve", Neighborhood: "downtown", Start: "2026-11-29T01:00:00.000Z", AgeTiers: ["kids", "tweens"], PriceTier: "mid", PriceText: "$15" } },
  { id: "recAAAAAAAAAAAAA3", fields: { Title: "Lego Club", Description: "Build", Venue: "Whitney Library", Neighborhood: "henderson", Start: "2026-11-02T00:00:00.000Z", Recurrence: "Weekly on Sundays", AgeTiers: ["kids"], PriceTier: "free", ScrapedAt: "2026-11-24T00:00:00Z" } },
  { id: "recAAAAAAAAAAAAA4", fields: { Title: "Old Fair", Venue: "Somewhere", Start: "2026-10-01T18:00:00.000Z", PriceTier: "free" } },
  { id: "recAAAAAAAAAAAAA5", fields: { Title: "Science Night", Description: "Robots", Venue: "Discovery Children's Museum", Neighborhood: "downtown", Start: "2026-12-05T02:00:00.000Z", AgeTiers: [], PriceTier: "under10", javascript: "x", Url: "javascript:alert(1)" } },
];

async function connect() {
  const server = createVegasKiddosServer(async () => RECORDS, () => NOW);
  const [a, b] = InMemoryTransport.createLinkedPair();
  await server.connect(a);
  const client = new Client({ name: "test", version: "1.0.0" });
  await client.connect(b);
  return client;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parse = (r: any) => JSON.parse(r.content[0].text);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const call = async (c: Client, name: string, args: Record<string, unknown>): Promise<any> => c.callTool({ name, arguments: args });

describe("MCP event helpers", () => {
  it("weekendRange is Sat and Sun in Las Vegas time", () => {
    assert.deepEqual(weekendRange(NOW), { from: "2026-11-28", to: "2026-11-29" });
    assert.deepEqual(weekendRange(new Date("2026-11-29T20:00:00Z")), { from: "2026-11-29", to: "2026-11-29" });
    // Friday 11 PM Las Vegas is already Saturday in UTC; still this weekend.
    assert.deepEqual(weekendRange(new Date("2026-11-28T07:00:00Z")), { from: "2026-11-28", to: "2026-11-29" });
  });
  it("ageToTier maps ages to the site's age groups", () => {
    assert.equal(ageToTier(0), "baby");
    assert.equal(ageToTier(2), "toddler");
    assert.equal(ageToTier(4), "kids");
    assert.equal(ageToTier(13), "tweens");
  });
  it("listedEvents drops ended events and localizes", () => {
    const en = listedEvents(RECORDS, "en", NOW);
    assert.ok(!en.some((e) => e.id === "recAAAAAAAAAAAAA4"));
    const es = listedEvents(RECORDS, "es", NOW);
    assert.equal(es.find((e) => e.id === "recAAAAAAAAAAAAA1")?.title, "Cuentos para peques");
    assert.equal(en.find((e) => e.id === "recAAAAAAAAAAAAA5")?.url, undefined);
  });
  it("firstDateInRange handles recurring series", () => {
    const lego = listedEvents(RECORDS, "en", NOW).find((e) => e.id === "recAAAAAAAAAAAAA3")!;
    // Start is Sun Nov 1 at 4 PM PT, so it recurs on Sundays in LA time.
    assert.equal(firstDateInRange(lego, "2026-11-26", "2026-12-03"), "2026-11-29");
    assert.equal(firstDateInRange(lego, "2026-11-30", "2026-12-04"), null);
  });
});

describe("Vegas Kiddos MCP tools", () => {
  it("lists exactly the read-only tools", async () => {
    const { tools } = await (await connect()).listTools();
    assert.deepEqual(tools.map((t) => t.name).sort(), [...TOOL_NAMES].sort());
    for (const t of tools) assert.equal(t.annotations?.readOnlyHint, true, t.name);
  });

  it("search_events filters by keyword, age, price and area", async () => {
    const c = await connect();
    const lib = parse(await call(c, "search_events", { query: "library" }));
    assert.deepEqual(lib.results.map((r: { id: string }) => r.id).sort(), ["recAAAAAAAAAAAAA1", "recAAAAAAAAAAAAA3"]);
    const free = parse(await call(c, "search_events", { free_only: true, age: 2 }));
    assert.deepEqual(free.results.map((r: { id: string }) => r.id), ["recAAAAAAAAAAAAA1"]);
    const hood = parse(await call(c, "search_events", { area: "downtown" }));
    assert.equal(hood.total, 2);
    const ranged = parse(await call(c, "search_events", { date_from: "2026-12-01", date_to: "2026-12-10" }));
    assert.ok(ranged.results.some((r: { id: string }) => r.id === "recAAAAAAAAAAAAA5"));
    assert.ok(!ranged.results.some((r: { id: string }) => r.id === "recAAAAAAAAAAAAA1"));
    const bad = await call(c, "search_events", { date_from: "2026-12-10", date_to: "2026-12-01" });
    assert.equal(bad.isError, true);
  });

  it("search_events caps limit at 20", async () => {
    const r = await call(await connect(), "search_events", { limit: 50 });
    assert.equal(r.isError, true);
  });

  it("get_event returns details in Spanish and a clean miss", async () => {
    const c = await connect();
    const e = parse(await call(c, "get_event", { id: "recAAAAAAAAAAAAA1", lang: "es" }));
    assert.equal(e.title, "Cuentos para peques");
    assert.equal(e.page, "https://vegaskiddos.com/es/event/recAAAAAAAAAAAAA1");
    assert.equal(e.organizer_link, "https://lvccld.org/x");
    const miss = await call(c, "get_event", { id: "recAAAAAAAAAAAAA4" });
    assert.equal(miss.isError, true);
  });

  it("events_this_weekend covers Saturday and Sunday", async () => {
    const r = parse(await call(await connect(), "events_this_weekend", {}));
    assert.deepEqual(r.weekend, { from: "2026-11-28", to: "2026-11-29" });
    assert.deepEqual(r.results.map((x: { id: string }) => x.id).sort(), ["recAAAAAAAAAAAAA1", "recAAAAAAAAAAAAA2", "recAAAAAAAAAAAAA3"]);
    const free = parse(await call(await connect(), "events_this_weekend", { free_only: true }));
    assert.equal(free.total, 2);
  });

  it("list_guides and get_guide read the guide data", async () => {
    const c = await connect();
    const guides = parse(await call(c, "list_guides", {}));
    assert.ok(guides.some((g: { slug: string }) => g.slug === "holiday-guide-2026"));
    const g = parse(await call(c, "get_guide", { slug: "holiday-guide-2026" }));
    assert.ok(g.venues.length > 3);
    assert.ok(g.venues[0].facts.length > 0);
    const es = parse(await call(c, "get_guide", { slug: "holiday-guide-2026", lang: "es" }));
    assert.match(es.title, /Acción de Gracias/);
    const miss = await call(c, "get_guide", { slug: "nope" });
    assert.equal(miss.isError, true);
  });

  it("search_venues groups events by venue", async () => {
    const r = parse(await call(await connect(), "search_venues", { query: "library" }));
    assert.deepEqual(r.results.map((v: { name: string }) => v.name).sort(), ["Summerlin Library", "Whitney Library"]);
    assert.equal(r.results[0].page.startsWith("https://vegaskiddos.com/venue/"), true);
  });

  it("prepare_event_submission only builds a link", async () => {
    const r = parse(await call(await connect(), "prepare_event_submission", {
      title: "Park Picnic", start: "2026-12-12T10:00", venue: "Sunset Park", url: "https://example.org/picnic",
    }));
    assert.equal(r.submitted, false);
    const u = new URL(r.submit_link);
    assert.equal(u.pathname, "/submit");
    assert.equal(u.searchParams.get("title"), "Park Picnic");
    assert.deepEqual(readSubmitPrefill(u.search), { title: "Park Picnic", venue: "Sunset Park", start: "2026-12-12T10:00", url: "https://example.org/picnic" });
    const bad = await call(await connect(), "prepare_event_submission", { title: "X", start: "tomorrow", venue: "Y" });
    assert.equal(bad.isError, true);
  });
});

describe("submit prefill", () => {
  it("keeps only safe text fields", () => {
    const p = readSubmitPrefill("?title=Hi&submitterEmail=a@b.c&company=spam&url=javascript:alert(1)&start=soon&priceTier=free");
    assert.deepEqual(p, { title: "Hi" });
  });
});

describe("MCP HTTP handler", () => {
  const post = (body: unknown, ip = "1.1.1.1", headers: Record<string, string> = { accept: "application/json, text/event-stream" }) =>
    new Request("https://vegaskiddos.com/mcp", {
      method: "POST",
      headers: { "content-type": "application/json", "cf-connecting-ip": ip, ...headers },
      body: JSON.stringify(body),
    });
  const load = async () => RECORDS;
  const init = { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "t", version: "1" } } };

  it("initializes and accepts a bridge-style tools/call", async () => {
    const r1 = await handleMcpRequest(post(init), { loadRecords: load, limiter: new LocalRateLimiter(), now: () => NOW });
    assert.equal(r1.status, 200);
    assert.equal((await r1.json()).result.serverInfo.name, "vegas-kiddos");
    const r2 = await handleMcpRequest(
      post({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "list_guides", arguments: {} } }, "1.1.1.1", {}),
      { loadRecords: load, limiter: new LocalRateLimiter(), now: () => NOW },
    );
    assert.equal(r2.status, 200);
    assert.ok(JSON.parse((await r2.json()).result.content[0].text).length >= 1);
  });

  it("rejects GET, bad JSON, big bodies and floods", async () => {
    const opts = { loadRecords: load, limiter: new LocalRateLimiter() };
    assert.equal((await handleMcpRequest(new Request("https://vegaskiddos.com/mcp"), opts)).status, 405);
    const bad = new Request("https://vegaskiddos.com/mcp", { method: "POST", body: "{" });
    assert.equal((await handleMcpRequest(bad, opts)).status, 400);
    const big = post({ jsonrpc: "2.0", id: 1, method: "ping", params: { x: "y".repeat(20000) } });
    assert.equal((await handleMcpRequest(big, opts)).status, 413);
    const tight = { loadRecords: load, limiter: new LocalRateLimiter(2, 60_000) };
    await handleMcpRequest(post(init, "2.2.2.2"), tight);
    await handleMcpRequest(post(init, "2.2.2.2"), tight);
    assert.equal((await handleMcpRequest(post(init, "2.2.2.2"), tight)).status, 429);
    assert.equal((await handleMcpRequest(post(init, "3.3.3.3"), tight)).status, 200);
  });
});

describe("date ranges and long runs", () => {
  const long: SnapshotRecord = { id: "recAAAAAAAAAAAAA6", fields: { Title: "Fall Stroll", Venue: "Downtown", Start: "2026-10-24T22:00:00.000Z", End: "2026-12-27T01:00:00.000Z", PriceTier: "free" } };
  const short: SnapshotRecord = { id: "recAAAAAAAAAAAAA7", fields: { Title: "Craft Fair", Venue: "Expo", Start: "2026-11-27T17:00:00.000Z", End: "2026-11-29T23:00:00.000Z", PriceTier: "free" } };
  it("long open-ended runs do not count as this weekend, short multi-day runs do", async () => {
    const server = createVegasKiddosServer(async () => [...RECORDS, long, short], () => NOW);
    const [a, b] = InMemoryTransport.createLinkedPair();
    await server.connect(a);
    const c = new Client({ name: "t", version: "1" });
    await c.connect(b);
    const r = parse(await call(c, "events_this_weekend", {}));
    const ids = r.results.map((x: { id: string }) => x.id);
    assert.ok(!ids.includes("recAAAAAAAAAAAAA6"));
    assert.ok(ids.includes("recAAAAAAAAAAAAA7"));
    const fair = r.results.find((x: { id: string }) => x.id === "recAAAAAAAAAAAAA7");
    assert.match(fair.when, /^Sat, Nov 28 \(runs Fri, Nov 27 to Sun, Nov 29\)$/);
    const lego = r.results.find((x: { id: string }) => x.id === "recAAAAAAAAAAAAA3");
    assert.match(lego.when, /^Sun, Nov 29, 4:00/);
  });
});

describe("rate limit layering", () => {
  it("the local cap applies even when the binding allows everything", async () => {
    const always = { limit: async () => ({ success: true }) };
    const opts = { loadRecords: async () => RECORDS, limiter: always, localLimiter: new LocalRateLimiter(1, 60_000) };
    const req = () => new Request("https://vegaskiddos.com/mcp", { method: "POST", headers: { "content-type": "application/json", "cf-connecting-ip": "5.5.5.5" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }) });
    assert.equal((await handleMcpRequest(req(), opts)).status, 200);
    assert.equal((await handleMcpRequest(req(), opts)).status, 429);
  });
});
