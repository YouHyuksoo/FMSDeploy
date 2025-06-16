"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/common/data-table";

interface Upload {
  id: number;
  filename: string;
  date: string;
  status: string;
}

const MOCK_UPLOADS: Upload[] = [
  {
    id: 1,
    filename: "emission_202406.csv",
    date: "2024-06-10",
    status: "성공",
  },
  { id: 2, filename: "scope3_202405.xlsx", date: "2024-05-28", status: "실패" },
];

export default function CarbonDataImportPage() {
  const [uploads, setUploads] = useState<Upload[]>(MOCK_UPLOADS);
  const [uploading, setUploading] = useState(false);

  const columns: Column<Upload>[] = [
    { key: "filename", title: "파일명", searchable: true },
    { key: "date", title: "업로드일" },
    {
      key: "status",
      title: "상태",
      filterable: true,
      filterOptions: [
        { label: "성공", value: "성공" },
        { label: "실패", value: "실패" },
      ],
    },
  ];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setTimeout(() => {
      setUploads([
        {
          id: Date.now(),
          filename: e.target.files![0].name,
          date: new Date().toISOString().slice(0, 10),
          status: "성공",
        },
        ...uploads,
      ]);
      setUploading(false);
    }, 1200);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>데이터 업로드/연동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Button asChild variant="outline" size="sm">
            <a href="/sample.csv" download>
              샘플 파일 다운로드
            </a>
          </Button>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <Button asChild variant="default" size="sm" disabled={uploading}>
              <span>엑셀/CSV 업로드</span>
            </Button>
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
          {uploading && (
            <span className="text-blue-600 text-sm ml-2">업로드 중...</span>
          )}
        </div>
        <DataTable
          data={uploads}
          columns={columns}
          title="업로드 이력"
          searchPlaceholder="파일명 검색"
          emptyMessage="업로드 이력이 없습니다."
        />
        <div className="text-gray-500 text-sm mt-4">
          외부 시스템 연동(API, 센서 등)은 관리자에게 문의해 주세요.
        </div>
      </CardContent>
    </Card>
  );
}
