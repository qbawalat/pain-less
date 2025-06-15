import { useEffect, useState } from "react";

interface RedirectingProps {
  to: string;
  delay?: number;
  message?: string;
}

export function Redirecting({ to, delay = 3000, message = "Redirecting..." }: RedirectingProps) {
  const [countdown, setCountdown] = useState(Math.ceil(delay / 1000));

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = to;
    }, delay);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [to, delay]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      <p className="text-sm text-muted-foreground">
        {message} {countdown > 0 && `(${countdown}s)`}
      </p>
    </div>
  );
}
