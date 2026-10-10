import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { getSnapshotInfo, refreshEventSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

async function authed() {
  const c = await cookies();
  return isValidSession(c.get(ADMIN_COOKIE)?.value);
}

// GET: when the public event snapshot was last imported from Airtable.
export async function GET() {
  if (!(await authed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ snapshot: await getSnapshotInfo() });
}

// POST: re-import now (e.g. after editing records directly in Airtable).
export async function POST() {
  if (!(await authed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await refreshEventSnapshot("admin:manual");
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
