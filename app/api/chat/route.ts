import { replicate } from "@/utils/replicate";
import { NextResponse } from "next/server";
// Create a Replicate API client

export async function POST(req: Request) {
  const { messages, promptTemplate } = await req.json();

  console.log(messages, "messages");

  const url =
    "https://0x9b829bf1e151def03532ab355cdfe5cee001f4b0.us.gaianet.network/v1/chat/completions";
  const options = {
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
    }),
  };
  try {
    const response = await fetch(url, options);

    console.log(response, "response");
    const responseText = await response.text();
    console.log(responseText, "responseText");
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      console.log("Raw response:", responseText);
      throw new Error("Invalid JSON response");
    }

    console.log(data, "data");

    if (data?.choices?.[0]?.message?.content) {
      console.log(data.choices[0].message.content, "final roast");
      return NextResponse.json({ content: data.choices[0].message.content });
    } else {
      throw new Error("Unexpected response structure");
    }
  } catch (error) {
    console.error("Error in roastthePost:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
