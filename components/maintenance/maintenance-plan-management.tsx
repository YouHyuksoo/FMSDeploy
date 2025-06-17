"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DataTable,
  type Column,
  type DataTableAction,
} from "@/components/common/data-table";
import { ImportExportDialog } from "@/components/common/import-export-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import type {
  MaintenancePlan,
  MaintenanceRequest,
  MaintenanceWork,
} from "@/types/maintenance";
import { mockMaintenancePlans } from "@/lib/mock-data/maintenance";
import type { ExportColumn } from "@/lib/utils/export-utils";
import {
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  Clock,
  CheckCircle,
  Settings,
  Users,
  PlusCircle,
} from "lucide-react";
import { MaintenancePlanForm } from "./maintenance-plan-form";
import { getTodayIsoDate } from "@/lib/utils";
import { useTranslation } from "@/lib/language-context";

export function MaintenancePlanManagement() {
  const { t } = useTranslation("maintenance");
  const [plans, setPlans] = useState<MaintenancePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<
    MaintenancePlan | undefined
  >();
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<MaintenancePlan[]>([]);
  const { toast } = useToast();

  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<
    Partial<MaintenancePlan> | undefined
  >(undefined);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [sourceRequest, setSourceRequest] = useState<
    MaintenanceRequest | undefined
  >(undefined);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPlans(mockMaintenancePlans);
    } catch (error) {
      toast({
        title: "오류",
        description: "작업 계획 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleNewPlan = (request?: MaintenanceRequest) => {
    setFormMode("create");
    if (request) {
      setCurrentPlan({
        title: `[요청기반] ${request.equipmentName} 작업`,
        equipmentId: request.equipmentId,
        equipmentName: request.equipmentName,
        description: request.description,
        priority: request.priority,
        workType: request.workType || "general",
        requesterName: request.requesterName,
        requestDate: request.requestDate,
        status: "planned",
        scheduledStartDate: getTodayIsoDate(),
      });
      setSourceRequest(request);
    } else {
      setCurrentPlan({
        priority: "normal",
        status: "planned",
        scheduledStartDate: getTodayIsoDate(),
        workType: "general",
      });
      setSourceRequest(undefined);
    }
    setIsPlanFormOpen(true);
  };

  const handleView = (plan: MaintenancePlan) => {
    setFormMode("view");
    setCurrentPlan(plan);
    setIsPlanFormOpen(true);
  };

  const handleEdit = (plan: MaintenancePlan) => {
    setFormMode("edit");
    setCurrentPlan(plan);
    setIsPlanFormOpen(true);
  };

  const handleDelete = (plan: MaintenancePlan) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const handleAssign = (plan: MaintenancePlan) => {
    const assignedTo = "user6"; // Mock assigned user
    const assignedToName = "강정비"; // Mock assigned user name
    const assignedTeam = "maintenance-team-1"; // Mock assigned team
    const assignedTeamName = "정비1팀"; // Mock assigned team name
    const assignDate = new Date().toISOString();

    setPlans((prev) =>
      prev.map((p) =>
        p.id === plan.id
          ? {
              ...p,
              status: "assigned",
              assignedTo,
              assignedToName,
              assignedTeam,
              assignedTeamName,
              assignDate,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    toast({
      title: "작업 배정됨",
      description: `"${plan.title}" 작업이 배정되었습니다. 작업 완료 처리 목록에서 해당 작업을 확인할 수 있습니다.`,
    });

    // Simulate creation of MaintenanceWork record
    const newWorkOrder: Partial<MaintenanceWork> = {
      planId: plan.id,
      workNo: `W${Date.now().toString().slice(-6)}`,
      title: plan.title,
      description: plan.description,
      equipmentId: plan.equipmentId,
      equipmentName: plan.equipmentName,
      workType: plan.workType,
      priority: plan.priority,
      status: "pending", // IMPORTANT: Initial status for MaintenanceWork
      assignedTo,
      assignedToName,
      assignedTeam,
      assignedTeamName,
      assignDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log("Simulated New Work Order:", newWorkOrder);
    // In a real app, you would now save this newWorkOrder to your backend
    // and the MaintenanceCompleteManagement component would fetch it.
  };

  const handleCancelAssignment = (plan: MaintenancePlan) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === plan.id
          ? {
              ...p,
              status: "planned", // Revert to planned
              assignedTo: undefined,
              assignedToName: undefined,
              assignedTeam: undefined,
              assignedTeamName: undefined,
              assignDate: undefined,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    toast({
      title: "배정 취소됨",
      description: `"${plan.title}" 작업 배정이 취소되었습니다. 작업 완료 처리 목록에서도 해당 작업이 제거됩니다 (실제 시스템).`,
      variant: "default",
    });
    // In a real app, you would also find the corresponding MaintenanceWork
    // and either delete it or set its status to "cancelled".
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPlans((prev) => prev.filter((plan) => plan.id !== planToDelete.id));
      toast({
        title: "삭제 완료",
        description: "작업 계획이 삭제되었습니다.",
      });
    } catch (error) {
      toast({
        title: "오류",
        description: "작업 계획 삭제에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPlanToDelete(undefined);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planned":
        return <Calendar className="h-4 w-4" />;
      case "assigned":
        return <UserCheck className="h-4 w-4" />;
      case "in_progress":
        return <Settings className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      planned: "계획됨",
      assigned: "배정됨",
      in_progress: "진행중",
      completed: "완료됨",
      cancelled: "취소됨",
      on_hold: "보류중",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "assigned":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "in_progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      critical: "긴급",
      high: "높음",
      normal: "보통",
      low: "낮음",
    };
    return labels[priority] || priority;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "normal":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getWorkTypeLabel = (type?: string) => {
    if (!type) return "일반";
    const labels: Record<string, string> = {
      repair: "수리",
      replace: "교체",
      inspect: "점검",
      calibrate: "교정",
      upgrade: "개선",
      general: "일반",
    };
    return labels[type] || type;
  };

  const columns: Column<MaintenancePlan>[] = [
    {
      key: "planNo",
      title: t("planNo"),
      width: "w-32",
      sortable: true,
      searchable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "title",
      title: t("workTitle"),
      sortable: true,
      searchable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">
            {record.equipmentName}
          </div>
        </div>
      ),
    },
    {
      key: "workType",
      title: t("workType"),
      width: "w-24",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: t("repair"), value: "repair" },
        { label: t("replace"), value: "replace" },
        { label: t("inspect"), value: "inspect" },
        { label: t("calibrate"), value: "calibrate" },
        { label: t("upgrade"), value: "upgrade" },
        { label: t("general"), value: "general" },
      ],
      render: (value) => <Badge variant="outline">{t(value)}</Badge>,
    },
    {
      key: "status",
      title: t("status"),
      width: "w-24",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: t("pending"), value: "pending" },
        { label: t("in_progress"), value: "in_progress" },
        { label: t("completed"), value: "completed" },
        { label: t("on_hold"), value: "on_hold" },
        { label: t("cancelled"), value: "cancelled" },
      ],
      render: (value) => (
        <Badge variant="secondary" className={getStatusColor(value)}>
          <div className="flex items-center gap-1">
            {getStatusIcon(value)}
            {t(value)}
          </div>
        </Badge>
      ),
    },
    {
      key: "priority",
      title: "우선순위",
      width: "w-20",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: "긴급", value: "critical" },
        { label: "높음", value: "high" },
        { label: "보통", value: "normal" },
        { label: "낮음", value: "low" },
      ],
      render: (value) => (
        <Badge variant="secondary" className={getPriorityColor(value)}>
          {getPriorityLabel(value)}
        </Badge>
      ),
    },
    {
      key: "assignedToName",
      title: "담당자",
      searchable: true,
      render: (value, record) => (
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{value}</div>
                <div className="text-sm text-muted-foreground">
                  {record.assignedTeamName}
                </div>
              </div>
            </>
          ) : (
            <span className="text-muted-foreground">미배정</span>
          )}
        </div>
      ),
    },
    {
      key: "scheduledStartDate",
      title: "예정 시작일",
      width: "w-32",
      sortable: true,
      render: (value: string | Date | number | null | undefined) => {
        if (
          value === null ||
          value === undefined ||
          (typeof value === "string" && value.trim() === "")
        ) {
          return <span className="text-muted-foreground">날짜 없음</span>;
        }
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return (
            <span className="text-muted-foreground">유효하지 않은 날짜</span>
          );
        }
        let valueAsString: string;
        if (typeof value === "string") {
          valueAsString = value;
        } else if (value instanceof Date) {
          valueAsString = value.toISOString();
        } else if (typeof value === "number") {
          valueAsString = new Date(value).toISOString();
        } else {
          valueAsString = date.toISOString();
        }
        const isActuallyOverdue =
          date < new Date() &&
          valueAsString.split("T")[0] !==
            new Date().toISOString().split("T")[0];
        return (
          <span className={isActuallyOverdue ? "text-red-600 font-medium" : ""}>
            {date.toLocaleDateString("ko-KR")}
          </span>
        );
      },
    },
    {
      key: "estimatedCost",
      title: "예상비용",
      width: "w-24",
      sortable: true,
      align: "right",
      render: (value) => `${Number(value).toLocaleString()}원`,
    },
    {
      key: "estimatedDuration",
      title: "예상시간",
      width: "w-20",
      sortable: true,
      align: "center",
      render: (value) => `${value}시간`,
    },
  ];

  const actions: DataTableAction<MaintenancePlan>[] = [
    { key: "view", label: "상세보기", icon: Eye, onClick: handleView },
    {
      key: "edit",
      label: "수정",
      icon: Edit,
      onClick: handleEdit,
      hidden: (record) =>
        ["completed", "cancelled", "assigned"].includes(record.status), // Cannot edit if assigned
    },
    {
      key: "assign",
      label: "작업 배정",
      icon: UserCheck,
      onClick: handleAssign,
      hidden: (record) => record.status !== "planned",
    },
    {
      key: "cancel_assignment",
      label: "배정 취소",
      icon: UserX,
      onClick: handleCancelAssignment,
      variant: "default",
      hidden: (record) => record.status !== "assigned",
    },
    {
      key: "delete",
      label: "삭제",
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      hidden: (record) => !["planned"].includes(record.status), // Only allow delete if it's just planned, not assigned or further
    },
  ];

  const exportColumns: ExportColumn[] = [
    { key: "planNo", title: "계획번호", width: 15 },
    { key: "title", title: "작업 제목", width: 30 },
    { key: "equipmentName", title: "설비명", width: 20 },
    {
      key: "workType",
      title: "작업 유형",
      width: 15,
      format: (value) => getWorkTypeLabel(value as string),
    },
    {
      key: "status",
      title: "상태",
      width: 15,
      format: (value) => getStatusLabel(value as string),
    },
    {
      key: "priority",
      title: "우선순위",
      width: 10,
      format: (value) => getPriorityLabel(value as string),
    },
    { key: "assignedToName", title: "담당자", width: 15 },
    { key: "assignedTeamName", title: "담당팀", width: 15 },
    {
      key: "scheduledStartDate",
      title: "예정 시작일",
      width: 15,
      format: (value) =>
        value ? new Date(value as string).toLocaleDateString("ko-KR") : "",
    },
    {
      key: "scheduledEndDate",
      title: "예정 완료일",
      width: 15,
      format: (value) =>
        value ? new Date(value as string).toLocaleDateString("ko-KR") : "",
    },
    {
      key: "estimatedCost",
      title: "예상비용",
      width: 15,
      format: (value) => `${Number(value).toLocaleString()}원`,
    },
    { key: "description", title: "설명", width: 40 },
  ];

  const handlePlanFormSubmit = async (planData: Partial<MaintenancePlan>) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (formMode === "create") {
        const newPlan: MaintenancePlan = {
          id: `MPLAN-${Date.now()}`,
          planNo: `P${Date.now().toString().slice(-6)}`,
          title: planData.title || "제목 없음",
          equipmentId: planData.equipmentId || "EQ-UNKNOWN",
          equipmentName: planData.equipmentName || "설비명 없음",
          workType: planData.workType || "general",
          status: "planned",
          priority: planData.priority || "normal",
          description: planData.description || "",
          scheduledStartDate: planData.scheduledStartDate || getTodayIsoDate(),
          estimatedDuration: planData.estimatedDuration || 0,
          estimatedCost: planData.estimatedCost || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          materials: planData.materials || [],
          procedures: planData.procedures || [],
          ...planData, // This will override any default if planData has it.
        };
        setPlans((prev) => [newPlan, ...prev]);
        toast({ title: "성공", description: "새 작업 계획이 등록되었습니다." });

        if (sourceRequest) {
          toast({
            title: "정보",
            description: `작업 요청 ${sourceRequest.requestNo}의 상태를 '계획됨'으로 업데이트해야 합니다. (실제 시스템 구현 필요)`,
            variant: "default",
          });
        }
      } else if (formMode === "edit" && currentPlan && currentPlan.id) {
        const updatedPlan = {
          ...currentPlan,
          ...planData,
          updatedAt: new Date().toISOString(),
        } as MaintenancePlan;
        setPlans((prev) =>
          prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
        );
        toast({ title: "성공", description: "작업 계획이 수정되었습니다." });
      }
      setIsPlanFormOpen(false);
      setCurrentPlan(undefined);
      setSourceRequest(undefined);
    } catch (error) {
      toast({
        title: "오류",
        description: "작업 계획 처리에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">작업계획 배정</h2>
          <p className="text-muted-foreground">
            승인된 요청을 기반으로 작업 계획을 수립하고 배정하거나 직접
            생성합니다.
          </p>
        </div>
        <Button onClick={() => handleNewPlan()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          신규 계획
        </Button>
      </div>

      <DataTable
        data={plans}
        columns={columns}
        actions={actions}
        loading={loading}
        searchPlaceholder="계획번호, 제목, 설비명으로 검색..."
        selectable={true}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        showFilter={true}
        showExport={true}
        onExport={() => setImportExportOpen(true)}
        stickyHeader={true}
        maxHeight="calc(100vh - 300px)"
      />

      <ImportExportDialog
        open={importExportOpen}
        onOpenChange={setImportExportOpen}
        title="작업계획 배정"
        exportColumns={exportColumns}
        importColumns={[]}
        exportData={selectedRows.length > 0 ? selectedRows : plans}
        onImportComplete={async () => {}}
        exportOptions={{ filename: "maintenance-plans" }}
        sampleData={[]}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>작업 계획 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              "{planToDelete?.title}" 계획을 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없습니다.
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

      <Dialog open={isPlanFormOpen} onOpenChange={setIsPlanFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create" && "신규 작업 계획"}
              {formMode === "edit" && "작업 계획 수정"}
              {formMode === "view" && "작업 계획 상세"}
            </DialogTitle>
            <DialogDescription>
              {formMode === "create" && "새로운 보전 작업 계획을 등록합니다."}
              {formMode === "edit" &&
                "기존 작업 계획의 세부 정보를 수정합니다."}
              {formMode === "view" && "작업 계획의 상세 정보를 확인합니다."}
            </DialogDescription>
          </DialogHeader>
          {currentPlan && (
            <MaintenancePlanForm
              initialData={currentPlan}
              onSubmit={handlePlanFormSubmit}
              onCancel={() => {
                setIsPlanFormOpen(false);
                setCurrentPlan(undefined);
                setSourceRequest(undefined);
              }}
              mode={formMode}
              open={isPlanFormOpen}
              onOpenChange={(open) => {
                setIsPlanFormOpen(open);
                if (!open) {
                  setCurrentPlan(undefined);
                  setSourceRequest(undefined);
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
