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

interface Source {
  id: number;
  name: string;
  type: string;
  location: string;
}

const MOCK_SOURCES: Source[] = [
  { id: 1, name: "보일러 #1", type: "설비", location: "공장동 A" },
  { id: 2, name: "생산라인 2", type: "공정", location: "공장동 B" },
  { id: 3, name: "연구동 냉각탑", type: "설비", location: "연구동" },
];

export default function CarbonSourcesPage() {
  const [sources, setSources] = useState<Source[]>(MOCK_SOURCES);
  const [showDialog, setShowDialog] = useState(false);
  const [editSource, setEditSource] = useState<Source | null>(null);
  const [form, setForm] = useState({ name: "", type: "설비", location: "" });

  const columns: Column<Source>[] = [
    { key: "name", title: "이름", searchable: true },
    {
      key: "type",
      title: "유형",
      filterable: true,
      filterOptions: [
        { label: "설비", value: "설비" },
        { label: "공정", value: "공정" },
        { label: "기타", value: "기타" },
      ],
    },
    { key: "location", title: "위치", searchable: true },
  ];

  const actions = [
    {
      key: "edit",
      label: "수정",
      icon: (props: any) => <span {...props}>✏️</span>,
      onClick: (src: Source) => {
        setEditSource(src);
        setForm({ name: src.name, type: src.type, location: src.location });
        setShowDialog(true);
      },
    },
    {
      key: "delete",
      label: "삭제",
      icon: (props: any) => <span {...props}>🗑️</span>,
      variant: "destructive",
      onClick: (src: Source) =>
        setSources(sources.filter((s) => s.id !== src.id)),
    },
  ];

  const handleAdd = () => {
    setEditSource(null);
    setForm({ name: "", type: "설비", location: "" });
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editSource) {
      setSources(
        sources.map((s) =>
          s.id === editSource.id ? { ...editSource, ...form } : s
        )
      );
    } else {
      setSources([{ ...form, id: Date.now() }, ...sources]);
    }
    setShowDialog(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>배출원 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={sources}
          columns={columns}
          actions={actions}
          title="배출원 목록"
          addButtonText="배출원 추가"
          onAdd={handleAdd}
          searchPlaceholder="이름, 위치 검색"
          emptyMessage="배출원 데이터가 없습니다."
        />
      </CardContent>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editSource ? "배출원 수정" : "배출원 등록"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1">이름</label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1">유형</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
              >
                <option value="설비">설비</option>
                <option value="공정">공정</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">위치</label>
              <Input
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
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
