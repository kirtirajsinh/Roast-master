"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "./ui/carousel";
import { constantData } from "@/utils/prompt";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function ChatBox() {
  const [userInput, setUserInput] = useState<string>("");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userInput, "input");
    if (!userInput) return;
    try {
      setLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: userInput,
          promptTemplate: constantData[current].prompt,
        }),
      });
      const data = await response.json();

      generateTTS(data);
      console.log(data, "data");
      setUserInput("");
    } catch (err) {
      console.log(err, "err");
      setUserInput("");
      setLoading(false);
    }
  };

  const generateTTS = async (message: string) => {
    try {
      // const response = await fetch("/api/tts", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     message,
      //     voice: constantData[current].voice,
      //   }),
      // });
      // const data = await response.json();
      // console.log(data, "data");
      const response = await fetch("/api/elevenlabs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          voice_id: constantData[current].voice_id,
        }),
      });

      const data = await response.json();

      console.log(data, "data");

      clone(data.publicUrl);
    } catch (err) {
      console.log(err, "err");
      setLoading(false);
    }
  };

  const clone = async (audio: string) => {
    try {
      const response = await fetch("/api/clone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          face: constantData[current].video,
          audio,
        }),
      });
      const data = await response.json();
      console.log(data, "data");
      setVideoUrl(data); // Assuming the response contains a videoUrl
      setDialogOpen(true);
      setLoading(false);
    } catch (err) {
      console.log(err, "err");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <>
      <div className="flex flex-col items-center justify-center ">
        <Carousel setApi={setApi} className="w-full max-w-sm">
          <CarouselContent>
            {constantData.map((item, index) => (
              <CarouselItem key={item.id} className="">
                <Image
                  src={item.image}
                  alt={item.id.toString()}
                  width="500"
                  height="500"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full max-w-md space-y-4 mt-6"
        >
          <input
            className="w-full  p-2 border border-gray-300 rounded shadow-xl"
            value={userInput}
            placeholder="Ask something..."
            onChange={(e) => setUserInput(e.target.value)}
            autoFocus
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AIDen</DialogTitle>
            <DialogDescription>
              {videoUrl && (
                <div className="flex flex-col items-center">
                  <video controls className="mb-4 w-full max-w-md">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <a
                    href={videoUrl}
                    download
                    className="text-blue-500 underline"
                  >
                    Download Video
                  </a>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
