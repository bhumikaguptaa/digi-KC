import { ReactNode } from "react";
import PageTransition from "./PageTransition";

export default function ScreenShell({
  children,
  wide = false,
  centered = false,
}: {
  children: ReactNode;
  wide?: boolean;
  centered?: boolean;
}) {
  return (
    <main className="min-h-screen w-full bg-canvas px-4 pb-24 pt-20 sm:px-10 lg:px-16">
      <div
        className={`mx-auto flex w-full flex-col gap-6 ${
          wide ? "max-w-5xl" : "max-w-2xl"
        } ${centered ? "min-h-[80vh] justify-center" : ""}`}
      >
        <PageTransition>
          <div className="flex flex-col gap-6">{children}</div>
        </PageTransition>
      </div>
    </main>
  );
}
