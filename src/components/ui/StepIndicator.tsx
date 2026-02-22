"use client";

const CHECKOUT_STEPS = [
  { id: "details", label: "Details" },
  { id: "extras", label: "Extras" },
  { id: "review", label: "Review" },
  { id: "payment", label: "Payment" },
] as const;

type StepId = (typeof CHECKOUT_STEPS)[number]["id"];

interface StepIndicatorProps {
  current: StepId;
  steps?: readonly { id: string; label: string }[];
}

export function StepIndicator({
  current,
  steps = CHECKOUT_STEPS,
}: StepIndicatorProps) {
  const idx = steps.findIndex((s) => s.id === current);
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center gap-2">
        {steps.map((step, i) => {
          const status =
            i < idx ? "complete" : i === idx ? "current" : "upcoming";
          return (
            <li key={step.id} className="flex flex-1 items-center">
              <div
                className={`flex min-h-[44px] min-w-[44px] items-center justify-center text-sm font-bold
                  ${
                    status === "complete"
                      ? "bg-black text-white"
                      : status === "current"
                        ? "border-2 border-black bg-black text-white"
                        : "border-2 border-hertz-border bg-white text-hertz-black-60"
                  }`}
              >
                {status === "complete" ? "✓" : i + 1}
              </div>
              <span
                className={`ml-2 hidden text-sm lg:inline ${
                  status === "current"
                    ? "font-bold text-black"
                    : "text-hertz-black-60"
                }`}
              >
                {step.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 lg:mx-4 ${
                    status === "complete" ? "bg-black" : "bg-hertz-border"
                  }`}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
