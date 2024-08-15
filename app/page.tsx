import ChatBox from "@/components/ChatBox";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="h1">Roast Master</h1>
      <ChatBox />
      <span className="">
        built by{" "}
        <Link
          target="_blank"
          className="text-purple-300"
          href="https://warpcast.com/boredhead"
        >
          @boredhead
        </Link>{" "}
      </span>
    </main>
  );
}
