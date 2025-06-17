"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Settings,
  Package,
  ClipboardCheck,
  Wrench,
  Users,
  AlertTriangle,
  Calendar,
  Brain,
  BarChart3,
  Map,
  LinkIcon,
  Smartphone,
  ChevronDown,
  ChevronRight,
  FileText,
  Bolt,
  Gauge,
  TrendingDown,
  Leaf,
  Target,
  LineChart,
  FileBarChart2,
  ChartBarIcon,
  Menu,
} from "lucide-react";
import { useTranslation } from "@/lib/language-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import type { MainNavItem } from "@/types";

interface DashboardConfig {
  mainNav: MainNavItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

function toMenuKey(...args: string[]): string {
  return (
    "menu." +
    args
      .map((s) =>
        s
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "")
      )
      .filter(Boolean)
      .join(".")
  );
}

function addExplicitTitleKeys(items: any[], parentKey = "menu"): any[] {
  return items.map((item: any) => {
    let key = item.titleKey;
    if (!key && item.title) {
      key =
        (parentKey !== "menu" ? parentKey + "." : "") +
        item.title
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "");
    }
    const newItem = { ...item, titleKey: key };
    if (item.children) {
      newItem.children = addExplicitTitleKeys(item.children, key);
    }
    return newItem;
  });
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation("menu");

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => {
      const newItems = prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title];
      return newItems;
    });
  };

  // Load expanded items from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedExpandedItems = localStorage.getItem("sidebarExpandedItems");
    if (savedExpandedItems) {
      setExpandedItems(JSON.parse(savedExpandedItems));
    }

    // Automatically expand parent of active child on initial load
    const activeParent = menuItems.find((item) =>
      item.children?.some(
        (child: any) =>
          pathname === child.href || pathname.startsWith(child.href + "/")
      )
    );
    if (activeParent) {
      const titleToUse = activeParent.titleKey || activeParent.title;
      setExpandedItems((prev) => {
        if (!prev.includes(titleToUse)) {
          return [...prev, titleToUse];
        }
        return prev;
      });
    }
  }, [pathname]);

  // Save expanded items to localStorage when they change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(
        "sidebarExpandedItems",
        JSON.stringify(expandedItems)
      );
    }
  }, [expandedItems, isMounted]);

  const menuItems = addExplicitTitleKeys([
    {
      titleKey: "equipment.title",
      title: t("equipment.title"),
      icon: Settings,
      href: "/equipment",
      children: [
        {
          titleKey: "equipment.overview",
          title: t("equipment.overview"),
          href: "/equipment/overview",
        },
        {
          titleKey: "equipment.master_management",
          title: t("equipment.master_management"),
          href: "/equipment/master",
        },
        {
          titleKey: "equipment.registration_management",
          title: t("equipment.registration_management"),
          href: "/equipment/register",
        },
        {
          titleKey: "equipment.bom_management",
          title: t("equipment.bom_management"),
          href: "/equipment/bom",
        },
        {
          titleKey: "equipment.spec",
          title: t("equipment.spec"),
          href: "/equipment/spec",
        },
        {
          titleKey: "equipment.docs",
          title: t("equipment.docs"),
          href: "/equipment/docs",
        },
      ],
    },
    {
      titleKey: "sensor.title",
      title: t("sensor.title"),
      icon: Gauge,
      href: "/sensor",
      children: [
        {
          titleKey: "sensor.overview",
          title: t("sensor.overview"),
          href: "/sensor/overview",
        },
        {
          titleKey: "sensor.dashboard",
          title: t("sensor.dashboard"),
          href: "/sensor/dashboard",
        },
        {
          titleKey: "sensor.registration_management",
          title: t("sensor.registration_management"),
          href: "/sensor/register",
        },
        {
          titleKey: "sensor.groups",
          title: t("sensor.groups"),
          href: "/sensor/groups",
        },
        {
          titleKey: "sensor.types",
          title: t("sensor.types"),
          href: "/sensor/types",
        },
        {
          titleKey: "sensor.analysis",
          title: t("sensor.analysis"),
          icon: BarChart3,
          href: "/sensor/analysis",
        },
      ],
    },
    {
      titleKey: "materials.title",
      title: t("materials.title"),
      icon: Package,
      href: "/materials",
      children: [
        {
          titleKey: "materials.registration_management",
          title: t("materials.registration_management"),
          href: "/materials/register",
        },
        {
          titleKey: "materials.master_management",
          title: t("materials.master_management"),
          href: "/materials/master",
        },
        {
          titleKey: "materials.inventory_management",
          title: t("materials.inventory_management"),
          href: "/materials/stock",
        },
        {
          titleKey: "materials.inbound",
          title: t("materials.inbound"),
          href: "/materials/inbound",
        },
        {
          titleKey: "materials.outbound",
          title: t("materials.outbound"),
          href: "/materials/outbound",
        },
        {
          titleKey: "materials.issuance_request",
          title: t("materials.issuance_request"),
          href: "/materials/issuance-request",
        },
      ],
    },
    {
      titleKey: "maintenanceTemplate.title",
      title: t("maintenanceTemplate.title"),
      icon: FileText,
      href: "/maintenance-template",
      children: [
        {
          titleKey: "maintenanceTemplate.master",
          title: t("maintenanceTemplate.master"),
          href: "/maintenance-template/master",
        },
        {
          titleKey: "maintenanceTemplate.standard",
          title: t("maintenanceTemplate.standard"),
          href: "/maintenance-template/standard",
        },
      ],
    },
    {
      titleKey: "inspection.title",
      title: t("inspection.title"),
      icon: ClipboardCheck,
      href: "/inspection",
      children: [
        {
          titleKey: "inspection.schedule",
          title: t("inspection.schedule"),
          href: "/inspection/schedule",
        },
        {
          titleKey: "inspection.result",
          title: t("inspection.result"),
          href: "/inspection/result",
        },
        {
          titleKey: "inspection.calendar",
          title: t("inspection.calendar"),
          href: "/inspection/calendar",
        },
      ],
    },
    {
      titleKey: "maintenance.title",
      title: t("maintenance.title"),
      icon: Wrench,
      href: "/maintenance",
      children: [
        {
          titleKey: "maintenance.request_management",
          title: t("maintenance.request_management"),
          href: "/maintenance/request",
        },
        {
          titleKey: "maintenance.plan_management",
          title: t("maintenance.plan_management"),
          href: "/maintenance/plan",
        },
        {
          titleKey: "maintenance.complete_management",
          title: t("maintenance.complete_management"),
          href: "/maintenance/complete",
        },
      ],
    },
    {
      titleKey: "energy.title",
      title: t("energy.title"),
      icon: Bolt,
      href: "/energy",
      children: [
        {
          titleKey: "energy.dashboard",
          title: t("energy.dashboard"),
          href: "/energy/dashboard",
        },
        {
          titleKey: "energy.monitoring",
          title: t("energy.monitoring"),
          href: "/energy/monitoring",
        },
        {
          titleKey: "energy.usage_analysis",
          title: t("energy.usage_analysis"),
          href: "/energy/analysis",
        },
      ],
    },
    {
      titleKey: "carbon.title",
      title: t("carbon.title"),
      icon: Leaf,
      href: "/carbon",
      children: [
        {
          titleKey: "carbon.tracking",
          title: t("carbon.tracking"),
          href: "/carbon/tracking",
        },
        {
          titleKey: "carbon.emission_factors",
          title: t("carbon.emission_factors"),
          href: "/carbon/emission-factors",
        },
        {
          titleKey: "carbon.reduction_targets",
          title: t("carbon.reduction_targets"),
          href: "/carbon/targets",
        },
        {
          titleKey: "carbon.esg_report",
          title: t("carbon.esg_report"),
          href: "/carbon/esg-report",
        },
        {
          titleKey: "carbon.ai_prediction",
          title: t("carbon.ai_prediction"),
          href: "/carbon/prediction",
        },
        {
          titleKey: "carbon.sources",
          title: t("carbon.sources"),
          href: "/carbon/sources",
        },
        {
          titleKey: "carbon.reduction_activities",
          title: t("carbon.reduction_activities"),
          href: "/carbon/reduction-activities",
        },
        {
          titleKey: "carbon.scope3",
          title: t("carbon.scope3"),
          href: "/carbon/scope3",
        },
        {
          titleKey: "carbon.data_import",
          title: t("carbon.data_import"),
          href: "/carbon/data-import",
        },
      ],
    },
    {
      titleKey: "failure.title",
      title: t("failure.title"),
      icon: AlertTriangle,
      href: "/failure",
      children: [
        {
          titleKey: "failure.registration",
          title: t("failure.registration"),
          href: "/failure/desktop-register",
        },
        {
          titleKey: "failure.history",
          title: t("failure.history"),
          href: "/failure/history",
        },
      ],
    },
    {
      titleKey: "preventive.title",
      title: t("preventive.title"),
      icon: Calendar,
      href: "/preventive",
      children: [
        {
          titleKey: "preventive.master",
          title: t("preventive.master"),
          href: "/preventive/master",
        },
        {
          titleKey: "preventive.order",
          title: t("preventive.order"),
          href: "/preventive/order",
        },
        {
          titleKey: "preventive.calendar",
          title: t("preventive.calendar"),
          href: "/preventive/calendar",
        },
      ],
    },
    {
      titleKey: "metering.title",
      title: t("metering.title"),
      icon: Gauge,
      href: "/metering",
      children: [
        {
          titleKey: "metering.reading_management",
          title: t("metering.reading_management"),
          href: "/metering/reading",
        },
        {
          titleKey: "metering.calibration_management",
          title: t("metering.calibration_management"),
          href: "/metering/calibration",
        },
        {
          titleKey: "metering.analytics_management",
          title: t("metering.analytics_management"),
          href: "/metering/analytics",
        },
        {
          titleKey: "metering.calendar_management",
          title: t("metering.calendar_management"),
          href: "/metering/calendar",
        },
      ],
    },
    {
      titleKey: "budget_management.title",
      title: t("budget_management.title"),
      icon: FileBarChart2,
      href: "/metering/budget",
      children: [
        {
          titleKey: "budget_management.cost_analysis",
          title: t("budget_management.cost_analysis"),
          href: "/metering/cost-analysis",
        },
      ],
    },
    {
      titleKey: "prediction.title",
      title: t("prediction.title"),
      icon: Brain,
      href: "/prediction",
      children: [
        {
          titleKey: "prediction.result_management",
          title: t("prediction.result_management"),
          href: "/prediction/result",
        },
        {
          titleKey: "prediction.sensor_management",
          title: t("prediction.sensor_management"),
          href: "/prediction/sensor",
        },
      ],
    },
    {
      titleKey: "tpm.title",
      title: t("tpm.title"),
      icon: Users,
      href: "/tpm",
      children: [
        {
          titleKey: "tpm.registration",
          title: t("tpm.registration"),
          href: "/tpm/activity",
        },
        {
          titleKey: "tpm.team",
          title: t("tpm.team"),
          href: "/tpm/team",
        },
      ],
    },
    {
      titleKey: "kpi.title",
      title: t("kpi.title"),
      icon: BarChart3,
      children: [
        {
          titleKey: "kpi.dashboard",
          title: t("kpi.dashboard"),
          href: "/kpi/dashboard",
        },
        {
          titleKey: "kpi.mtbf",
          title: t("kpi.mtbf"),
          href: "/kpi/mtbf",
        },
        {
          titleKey: "kpi.health",
          title: t("kpi.health"),
          href: "/kpi/health",
        },
      ],
    },
    {
      titleKey: "location.title",
      title: t("location.title"),
      icon: Map,
      href: "/location",
      children: [
        {
          titleKey: "location.layout_management",
          title: t("location.layout_management"),
          href: "/location/layout",
        },
        {
          titleKey: "location.monitor_management",
          title: t("location.monitor_management"),
          href: "/location/monitor",
        },
      ],
    },
    {
      titleKey: "integration.title",
      title: t("integration.title"),
      icon: LinkIcon,
      href: "/integration",
      children: [
        {
          titleKey: "integration.erp_management",
          title: t("integration.erp_management"),
          href: "/integration/erp",
        },
        {
          titleKey: "integration.plc_management",
          title: t("integration.plc_management"),
          href: "/integration/plc",
        },
      ],
    },
    {
      titleKey: "mobile.title",
      title: t("mobile.title"),
      icon: Smartphone,
      href: "/mobile",
      children: [
        {
          titleKey: "mobile.qr_management",
          title: t("mobile.qr_management"),
          href: "/mobile/qr",
        },
        {
          titleKey: "mobile.result_management",
          title: t("mobile.result_management"),
          href: "/mobile/result",
        },
        {
          titleKey: "mobile.failure_register",
          title: t("mobile.failure_register"),
          href: "/mobile-qr/failure-register",
        },
      ],
    },
    {
      titleKey: "system.title",
      title: t("system.title"),
      icon: Settings,
      href: "/system",
      children: [
        {
          titleKey: "system.organization_management",
          title: t("system.organization_management"),
          href: "/system/organization",
        },
        {
          titleKey: "system.users_management",
          title: t("system.users_management"),
          href: "/system/users",
        },
        {
          titleKey: "system.permissions_management",
          title: t("system.permissions_management"),
          href: "/system/permissions",
        },
        {
          titleKey: "system.roles_management",
          title: t("system.roles_management"),
          href: "/system/permissions/roles",
        },
        {
          titleKey: "system.codes_management",
          title: t("system.codes_management"),
          href: "/system/codes",
        },
        {
          titleKey: "system.config_management",
          title: t("system.config_management"),
          href: "/system/config",
        },
        {
          titleKey: "system.language_management",
          title: t("system.language_management"),
          href: "/system/language",
        },
        {
          titleKey: "system.theme_management",
          title: t("system.theme_management"),
          href: "/system/theme",
        },
      ],
    },
  ]);

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-background border-r border-border transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-16",
        !isMounted && "invisible" // Hide until mounted to prevent layout shift
      )}
      style={{
        transition: "width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "translateZ(0)", // Force GPU acceleration
      }}
    >
      <div className="flex h-16 items-center justify-center border-b border-border">
        <Link href="/" passHref>
          <h2
            className={cn(
              "font-bold text-lg text-primary transition-opacity duration-300 cursor-pointer",
              isOpen ? "opacity-100" : "opacity-0"
            )}
          >
            FMS
          </h2>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedItems.includes(
            item.titleKey || item.title
          );
          const hasChildren = item.children && item.children.length > 0;
          const isParentActive =
            hasChildren &&
            item.children.some(
              (child: any) =>
                pathname === child.href || pathname.startsWith(child.href + "/")
            );
          const isDirectActive =
            !hasChildren &&
            (pathname === item.href || pathname.startsWith(item.href + "/"));

          return (
            <div key={item.titleKey || item.title} className="mb-1">
              {!hasChildren ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center w-full h-10 px-3 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isDirectActive
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {isOpen && (
                    <span className="ml-3 truncate">{item.title}</span>
                  )}
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-10 px-3 text-foreground hover:bg-accent hover:text-accent-foreground",
                    isParentActive &&
                      "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                  onClick={() => toggleExpanded(item.titleKey || item.title)}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {isOpen && (
                    <>
                      <span className="ml-3 truncate">{item.title}</span>
                      <div className="ml-auto">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </>
                  )}
                </Button>
              )}

              {hasChildren && isExpanded && isOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child: any) => {
                    const isChildActive =
                      pathname === child.href ||
                      pathname.startsWith(child.href + "/");
                    return (
                      <Link
                        key={child.titleKey || child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center w-full h-8 px-3 text-sm rounded-md transition-colors",
                          isChildActive
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <span className="truncate">{child.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
};

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
          <Sidebar isOpen={false} onToggle={() => {}} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export { Sidebar };
