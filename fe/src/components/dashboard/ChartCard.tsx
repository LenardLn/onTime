import { useState, type ReactNode } from "react";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { downloadMetricCsv } from "@/apis/analytics.api";
import type { AnalyticsMetricKey } from "@/entities/analytics";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";

type ChartCardProps = {
  title: string;
  description?: string;
  metricKey: AnalyticsMetricKey;
  children: ReactNode;
  className?: string;
};

const ChartCard = ({
  title,
  description,
  metricKey,
  children,
  className,
}: ChartCardProps) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadMetricCsv(metricKey, title);
      toast.success(t("dashboard.downloadStarted", { name: title }));
    } catch {
      toast.warning(t("dashboard.downloadFailed"));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && (
          <CardDescription className="text-lg">{description}</CardDescription>
        )}
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            className="text-base"
            onClick={handleDownload}
            disabled={isDownloading}
            aria-label={t("dashboard.downloadCsv")}
          >
            <Download className="!size-4" />
            {t("dashboard.csv")}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ChartCard;
