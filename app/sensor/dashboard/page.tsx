"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { subMinutes, format } from "date-fns";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

// react-grid-layout needs window, so load dynamically to avoid SSR issues
const ResponsiveGridLayout = dynamic(
  () =>
    import("react-grid-layout").then((mod: any) => {
      const Responsive = mod.Responsive || (mod.default && mod.default.Responsive);
      const WP = mod.WidthProvider || (mod.default && mod.default.WidthProvider);
      return WP ? WP(Responsive) : Responsive;
    }),
  { ssr: false }
);
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface Sensor {
  id: string;
  group: string;
  desc: string;
}

const sensors: Sensor[] = [
  { id: "SNS-001", group: "온도(1공장)", desc: "1공장 A라인 온도" },
  { id: "SNS-002", group: "진동(1공장)", desc: "1공장 B라인 진동" },
  { id: "SNS-003", group: "전력(1공장)", desc: "전기실 전력" },
  { id: "SNS-004", group: "온습도(본관)", desc: "본관 2층 온습도" },
  { id: "SNS-005", group: "온도(창고)", desc: "2공장 창고 온도" },
];

// localStorage key for persisting dashboard state
const STORAGE_KEY = "sensorDashboardState";

// mock real-time generator
const generateSeries = () => {
  const data: { ts: string; value: number }[] = [];
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const ts = subMinutes(now, 30 - i);
    data.push({ ts: format(ts, "HH:mm"), value: Math.random() * 100 });
  }
  return data;
};

export default function SensorDashboardPage() {
  const [selected, setSelected] = useState<string>(sensors[0].id);
  const [cards, setCards] = useState<{ sensor: Sensor; data: { ts: string; value: number }[] }[]>([]);
  const [layouts, setLayouts] = useState<any>({});

  // Load saved state on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const state = JSON.parse(saved);
      if (state.cardIds && Array.isArray(state.cardIds)) {
        const loadedCards = state.cardIds
          .map((id: string) => {
            const sensor = sensors.find((s) => s.id === id);
            if (!sensor) return null;
            return { sensor, data: generateSeries() };
          })
          .filter(Boolean) as { sensor: Sensor; data: { ts: string; value: number }[] }[];
        setCards(loadedCards);
      }
      if (state.layouts) {
        setLayouts(state.layouts);
      }
    } catch {
      /* ignore corrupted state */
    }
  }, []);

  // Persist state when cards or layouts change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const state = { cardIds: cards.map((c) => c.sensor.id), layouts };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [cards, layouts]);

  const addCard = () => {
    const sensor = sensors.find((s) => s.id === selected);
    if (!sensor) return;
    if (cards.some((c) => c.sensor.id === sensor.id)) return; // already added
    setCards((prev) => [...prev, { sensor, data: generateSeries() }]);
  };

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.sensor.id !== id));
  };

  // helper to generate grid position
  const getItemLayout = (idx: number) => ({ x: (idx % 4) * 3, y: Infinity, w: 3, h: 3 });

  return (
    <div className="flex-1 p-4 md:p-8 space-y-4">
      <h2 className="text-3xl font-bold">센서 대시보드</h2>

      {/* Control Bar */}
      <div className="flex gap-2 flex-wrap items-center">
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="센서 선택" />
          </SelectTrigger>
          <SelectContent>
            {sensors.map((s) => (
              <SelectItem key={s.id} value={s.id}>{`${s.group} – ${s.desc}`}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addCard}>카드 추가</Button>
      </div>

      {/* Grid */}
      <ResponsiveGridLayout
        className="layout"
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
        rowHeight={120}
        margin={[10, 10]}
        isDraggable
        isResizable
        layouts={layouts}
        onLayoutChange={(layout, allLayouts) => setLayouts(allLayouts)}
      >
        {cards.map((c, idx) => (
          <div key={c.sensor.id} data-grid={getItemLayout(idx)}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-start justify-between pb-0">
                <div>
                  <CardTitle className="text-sm">{c.sensor.group}</CardTitle>
                  <CardDescription className="text-xs">{c.sensor.desc}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeCard(c.sensor.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="h-[calc(100%_-_50px)]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={c.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ts" minTickGap={20} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
