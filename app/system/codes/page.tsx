import { ProtectedRoute } from "@/components/auth/protected-route"
import { MainLayout } from "@/components/layout/main-layout"
import { CodeManagement } from "@/components/code/code-management"

export default function CodesPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <CodeManagement />
      </MainLayout>
    </ProtectedRoute>
  )
}
