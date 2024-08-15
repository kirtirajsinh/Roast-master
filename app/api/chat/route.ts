import { replicate } from "@/utils/replicate";
import { NextResponse } from "next/server";
// Create a Replicate API client

export async function POST(req: Request) {
  const { messages, promptTemplate } = await req.json();

  console.log(messages, "messages");

  const response = await fetch(
    "https://0x768da699e7b40d6fa4660afefa33ef6ccc45749a.us.gaianet.network/v1/chat/completions",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: `${promptTemplate}` },
          { role: "user", content: `${messages}` },
        ],
        completion_tokens: 100,
      }),
    }
  );
  const data = await response.json();

  console.log(data, "data");

  return NextResponse.json(data);
}
