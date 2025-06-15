"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Search, Plus, FileDown, FileUp, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import MaterialForm from "./material-form"

// 자재 타입 정의
interface Material {
  id: string
  code: string
  name: string
  specification: string
  unit: string
  category: string
  manufacturer: string
  price: number
  stockQuantity: number
  safetyStock: number
  location: string
  status: "active" | "inactive" | "discontinued"
}

// 목업 데이터
export const mockMaterials: Material[] = [
  {
    id: "1",
    code: "MAT-001",
    name: "베어링",
    specification: "6205-2RS",
    unit: "EA",
    category: "소모품",
    manufacturer: "SKF",
    price: 15000,
    stockQuantity: 25,
    safetyStock: 10,
    location: "A-01-01",
    status: "active",
  },
  {
    id: "2",
    code: "MAT-002",
    name: "모터",
    specification: "3HP, 220V",
    unit: "EA",
    category: "교체품",
    manufacturer: "Siemens",
    price: 450000,
    stockQuantity: 3,
    safetyStock: 2,
    location: "B-02-03",
    status: "active",
  },
  {
    id: "3",
    code: "MAT-003",
    name: "오일",
    specification: "ISO VG 68",
    unit: "L",
    category: "소모품",
    manufacturer: "Shell",
    price: 8000,
    stockQuantity: 50,
    safetyStock: 20,
    location: "C-01-02",
    status: "active",
  },
  {
    id: "4",
    code: "MAT-004",
    name: "벨트",
    specification: "A-45",
    unit: "EA",
    category: "소모품",
    manufacturer: "Gates",
    price: 12000,
    stockQuantity: 15,
    safetyStock: 8,
    location: "A-03-01",
    status: "active",
  },
  {
    id: "5",
    code: "MAT-005",
    name: "센서",
    specification: "근접센서, PNP",
    unit: "EA",
    category: "교체품",
    manufacturer: "Omron",
    price: 85000,
    stockQuantity: 7,
    safetyStock: 5,
    location: "B-01-04",
    status: "active",
  },
]

export function MaterialManagement() {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const [isFormOpen, setIsFormOpen] = useState(false)

  // 검색 필터링
  const filteredMaterials = materials.filter(
    (material) =>
      material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 자재 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">정상</Badge>
      case "inactive":
        return <Badge variant="outline">비활성</Badge>
      case "discontinued":
        return <Badge variant="destructive">단종</Badge>
      default:
        return <Badge variant="secondary">기타</Badge>
    }
  }

  // 재고 상태에 따른 배지
  const getStockStatusBadge = (current: number, safety: number) => {
    if (current <= 0) {
      return <Badge variant="destructive">재고없음</Badge>
    } else if (current < safety) {
      return (
        <Badge variant="warning" className="bg-yellow-500">
          부족
        </Badge>
      )
    } else if (current >= safety * 3) {
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-500">
          과다
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="border-green-500 text-green-500">
          정상
        </Badge>
      )
    }
  }

  // 엑셀 내보내기 핸들러
  const handleExport = () => {
    toast({
      title: "엑셀 내보내기",
      description: "자재 목록이 엑셀 파일로 내보내기 되었습니다.",
    })
  }

  // 엑셀 가져오기 핸들러
  const handleImport = () => {
    toast({
      title: "엑셀 가져오기",
      description: "자재 목록을 엑셀 파일에서 가져왔습니다.",
    })
  }

  const handleMaterialSubmit = (data: any) => {
    // 새 자재를 목록에 추가
    const newMaterial = {
      id: (materials.length + 1).toString(),
      ...data,
      stockQuantity: 0, // 초기 재고는 0
    }
    setMaterials((prev) => [...prev, newMaterial])
    setIsFormOpen(false)
    toast({
      title: "자재 등록 완료",
      description: `${data.name}이(가) 성공적으로 등록되었습니다.`,
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">자재등록관리</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            엑셀 내보내기
          </Button>
          <Button variant="outline" onClick={handleImport}>
            <FileUp className="mr-2 h-4 w-4" />
            엑셀 가져오기
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                자재 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>자재 등록</DialogTitle>
              </DialogHeader>
              <MaterialForm onSubmit={handleMaterialSubmit} onCancel={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 자재 수</CardTitle>
            <CardDescription>등록된 전체 자재</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{materials.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">재고 부족 자재</CardTitle>
            <CardDescription>안전재고 미달 자재</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-2xl font-bold">
                {materials.filter((m) => m.stockQuantity < m.safetyStock).length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">재고 없음</CardTitle>
            <CardDescription>재고가 0인 자재</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-2xl font-bold">{materials.filter((m) => m.stockQuantity <= 0).length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="consumable">소모품</TabsTrigger>
          <TabsTrigger value="replacement">교체품</TabsTrigger>
          <TabsTrigger value="spare">예비품</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="자재코드, 자재명, 제조사 검색..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>자재코드</TableHead>
              <TableHead>자재명</TableHead>
              <TableHead>규격</TableHead>
              <TableHead>단위</TableHead>
              <TableHead>분류</TableHead>
              <TableHead>제조사</TableHead>
              <TableHead>단가</TableHead>
              <TableHead>재고수량</TableHead>
              <TableHead>재고상태</TableHead>
              <TableHead>위치</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">{material.code}</TableCell>
                <TableCell>{material.name}</TableCell>
                <TableCell>{material.specification}</TableCell>
                <TableCell>{material.unit}</TableCell>
                <TableCell>{material.category}</TableCell>
                <TableCell>{material.manufacturer}</TableCell>
                <TableCell>{material.price.toLocaleString()}원</TableCell>
                <TableCell>{material.stockQuantity}</TableCell>
                <TableCell>{getStockStatusBadge(material.stockQuantity, material.safetyStock)}</TableCell>
                <TableCell>{material.location}</TableCell>
                <TableCell>{getStatusBadge(material.status)}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px]">
                      <DialogHeader>
                        <DialogTitle>자재 QR 코드</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center justify-center p-4">
                        <div className="bg-gray-200 w-48 h-48 flex items-center justify-center mb-4">
                          QR 코드 이미지
                        </div>
                        <p className="text-center font-medium">{material.code}</p>
                        <p className="text-center text-sm text-muted-foreground">{material.name}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
