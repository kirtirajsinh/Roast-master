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
import { usePathname } from "next/navigation";

export default function ChatBox() {
  const [userInput, setUserInput] = useState<string>("");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [predictionId, setPredictionId] = useState<string>("");

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

      console.log(data.content, "data from UI");
      // console.log(data.choices[0].message.content, "data");

      await generateTTS(data.content);
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

      // console.log(data, "data");

      await clone(data.publicUrl);
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
      // console.log(data, "data");
      setPredictionId(data);
    } catch (err) {
      console.log(err, "err");
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 100) {
      setUserInput(e.target.value);
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

  useEffect(() => {
    if (!predictionId) {
      return;
    }
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/getprediction?id=${predictionId}`);
        const data = await response.json();

        if (data.status === "succeeded") {
          setVideoUrl(data.output);
          setDialogOpen(true);
          clearInterval(interval);
          setUserInput("");
          setPredictionId("");
          setLoading(false);
        } else if (data.status === "failed") {
          console.error("Prediction failed:", data);
          clearInterval(interval);
          setUserInput("");
          setLoading(false);

          // Optionally, you can set an error state or show an error message to the user
        }
      } catch (err) {
        console.error(err);
        clearInterval(interval);
        setLoading(false);
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [predictionId]);

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
                <h1 className="text-xl font-bold mb-4 text-center">
                  {item.name}
                </h1>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full max-w-md space-y-4 mt-6"
        >
          <textarea
            className="w-full  p-2 border border-gray-300 rounded shadow-xl"
            value={userInput}
            placeholder="Enter your personality, work, hobbies, or a line You want to raost "
            onChange={handleInputChange}
            disabled={loading}
            autoFocus
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {loading ? "Loading..." : "Roast"}
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
