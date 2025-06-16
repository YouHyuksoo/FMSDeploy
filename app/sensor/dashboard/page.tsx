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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  LineChart as LucideLineChart,
  BarChart,
  Maximize2,
  Minimize2,
  ExternalLink,
  Minimize,
} from "lucide-react";
import { Gauge } from "@/components/ui/gauge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// react-grid-layout 타입 정의
declare module "react-grid-layout" {
  interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }

  interface Layouts {
    lg?: Layout[];
    md?: Layout[];
    sm?: Layout[];
    xs?: Layout[];
  }

  interface ResponsiveGridLayoutProps {
    className?: string;
    breakpoints: { lg: number; md: number; sm: number; xs: number };
    cols: { lg: number; md: number; sm: number; xs: number };
    rowHeight: number;
    margin: [number, number];
    isDraggable?: boolean;
    isResizable?: boolean;
    layouts?: Layouts;
    onLayoutChange?: (layout: Layout[], allLayouts: Layouts) => void;
    children?: React.ReactNode;
  }

  export class ResponsiveGridLayout extends React.Component<ResponsiveGridLayoutProps> {}
  export function WidthProvider<P>(
    component: React.ComponentType<P>
  ): React.ComponentType<P>;
}

type Layout = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

type Layouts = {
  lg?: Layout[];
  md?: Layout[];
  sm?: Layout[];
  xs?: Layout[];
};

// react-grid-layout needs window, so load dynamically to avoid SSR issues
const ResponsiveGridLayout = dynamic(
  () =>
    import("react-grid-layout").then((mod) => {
      const Responsive =
        mod.Responsive || (mod.default && mod.default.Responsive);
      const WP =
        mod.WidthProvider || (mod.default && mod.default.WidthProvider);
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
  min?: number;
  max?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
}

const sensors: Sensor[] = [
  {
    id: "SNS-001",
    group: "온도(1공장)",
    desc: "1공장 A라인 온도",
    min: 0,
    max: 100,
    warningThreshold: 70,
    criticalThreshold: 85,
  },
  {
    id: "SNS-002",
    group: "진동(1공장)",
    desc: "1공장 B라인 진동",
    min: 0,
    max: 50,
    warningThreshold: 35,
    criticalThreshold: 45,
  },
  {
    id: "SNS-003",
    group: "전력(1공장)",
    desc: "전기실 전력",
    min: 0,
    max: 1000,
    warningThreshold: 750,
    criticalThreshold: 900,
  },
  {
    id: "SNS-004",
    group: "온습도(본관)",
    desc: "본관 2층 온습도",
    min: 0,
    max: 100,
    warningThreshold: 80,
    criticalThreshold: 90,
  },
  {
    id: "SNS-005",
    group: "온도(창고)",
    desc: "2공장 창고 온도",
    min: 0,
    max: 100,
    warningThreshold: 75,
    criticalThreshold: 85,
  },
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
  const [cards, setCards] = useState<
    {
      sensor: Sensor;
      data: { ts: string; value: number }[];
      viewMode: "chart" | "gauge";
    }[]
  >([]);
  const [layouts, setLayouts] = useState<Layouts>({});
  const [fullscreenCard, setFullscreenCard] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
            return { sensor, data: generateSeries(), viewMode: "chart" };
          })
          .filter(Boolean) as {
          sensor: Sensor;
          data: { ts: string; value: number }[];
          viewMode: "chart" | "gauge";
        }[];
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

  // 전체화면 토글 함수
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 전체화면 변경 이벤트 리스너
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const addCard = () => {
    const sensor = sensors.find((s) => s.id === selected);
    if (!sensor) return;
    if (cards.some((c) => c.sensor.id === sensor.id)) return; // already added
    setCards((prev) => [
      ...prev,
      {
        sensor,
        data: generateSeries(),
        viewMode: "chart",
      },
    ]);
  };

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.sensor.id !== id));
  };

  const toggleViewMode = (id: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.sensor.id === id
          ? { ...card, viewMode: card.viewMode === "chart" ? "gauge" : "chart" }
          : card
      )
    );
  };

  const toggleFullscreenCard = (id: string) => {
    setFullscreenCard(fullscreenCard === id ? null : id);
  };

  // helper to generate grid position
  const getItemLayout = (idx: number): Layout => ({
    i: `item-${idx}`,
    x: (idx % 4) * 3,
    y: Infinity,
    w: 3,
    h: 3,
  });

  const onLayoutChange = (layout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
  };

  return (
    <div
      className={`flex-1 p-4 md:p-8 space-y-4 ${
        isFullscreen ? "fixed inset-0 bg-background z-50" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">센서 대시보드</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="ml-2"
        >
          {isFullscreen ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <ExternalLink className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Control Bar */}
      <div className="flex gap-2 flex-wrap items-center">
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="센서 선택" />
          </SelectTrigger>
          <SelectContent>
            {sensors.map((s) => (
              <SelectItem
                key={s.id}
                value={s.id}
              >{`${s.group} – ${s.desc}`}</SelectItem>
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
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
      >
        {cards.map((c, idx) => (
          <div
            key={c.sensor.id}
            data-grid={
              fullscreenCard === c.sensor.id
                ? { x: 0, y: 0, w: 12, h: 8 }
                : getItemLayout(idx)
            }
            className={
              fullscreenCard
                ? fullscreenCard === c.sensor.id
                  ? "z-50"
                  : "hidden"
                : ""
            }
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-start justify-between pb-0">
                <div className="drag-handle cursor-move">
                  <CardTitle className="text-sm">{c.sensor.group}</CardTitle>
                  <CardDescription className="text-xs">
                    {c.sensor.desc}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleViewMode(c.sensor.id);
                    }}
                  >
                    {c.viewMode === "chart" ? (
                      <BarChart className="h-4 w-4" />
                    ) : (
                      <LucideLineChart className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFullscreenCard(c.sensor.id);
                    }}
                  >
                    {fullscreenCard === c.sensor.id ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeCard(c.sensor.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%_-_50px)]">
                {c.viewMode === "chart" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={c.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ts" minTickGap={20} />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <Gauge
                      value={c.data[c.data.length - 1].value}
                      min={c.sensor.min}
                      max={c.sensor.max}
                      size="lg"
                      className={
                        c.sensor.criticalThreshold &&
                        c.data[c.data.length - 1].value >=
                          c.sensor.criticalThreshold
                          ? "text-red-500"
                          : c.sensor.warningThreshold &&
                            c.data[c.data.length - 1].value >=
                              c.sensor.warningThreshold
                          ? "text-yellow-500"
                          : "text-green-500"
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
