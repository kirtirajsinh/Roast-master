import { replicate } from "@/utils/replicate";
import { NextResponse } from "next/server";
// Create a Replicate API client

export async function POST(req: Request) {
  const { messages, promptTemplate } = await req.json();

  console.log(messages, "messages");

  const input = {
    top_k: 50,
    top_p: 0.9,
    prompt: messages,
    temperature: 0.6,
    max_new_tokens: 50,
    prompt_template: `<s>[INST] ${promptTemplate} [/INST] `,
  };

  let story = "";

  for await (const event of replicate.stream(
    "mistralai/mixtral-8x7b-instruct-v0.1",
    { input }
  )) {
    story += event;
  }

  console.log(story, "story");

  return NextResponse.json(story);
}
