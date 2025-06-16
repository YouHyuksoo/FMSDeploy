"use client";

import { useState, useEffect } from "react";
import {
  DataTable,
  type Column,
  type DataTableAction,
} from "@/components/common/data-table";
import { UserForm } from "./user-form";
import { ImportExportDialog } from "@/components/common/import-export-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { User, UserFormData } from "@/types/user";
import { mockUsers } from "@/lib/mock-data/users";
import { mockOrganizations } from "@/lib/mock-data/organizations";
import type { ExportColumn } from "@/lib/utils/export-utils";
import type { ImportColumn } from "@/lib/utils/import-utils";
import {
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Key,
  Mail,
  Shield,
  ShieldCheck,
  Crown,
  Users,
} from "lucide-react";
import { useTranslation } from "@/lib/language-context";

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | undefined>();
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation("common");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUsers(mockUsers);
    } catch (error) {
      toast({
        title: "오류",
        description: "사용자 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedUser(undefined);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setFormMode("view");
    setFormOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleToggleActive = async (user: User) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                isActive: !u.isActive,
                updatedAt: new Date().toISOString(),
                updatedBy: "current-user",
              }
            : u
        )
      );

      toast({
        title: "성공",
        description: `사용자가 ${
          user.isActive ? "비활성화" : "활성화"
        }되었습니다.`,
      });
    } catch (error) {
      toast({
        title: "오류",
        description: "사용자 상태 변경에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (user: User) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: "성공",
        description: `${user.name}님의 비밀번호가 초기화되었습니다.`,
      });
    } catch (error) {
      toast({
        title: "오류",
        description: "비밀번호 초기화에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async (user: User) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: "성공",
        description: `${user.email}로 이메일이 발송되었습니다.`,
      });
    } catch (error) {
      toast({
        title: "오류",
        description: "이메일 발송에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      toast({
        title: "성공",
        description: "사용자가 삭제되었습니다.",
      });
    } catch (error) {
      toast({
        title: "오류",
        description: "사용자 삭제에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(undefined);
    }
  };

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      if (formMode === "create") {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newUser: User = {
          id: Date.now().toString(),
          ...data,
          company:
            mockOrganizations.find((org) => org.id === data.companyId)?.name ||
            "",
          department:
            mockOrganizations.find((org) => org.id === data.departmentId)
              ?.name || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "current-user",
          updatedBy: "current-user",
        };

        setUsers((prev) => [...prev, newUser]);
        toast({
          title: "성공",
          description: "사용자가 추가되었습니다.",
        });
      } else if (formMode === "edit") {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setUsers((prev) =>
          prev.map((user) =>
            user.id === selectedUser?.id
              ? {
                  ...user,
                  ...data,
                  company:
                    mockOrganizations.find((org) => org.id === data.companyId)
                      ?.name || "",
                  department:
                    mockOrganizations.find(
                      (org) => org.id === data.departmentId
                    )?.name || "",
                  updatedAt: new Date().toISOString(),
                  updatedBy: "current-user",
                }
              : user
          )
        );

        toast({
          title: "성공",
          description: "사용자 정보가 수정되었습니다.",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: `사용자 ${
          formMode === "create" ? "추가" : "수정"
        }에 실패했습니다.`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleImportComplete = async (importedData: User[]) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 실제로는 서버에서 ID 생성 및 추가 정보 설정
      const processedUsers = importedData.map((userData, index) => ({
        ...userData,
        id: (Date.now() + index).toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "current-user",
        updatedBy: "current-user",
      }));

      setUsers((prev) => [...prev, ...processedUsers]);
      toast({
        title: "성공",
        description: `${importedData.length}명의 사용자가 가져오기 되었습니다.`,
      });
    } catch (error) {
      toast({
        title: "오류",
        description: "사용자 데이터 가져오기에 실패했습니다.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "admin":
        return <Crown className="h-4 w-4" />;
      case "manager":
        return <ShieldCheck className="h-4 w-4" />;
      case "user":
        return <Shield className="h-4 w-4" />;
      case "viewer":
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "admin":
        return t("user.level.admin");
      case "manager":
        return t("user.level.manager");
      case "user":
        return t("user.level.user");
      case "viewer":
        return t("user.level.viewer");
      default:
        return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "user":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "viewer":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const columns: Column<User>[] = [
    {
      key: "name",
      title: "사용자",
      sortable: true,
      searchable: true,
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{record.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">
              {record.username}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      title: "이메일",
      searchable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "level",
      title: "레벨",
      width: "w-24",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: "관리자", value: "admin" },
        { label: "매니저", value: "manager" },
        { label: "사용자", value: "user" },
        { label: "조회자", value: "viewer" },
      ],
      render: (value) => (
        <Badge variant="secondary" className={getLevelColor(value)}>
          <div className="flex items-center gap-1">
            {getLevelIcon(value)}
            {getLevelLabel(value)}
          </div>
        </Badge>
      ),
    },
    {
      key: "department",
      title: "부서",
      searchable: true,
      filterable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{record.position}</div>
        </div>
      ),
    },
    {
      key: "company",
      title: "회사",
      searchable: true,
      filterable: true,
    },
    {
      key: "isActive",
      title: "상태",
      width: "w-20",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: "활성", value: true },
        { label: "비활성", value: false },
      ],
      render: (value) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? (
            <div className="flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              활성
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <UserX className="h-3 w-3" />
              비활성
            </div>
          )}
        </Badge>
      ),
    },
    {
      key: "lastLoginAt",
      title: "최근 로그인",
      width: "w-40",
      sortable: true,
      render: (value) =>
        value ? new Date(value).toLocaleString("ko-KR") : "로그인 기록 없음",
    },
  ];

  const actions: DataTableAction<User>[] = [
    {
      key: "view",
      label: t("common.view"),
      icon: Eye,
      onClick: handleView,
    },
    {
      key: "edit",
      label: t("common.edit"),
      icon: Edit,
      onClick: handleEdit,
    },
    {
      key: "toggle-active",
      label: t("user.is_active"),
      icon: UserX,
      onClick: handleToggleActive,
    },
    {
      key: "reset-password",
      label: t("user.password"),
      icon: Key,
      onClick: handleResetPassword,
    },
    {
      key: "send-email",
      label: t("user.email"),
      icon: Mail,
      onClick: handleSendEmail,
    },
    {
      key: "delete",
      label: t("common.delete"),
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      disabled: (user: User) => user.level === "admin", // 관리자는 삭제 불가
    },
  ];

  // Export/Import 설정
  const exportColumns: ExportColumn[] = [
    { key: "username", title: "사용자ID", width: 15 },
    { key: "name", title: "이름", width: 15 },
    { key: "email", title: "이메일", width: 25 },
    { key: "phone", title: "전화번호", width: 15 },
    {
      key: "level",
      title: "레벨",
      width: 10,
      format: (value) => getLevelLabel(value),
    },
    { key: "company", title: "회사", width: 20 },
    { key: "department", title: "부서", width: 20 },
    { key: "position", title: "직책", width: 15 },
    {
      key: "isActive",
      title: "활성상태",
      width: 10,
      format: (value) => (value ? "Y" : "N"),
    },
    {
      key: "permissions",
      title: "권한",
      width: 30,
      format: (value) => (Array.isArray(value) ? value.join(", ") : ""),
    },
    {
      key: "lastLoginAt",
      title: "최근로그인",
      width: 20,
      format: (value) => (value ? new Date(value).toLocaleString("ko-KR") : ""),
    },
    {
      key: "createdAt",
      title: "생성일시",
      width: 20,
      format: (value) => new Date(value).toLocaleString("ko-KR"),
    },
  ];

  const importColumns: ImportColumn[] = [
    {
      key: "username",
      title: "사용자ID",
      required: true,
      type: "string",
      validate: (value: string) => {
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          return "사용자 ID는 영문, 숫자, _만 사용 가능합니다.";
        }
        if (value.length < 3) {
          return "사용자 ID는 3자 이상이어야 합니다.";
        }
        return null;
      },
    },
    { key: "name", title: "이름", required: true, type: "string" },
    { key: "email", title: "이메일", required: true, type: "email" },
    { key: "phone", title: "전화번호", type: "string" },
    {
      key: "level",
      title: "레벨",
      required: true,
      type: "string",
      validate: (value: string) =>
        !["admin", "manager", "user", "viewer"].includes(value)
          ? "레벨은 admin, manager, user, viewer 중 하나여야 합니다."
          : null,
    },
    { key: "company", title: "회사", required: true, type: "string" },
    { key: "department", title: "부서", required: true, type: "string" },
    { key: "position", title: "직책", required: true, type: "string" },
    { key: "isActive", title: "활성상태", type: "boolean" },
    {
      key: "permissions",
      title: "권한",
      type: "string",
      transform: (value: string) =>
        typeof value === "string" ? value.split(",").map((p) => p.trim()) : [],
    },
  ];

  const sampleData: Partial<User>[] = [
    {
      username: "sample_user",
      name: "샘플사용자",
      email: "sample@company.com",
      phone: "010-1234-5678",
      level: "user" as const,
      company: "ABC 제조",
      department: "생산1팀",
      position: "기사",
      isActive: true,
      permissions: ["equipment.read", "maintenance.write"],
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        data={users}
        columns={columns}
        actions={actions}
        onAdd={handleAdd}
        loading={loading}
        title="사용자 관리"
        subtitle="시스템 사용자의 계정과 권한을 관리합니다"
        searchPlaceholder="이름, 사용자ID, 이메일로 검색..."
        addButtonText="사용자 추가"
        selectable={true}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        showFilter={true}
        showExport={true}
        showImport={true}
        onExport={() => setImportExportOpen(true)}
        onImport={() => setImportExportOpen(true)}
        stickyHeader={true}
        maxHeight="calc(100vh - 250px)"
      />

      <UserForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedUser}
        mode={formMode}
      />

      <ImportExportDialog
        open={importExportOpen}
        onOpenChange={setImportExportOpen}
        title="사용자"
        exportColumns={exportColumns}
        importColumns={importColumns}
        exportData={selectedRows.length > 0 ? selectedRows : users}
        onImportComplete={handleImportComplete}
        exportOptions={{ filename: "users" }}
        sampleData={sampleData}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>사용자 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              "{userToDelete?.name}" 사용자를 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없으며, 모든 관련 데이터가 함께
              삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
