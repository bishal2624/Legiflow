'use client';

import { useMemo } from "react";
import {
  Bar, BarChart, CartesianGrid, XAxis, YAxis,
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// ─── Design tokens ────────────────────────────────────────────────────────────
const PALETTE = {
  bar: "#6366f1",          // indigo
  barHover: "#818cf8",
  grid: "rgba(255,255,255,0.06)",
  tick: "rgba(255,255,255,0.4)",
  tooltipBg: "#1e1e2e",
  tooltipBorder: "rgba(99,102,241,0.4)",
  pie: ["#6366f1", "#22d3ee", "#f59e0b"],
};

// ─── Shared custom tooltip ────────────────────────────────────────────────────
function CustomTooltip({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; fill?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: PALETTE.tooltipBg,
        border: `1px solid ${PALETTE.tooltipBorder}`,
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 13,
        color: "#e2e8f0",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {label && <p style={{ marginBottom: 4, opacity: 0.55, fontSize: 11 }}>{label}</p>}
      {payload.map((p) => (
        <p key={p.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.fill ?? PALETTE.bar,
            }}
          />
          <strong style={{ color: "#fff" }}>{p.value}</strong>
          <span style={{ opacity: 0.5 }}>{p.name}</span>
        </p>
      ))}
    </div>
  );
}

// ─── CasesPerMonthChart ───────────────────────────────────────────────────────
interface CasesPerMonthChartProps {
  data: { month: string; cases: number }[];
}

export function CasesPerMonthChart({ data }: CasesPerMonthChartProps) {
  const peak = useMemo(() => (data.length > 0 ? Math.max(...data.map((d) => d.cases)) : 0), [data]);

  return (
    <Card className="col-span-1 lg:col-span-2 bg-[#13131f] border border-white/[0.06] overflow-hidden">
      {/* Accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-transparent" />

      <CardHeader className="pb-2 pt-5 px-6">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight text-white/90">
              Cases Per Month
            </CardTitle>
            <CardDescription className="text-xs text-white/35 mt-0.5">
              Activity over the last 6 months
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-400 tabular-nums">{peak}</p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Peak</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 pb-5">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 6, right: 16, left: -18, bottom: 0 }} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={PALETTE.grid} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: PALETTE.tick, fontSize: 11 }}
              tickMargin={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: PALETTE.tick, fontSize: 11 }}
              tickCount={5}
            />
            <Tooltip
              cursor={{ fill: "rgba(99,102,241,0.08)", radius: 4 }}
              content={<CustomTooltip />}
            />
            <Bar dataKey="cases" name="Cases" fill={PALETTE.bar} radius={[5, 5, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.month}
                  fill={entry.cases === peak ? PALETTE.barHover : PALETTE.bar}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ─── CaseStatusChart ──────────────────────────────────────────────────────────
interface CaseStatusChartProps {
  data: { name: string; value: number }[];
}

const STATUS_META: Record<string, { color: string; icon: string }> = {
  Open:    { color: PALETTE.pie[0], icon: "◉" },
  Closed:  { color: PALETTE.pie[1], icon: "✓" },
  Pending: { color: PALETTE.pie[2], icon: "◷" },
};

export function CaseStatusChart({ data }: CaseStatusChartProps) {
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);

  return (
    <Card className="col-span-1 bg-[#13131f] border border-white/[0.06] overflow-hidden">
      <div className="h-[3px] w-full bg-gradient-to-r from-cyan-500 via-amber-400 to-transparent" />

      <CardHeader className="pb-0 pt-5 px-6">
        <CardTitle className="text-base font-semibold tracking-tight text-white/90">
          Status Distribution
        </CardTitle>
        <CardDescription className="text-xs text-white/35 mt-0.5">
          Ratio of open, closed &amp; pending
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-5">
        <div className="flex items-center gap-4">
          {/* Donut */}
          <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={46}
                  outerRadius={64}
                  paddingAngle={4}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={0}
                >
                  {data.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_META[entry.name]?.color ?? PALETTE.pie[i % PALETTE.pie.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Centre label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-white tabular-nums">{total}</span>
              <span className="text-[9px] text-white/30 uppercase tracking-widest">Total</span>
            </div>
          </div>

          {/* Legend */}
          <ul className="flex flex-col gap-2.5 flex-1">
            {data.map((entry, i) => {
              const meta = STATUS_META[entry.name];
              const color = meta?.color ?? PALETTE.pie[i % PALETTE.pie.length];
              const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
              return (
                <li key={entry.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-white/60">
                      <span style={{ color }}>{meta?.icon ?? "●"}</span>
                      {entry.name}
                    </span>
                    <span className="font-semibold text-white/80 tabular-nums">{pct}%</span>
                  </div>
                  {/* Mini progress bar */}
                  <div className="h-1 w-full rounded-full bg-white/[0.07] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
