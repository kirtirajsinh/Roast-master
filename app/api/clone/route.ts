import { replicate } from "@/utils/replicate";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { face, audio } = body;
  try {
    const output = await replicate.run(
      "devxpy/cog-wav2lip:8d65e3f4f4298520e079198b493c25adfc43c058ffec924f2aefc8010ed25eef",
      {
        input: {
          fps: 25,
          face: face,
          pads: "0 10 0 0",
          audio: audio,
          smooth: true,
          resize_factor: 1,
        },
      }
    );
    console.log(output);

    return NextResponse.json(output);
  } catch (err) {
    console.log(err);
    return NextResponse.json(err);
  }
}
