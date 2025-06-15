"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { QrScannerModal } from "@/components/mobile-qr/qr-scanner-modal"
import { MobileFailureCaptureForm } from "@/components/mobile-qr/mobile-failure-capture-form"
import type { Equipment } from "@/types/equipment"
import { mockEquipment } from "@/lib/mock-data/equipment" // For lookup
import { mockFailures } from "@/lib/mock-data/failure" // For saving (direct modification for mock)
import { useToast } from "@/hooks/use-toast"
import { ScanLine, CheckCircle } from "lucide-react"
import type { Failure } from "@/types/failure"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MobileQrFailureRegisterPage() {
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [scannedEquipment, setScannedEquipment] = useState<Equipment | null>(null)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const { toast } = useToast()

  // Automatically open scanner on page load if no equipment is scanned yet
  useEffect(() => {
    if (!scannedEquipment && !registrationComplete) {
      setIsScannerOpen(true)
    }
  }, [scannedEquipment, registrationComplete])

  const handleScanSuccess = (decodedText: string) => {
    // Assuming QR code contains equipment ID
    const equipmentId = decodedText.trim()
    const foundEquipment = mockEquipment.find((eq) => eq.id === equipmentId || eq.code === equipmentId)

    if (foundEquipment) {
      setScannedEquipment(foundEquipment)
      setIsScannerOpen(false)
      setRegistrationComplete(false) // Reset completion state for new scan
      toast({
        title: "스캔 성공",
        description: `설비: ${foundEquipment.name} (${foundEquipment.code})`,
      })
    } else {
      toast({
        title: "스캔 오류",
        description: "등록된 설비 정보를 찾을 수 없습니다.",
        variant: "destructive",
      })
      // Keep scanner open or allow user to retry
      setScannedEquipment(null) // Clear any previous scan
      setIsScannerOpen(true) // Re-open scanner
    }
  }

  const handleFailureSubmit = (failureData: Failure) => {
    // In a real app, this would be an API call.
    // For mock, directly add to the mockFailures array.
    mockFailures.unshift(failureData) // Add to the beginning of the array
    console.log("New failure registered:", failureData)
    toast({
      title: "고장 등록 완료",
      description: `${failureData.title} (${failureData.equipmentName}) 고장이 성공적으로 등록되었습니다.`,
      className: "bg-green-100 dark:bg-green-800 border-green-500",
    })
    setRegistrationComplete(true)
    setScannedEquipment(null) // Reset for next scan
  }

  const handleCancelOrRescan = () => {
    setScannedEquipment(null)
    setRegistrationComplete(false)
    setIsScannerOpen(true)
  }

  if (registrationComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <CardTitle className="mt-4 text-2xl">등록 완료!</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>고장 정보가 성공적으로 시스템에 등록되었습니다.</CardDescription>
            <Button onClick={handleCancelOrRescan} className="mt-8 w-full">
              <ScanLine className="mr-2 h-4 w-4" /> 다른 설비 고장 등록하기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 py-8 min-h-screen flex flex-col items-center">
      {!scannedEquipment ? (
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">모바일 QR 고장등록</CardTitle>
            <CardDescription>설비의 QR 코드를 스캔하여 고장을 등록하세요.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <ScanLine size={64} className="text-primary" />
            <Button onClick={() => setIsScannerOpen(true)} className="w-full py-3 text-lg">
              <ScanLine className="mr-2 h-5 w-5" /> QR 코드 스캔 시작
            </Button>
            <p className="text-xs text-muted-foreground text-center">카메라 접근 권한이 필요합니다.</p>
          </CardContent>
        </Card>
      ) : (
        <MobileFailureCaptureForm
          equipment={scannedEquipment}
          onSubmit={handleFailureSubmit}
          onCancel={handleCancelOrRescan}
        />
      )}

      <QrScannerModal
        open={isScannerOpen}
        onOpenChange={setIsScannerOpen}
        onScanSuccess={handleScanSuccess}
        onScanError={(errorMessage) => {
          // console.warn("QR Scan Error (Modal):", errorMessage)
          // Optionally show a toast for persistent errors, but avoid for "not found"
        }}
      />
    </div>
  )
}
