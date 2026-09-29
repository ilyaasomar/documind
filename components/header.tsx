"use client";

export function Header({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-card/80 px-3 backdrop-blur-md sm:px-4">
      <div className="flex justify-between w-full">
        <div className="flex flex-col items-start gap-0">
          <h1 className="truncate text-[15px] font-semibold tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          {children}
        </div>
      </div>
    </header>
  );
}
