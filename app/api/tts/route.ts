import { replicate } from "@/utils/replicate";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json();

  const { message, voice } = body;
  console.log(message, "message", voice, "voice");
  const output = await replicate.run(
    "lucataco/xtts-v2:684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
    {
      input: {
        text: message,
        speaker: voice,
        language: "en",
      },
    }
  );

  console.log(output, "output");

  return NextResponse.json(output);
}
