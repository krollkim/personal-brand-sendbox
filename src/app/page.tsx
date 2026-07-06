import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Hats from "@/components/sections/Hats";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <Story />
      <Hats />
    </main>
  );
}
