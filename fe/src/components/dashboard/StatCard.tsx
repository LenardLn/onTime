import type { ComponentType, ReactNode } from "react";

import { Card, CardContent } from "@/components/shadcn/card";

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ComponentType<{ className?: string }>;
};

const StatCard = ({ label, value, hint, icon: Icon }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        {Icon && (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-7" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-lg text-muted-foreground">{label}</p>
          <p className="truncate text-3xl font-semibold">{value}</p>
          {hint && <p className="truncate text-base text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
