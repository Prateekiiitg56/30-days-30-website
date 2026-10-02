import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { canTryOn, getProduct } from "@/lib/catalogue";
import { leffaTryOn } from "@/lib/server/leffa";

/**
 * Virtual try-on, one garment per request (PRD §11 "generate in layers").
 * The client chains calls bottom → top → outerwear, passing the previous result as `photo`,
 * and caches each step so toggling an item doesn't regenerate everything.
 *
 * The garment image is chosen here from the catalogue — never taken from the client.
 * The photo is only held in memory for the call and forwarded to the try-on model.
 */

export const runtime = "nodejs";
export const maxDuration = 180;

const MAX_PHOTO_CHARS = 8 * 1024 * 1024; // data URL of a ~6 MB image

function dataUrlToBlob(dataUrl: string): Blob | null {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!m) return null;
  return new Blob([Buffer.from(m[2], "base64")], { type: m[1] });
}

export async function POST(req: Request) {
  let body: { photo?: unknown; mode?: unknown; productId?: unknown; colour?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const { photo, mode, productId, colour } = body;
  if (typeof photo !== "string" || photo.length > MAX_PHOTO_CHARS || (mode !== "full" && mode !== "half")) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const product = typeof productId === "string" ? getProduct(productId) : undefined;
  const col = product?.colours.find((c) => c.id === colour);
  if (!product || !col || !canTryOn(product)) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const person = dataUrlToBlob(photo);
  if (!person) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  let garment: Blob;
  try {
    const file = path.join(process.cwd(), "public/images/garments", `${product.id}-${col.id}.webp`);
    garment = new Blob([await readFile(file)], { type: "image/webp" });
  } catch {
    return NextResponse.json({ error: "garment_missing" }, { status: 404 });
  }

  try {
    const result = await leffaTryOn(person, garment, product.tryOn.slot!, mode);
    const b64 = Buffer.from(await result.arrayBuffer()).toString("base64");
    return NextResponse.json({ image: `data:${result.type || "image/webp"};base64,${b64}` });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const quota = /quota|GPU|exceeded/i.test(msg);
    console.error("[tryon] leffa failed:", msg);
    return NextResponse.json({ error: quota ? "quota" : "provider_failed" }, { status: quota ? 429 : 502 });
  }
}
