import { type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FooterContent {
  text: string;
  linkText: string;
  linkHref: string;
  forgotPasswordText?: string;
  forgotPasswordHref?: string;
}

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: {
    type: "custom";
    content: FooterContent;
  };
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-4">{children}</CardContent>
      {footer && (
        <div className="px-6 py-4 text-sm text-center text-muted-foreground">
          <span>{footer.content.text}</span>{" "}
          <a href={footer.content.linkHref} className="text-primary hover:underline">
            {footer.content.linkText}
          </a>
          {footer.content.forgotPasswordText && (
            <div className="mt-2">
              <a href={footer.content.forgotPasswordHref} className="text-primary hover:underline">
                {footer.content.forgotPasswordText}
              </a>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
