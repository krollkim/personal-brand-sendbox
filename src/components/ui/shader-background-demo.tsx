// Usage example for ShaderBackground.
// In this project the shader is wired into the hero (see src/components/sections/Hero.tsx);
// this standalone demo just renders it full-bleed.

import ShaderBackground from "@/components/ui/shader-background";

const DemoOne = () => {
  return (
    <div className="relative h-screen w-full">
      <ShaderBackground className="absolute inset-0 h-full w-full" />
    </div>
  );
};

export { DemoOne };
