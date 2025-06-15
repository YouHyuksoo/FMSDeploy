import { MainLayout } from "@/components/layout/main-layout"

export default function EnergyLayout({
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
