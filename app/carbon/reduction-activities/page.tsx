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

interface Activity {
  id: number;
  name: string;
  type: string;
  start: string;
  end: string;
  status: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 1,
    name: "고효율 모터 교체",
    type: "설비 개선",
    start: "2024-01-01",
    end: "2024-03-31",
    status: "진행중",
  },
  {
    id: 2,
    name: "공정 최적화",
    type: "공정 개선",
    start: "2024-02-15",
    end: "2024-06-30",
    status: "계획",
  },
];

export default function CarbonReductionActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [showDialog, setShowDialog] = useState(false);
  const [editActivity, setEditActivity] = useState<Activity | null>(null);
  const [form, setForm] = useState({
    name: "",
    type: "설비 개선",
    start: "",
    end: "",
    status: "계획",
  });

  const columns: Column<Activity>[] = [
    { key: "name", title: "활동명", searchable: true },
    {
      key: "type",
      title: "유형",
      filterable: true,
      filterOptions: [
        { label: "설비 개선", value: "설비 개선" },
        { label: "공정 개선", value: "공정 개선" },
        { label: "기타", value: "기타" },
      ],
    },
    { key: "start", title: "시작일" },
    { key: "end", title: "종료일" },
    {
      key: "status",
      title: "상태",
      filterable: true,
      filterOptions: [
        { label: "계획", value: "계획" },
        { label: "진행중", value: "진행중" },
        { label: "완료", value: "완료" },
      ],
    },
  ];

  const actions = [
    {
      key: "edit",
      label: "수정",
      icon: (props: any) => <span {...props}>✏️</span>,
      onClick: (act: Activity) => {
        setEditActivity(act);
        setForm({
          name: act.name,
          type: act.type,
          start: act.start,
          end: act.end,
          status: act.status,
        });
        setShowDialog(true);
      },
    },
    {
      key: "delete",
      label: "삭제",
      icon: (props: any) => <span {...props}>🗑️</span>,
      variant: "destructive" as const,
      onClick: (act: Activity) =>
        setActivities(activities.filter((a) => a.id !== act.id)),
    },
  ];

  const handleAdd = () => {
    setEditActivity(null);
    setForm({
      name: "",
      type: "설비 개선",
      start: "",
      end: "",
      status: "계획",
    });
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editActivity) {
      setActivities(
        activities.map((a) =>
          a.id === editActivity.id ? { ...editActivity, ...form } : a
        )
      );
    } else {
      setActivities([{ ...form, id: Date.now() }, ...activities]);
    }
    setShowDialog(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>감축 활동 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={activities}
          columns={columns}
          actions={actions}
          title="감축 활동 목록"
          addButtonText="감축 활동 추가"
          onAdd={handleAdd}
          searchPlaceholder="활동명, 유형 검색"
          emptyMessage="감축 활동 데이터가 없습니다."
        />
      </CardContent>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editActivity ? "감축 활동 수정" : "감축 활동 등록"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1">활동명</label>
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
                <option value="설비 개선">설비 개선</option>
                <option value="공정 개선">공정 개선</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block mb-1">시작일</label>
                <Input
                  type="date"
                  value={form.start}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, start: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1">종료일</label>
                <Input
                  type="date"
                  value={form.end}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, end: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">상태</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
              >
                <option value="계획">계획</option>
                <option value="진행중">진행중</option>
                <option value="완료">완료</option>
              </select>
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
