"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DataTable, Column } from "@/components/common/data-table";

interface Scope3 {
  id: number;
  partner: string;
  activity: string;
  emission: number;
}

const MOCK_SCOPE3: Scope3[] = [
  { id: 1, partner: "A사", activity: "물류", emission: 120 },
  { id: 2, partner: "B사", activity: "원자재 공급", emission: 340 },
];

export default function CarbonScope3Page() {
  const [scope3, setScope3] = useState<Scope3[]>(MOCK_SCOPE3);
  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState<Scope3 | null>(null);
  const [form, setForm] = useState({
    partner: "",
    activity: "물류",
    emission: "",
  });

  const columns: Column<Scope3>[] = [
    { key: "partner", title: "공급/협력사", searchable: true },
    {
      key: "activity",
      title: "활동유형",
      filterable: true,
      filterOptions: [
        { label: "물류", value: "물류" },
        { label: "원자재 공급", value: "원자재 공급" },
        { label: "기타", value: "기타" },
      ],
    },
    { key: "emission", title: "배출량(tCO₂e)" },
  ];

  const actions = [
    {
      key: "edit",
      label: "수정",
      icon: (props: any) => <span {...props}>✏️</span>,
      onClick: (item: Scope3) => {
        setEditItem(item);
        setForm({
          partner: item.partner,
          activity: item.activity,
          emission: String(item.emission),
        });
        setShowDialog(true);
      },
    },
    {
      key: "delete",
      label: "삭제",
      icon: (props: any) => <span {...props}>🗑️</span>,
      variant: "destructive" as const,
      onClick: (item: Scope3) =>
        setScope3(scope3.filter((s) => s.id !== item.id)),
    },
  ];

  const handleAdd = () => {
    setEditItem(null);
    setForm({ partner: "", activity: "물류", emission: "" });
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      setScope3(
        scope3.map((s) =>
          s.id === editItem.id
            ? { ...editItem, ...form, emission: Number(form.emission) }
            : s
        )
      );
    } else {
      setScope3([
        { ...form, id: Date.now(), emission: Number(form.emission) },
        ...scope3,
      ]);
    }
    setShowDialog(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>밸류체인(Scope 3) 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={scope3}
          columns={columns}
          actions={actions}
          title="밸류체인 목록"
          addButtonText="밸류체인 추가"
          onAdd={handleAdd}
          searchPlaceholder="공급/협력사, 활동유형 검색"
          emptyMessage="밸류체인 데이터가 없습니다."
        />
      </CardContent>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editItem ? "밸류체인 수정" : "밸류체인 등록"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1">공급/협력사</label>
              <Input
                value={form.partner}
                onChange={(e) =>
                  setForm((f) => ({ ...f, partner: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1">활동유형</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={form.activity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, activity: e.target.value }))
                }
              >
                <option value="물류">물류</option>
                <option value="원자재 공급">원자재 공급</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">배출량(tCO₂e)</label>
              <Input
                type="number"
                value={form.emission}
                onChange={(e) =>
                  setForm((f) => ({ ...f, emission: e.target.value }))
                }
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowDialog(false)}
              >
                취소
              </Button>
              <Button type="submit">저장</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
