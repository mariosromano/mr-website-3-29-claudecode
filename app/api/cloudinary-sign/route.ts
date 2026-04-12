import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

export async function POST(req: NextRequest) {
  const { public_id, timestamp } = await req.json();
  const params = `public_id=${public_id}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(params + API_SECRET).digest("hex");
  return NextResponse.json({ signature });
}
