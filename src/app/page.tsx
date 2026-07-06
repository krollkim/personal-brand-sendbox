import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Hats from "@/components/sections/Hats";
import Work from "@/components/sections/Work";
import Connect from "@/components/sections/Connect";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <Story />
      <Hats />
      <Work />
      <Connect />
      <Footer />
    </main>
  );
}
