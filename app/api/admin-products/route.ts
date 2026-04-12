import { NextResponse } from "next/server";

const TOKEN = process.env.AIRTABLE_PAT!;
const BASE = "appo9jJWfID89uSUC";
const TABLE = "tblLADTjgy121q5Ws";

// Cache for 10 seconds (short enough to reflect edits quickly)
let cache: { data: any[]; ts: number } | null = null;
const CACHE_TTL = 10_000;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bust = searchParams.get("bust");

  // Return cache if fresh (unless bust=1 is passed)
  if (!bust && cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  const records: any[] = [];
  let offset: string | undefined;

  do {
    const url = `https://api.airtable.com/v0/${BASE}/${TABLE}?pageSize=100${offset ? `&offset=${offset}` : ""}`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      next: { revalidate: 60 },
    });
    const data = await resp.json();
    for (const rec of data.records) {
      const f = rec.fields;
      if (!f.cloudinaryUrl) continue; // skip records without images
      records.push({
        id: rec.id,
        patternFamily: (f.patternFamily || "").trim(),
        pattern: f.pattern || "",
        title: f.title || "",
        cloudinaryUrl: f.cloudinaryUrl || "",
        sector: f.sector || "",
        corianColor: f.corianColor || "",
        isBacklit: f.isBacklit || false,
        keywords: f.keywords || "",
        description: f.description || "",
        design_type: f.design_type || "",
        specReady: f.specReady || false,
        is_hero: f.is_hero || false,
        is_exterior: f.is_exterior || false,
        project_name: f.project_name || "",
        render_texture_url: f.render_texture_url || "",
        application: f.application || "",
        applicationHero: f.applicationHero || false,
      });
    }
    offset = data.offset;
  } while (offset);

  cache = { data: records, ts: Date.now() };
  return NextResponse.json(records);
}
