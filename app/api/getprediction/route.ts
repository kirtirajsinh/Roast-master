import { replicate } from "@/utils/replicate";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  console.log(id, "id");

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
    });
  }

  try {
    const output = await replicate.predictions.get(id);
    console.log(output, "output from the API");
    return new Response(JSON.stringify(output));
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}
