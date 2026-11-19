import { FadeIn } from "@/components/animations/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export function PageShell({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-10 md:px-6 md:py-14",
        className,
      )}
    >
      <FadeIn>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </FadeIn>
      {children}
    </main>
  );
}