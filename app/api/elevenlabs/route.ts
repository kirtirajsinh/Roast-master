import { supabase } from "@/lib/supabaseAdmin";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const body = await req.json();

  const { message, voice_id } = body;

  if (!process.env.ELEVEN_LABS_API_KEYS)
    return new Response(
      JSON.stringify({ error: "No Eleven Labs API Keys Found" }),
      { status: 500 }
    );
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}?optimize_streaming_latency=0`,
      {
        method: "POST",
        headers: {
          accept: "audio/mpeg",
          "xi-api-key": process.env.ELEVEN_LABS_API_KEYS || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.1,
            similarity_boost: 0.5,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );
    console.log(response, "response");

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const file = uuidv4();

    const { data, error } = await supabase.storage
      .from("elevenlabs")
      .upload(`${file}.mp3`, buffer);

    if (error) {
      console.log(error);
    }
    const { data: publicUrl } = await supabase.storage
      .from("elevenlabs")
      .getPublicUrl(`${file}.mp3`);
    const realPublicUrl = publicUrl.publicUrl;
    console.log(realPublicUrl, "realPublicUrl");

    return new Response(JSON.stringify({ publicUrl: realPublicUrl }));
  } catch (err) {
    console.log(err);
    return new Response("Something went wrong", { status: 500 });
  }
}
