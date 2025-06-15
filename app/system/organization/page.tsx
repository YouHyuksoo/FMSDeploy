import { ProtectedRoute } from "@/components/auth/protected-route"
import { MainLayout } from "@/components/layout/main-layout"
import { OrganizationManagement } from "@/components/organization/organization-management"

export default function OrganizationPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <OrganizationManagement />
      </MainLayout>
    </ProtectedRoute>
  )
}
