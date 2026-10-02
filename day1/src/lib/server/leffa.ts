import { Client, handle_file } from "@gradio/client";
import type { Slot } from "../catalogue";

/**
 * Leffa virtual try-on (MIT licence) on its free Hugging Face Space.
 * One call dresses the person in one garment; outfits are built by chaining calls.
 * HF_TOKEN (optional, free Read token) raises the Space's GPU quota.
 */
const SPACE = "franciszzj/Leffa";

let client: Promise<Client> | null = null;
const connect = () => {
  const token = process.env.HF_TOKEN as `hf_${string}` | undefined;
  client ??= Client.connect(SPACE, token ? { hf_token: token } : {}).catch((e) => {
    client = null; // let the next request retry the handshake
    throw e;
  });
  return client;
};

// Leffa's dress_code model knows tops, bottoms and dresses; outerwear is dressed as a top.
const GARMENT_TYPE: Record<Slot, "upper_body" | "lower_body" | "dresses"> = {
  top: "upper_body",
  outer: "upper_body",
  bottom: "lower_body",
  full: "dresses",
};

export async function leffaTryOn(person: Blob, garment: Blob, slot: Slot, mode: "full" | "half"): Promise<Blob> {
  const app = await connect();
  const res = await app.predict("/leffa_predict_vt", {
    src_image_path: handle_file(person),
    ref_image_path: handle_file(garment),
    ref_acceleration: false,
    step: 30,
    scale: 2.5,
    seed: 42,
    // viton_hd is trained on half-body photos of tops; dress_code covers full body and every garment type.
    vt_model_type: mode === "half" ? "viton_hd" : "dress_code",
    vt_garment_type: mode === "half" ? "upper_body" : GARMENT_TYPE[slot],
    vt_repaint: false,
  });
  const out = (res.data as { url?: string }[])[0];
  if (!out?.url) throw new Error("leffa_no_image");
  const token = process.env.HF_TOKEN;
  const img = await fetch(out.url, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  if (!img.ok) throw new Error(`leffa_fetch_${img.status}`);
  return img.blob();
}
