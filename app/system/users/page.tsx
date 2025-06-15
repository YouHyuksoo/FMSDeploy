import { ProtectedRoute } from "@/components/auth/protected-route"
import { MainLayout } from "@/components/layout/main-layout"
import { UserManagement } from "@/components/user/user-management"

export default function UsersPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <UserManagement />
      </MainLayout>
    </ProtectedRoute>
  )
}
