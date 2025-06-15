import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export default function CalendarWidgetFallback() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Calendar Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-[200px] space-y-6 p-4">
          <div className="text-center space-y-3">
            <p className="text-4xl">🎲</p>
            <h3 className="text-lg font-semibold">Feature Flag Lottery Winner!</h3>
            <p className="text-sm text-muted-foreground">
              Congratulations! You&apos;ve been randomly selected by our feature flags to experience the joy of
              anticipation.
            </p>
            <p className="text-sm text-muted-foreground">
              The Calendar feature is taking a little vacation from your account, but don&apos;t worry - it&apos;ll be
              back soon as part of our gradual rollout.
            </p>
          </div>
          <Button variant="outline" disabled className="mt-4">
            Coming Soon
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
