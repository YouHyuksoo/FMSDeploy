import { MainLayout } from "@/components/layout/main-layout"

export default function SensorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}
