import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  CalendarDays,
  Users,
  CircleDollarSign,
  FileText,
  Sparkles,
} from "lucide-react";

interface ExecutiveInsightsProps {
  totalClauses: number;
  highRisk: number;
  mediumRisk: number;
  safeRisk: number;
  parties: number;
  deadlines: number;
  financials: number;
  recommendation?: string;
}

export function ExecutiveInsights({
  totalClauses,
  highRisk,
  mediumRisk,
  safeRisk,
  parties,
  deadlines,
  financials,
  recommendation,
}: ExecutiveInsightsProps) {
  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (safeRisk * 100 + mediumRisk * 60 + highRisk * 20) /
          Math.max(totalClauses, 1)
      )
    )
  );

  const healthStatus =
    score >= 80
      ? "Healthy"
      : score >= 50
      ? "Moderate"
      : "Critical";

  return (
    <div className="space-y-6">
      {/* Executive Dashboard */}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            AI Executive Insights
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                Contract Health Score
              </span>

              <span className="font-bold text-lg">{score}%</span>
            </div>

            <Progress value={score} />

            <div className="flex justify-end mt-3">
              <Badge
                variant={
                  score >= 80
                    ? "secondary"
                    : score >= 50
                    ? "default"
                    : "destructive"
                }
              >
                {healthStatus}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Badge
              variant="destructive"
              className="justify-center py-2"
            >
              High Risk : {highRisk}
            </Badge>

            <Badge
              variant="default"
              className="justify-center py-2"
            >
              Medium Risk : {mediumRisk}
            </Badge>

            <Badge
              variant="secondary"
              className="justify-center py-2"
            >
              Safe : {safeRisk}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendation */}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Recommendation
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground leading-6">
            {recommendation
              ? recommendation
              : highRisk > 0
              ? "High-risk clauses detected. Review termination, liability and payment obligations carefully before signing."
              : mediumRisk > 0
              ? "Document appears mostly safe but important obligations should be reviewed."
              : "No major risks detected. The contract appears balanced and well structured."}
          </p>
        </CardContent>
      </Card>

      {/* Statistics */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <FileText className="h-6 w-6 text-primary" />

              <h2 className="text-3xl font-bold">
                {totalClauses}
              </h2>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Total Clauses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Users className="h-6 w-6 text-primary" />

              <h2 className="text-3xl font-bold">
                {parties}
              </h2>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Parties Involved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <CalendarDays className="h-6 w-6 text-primary" />

              <h2 className="text-3xl font-bold">
                {deadlines}
              </h2>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Deadlines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <CircleDollarSign className="h-6 w-6 text-primary" />

              <h2 className="text-3xl font-bold">
                {financials}
              </h2>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Financial Items
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```
