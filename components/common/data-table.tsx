"use client";

import type React from "react";

import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "@/lib/language-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreHorizontal,
  Search,
  Plus,
  Download,
  Upload,
  Filter,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Settings,
} from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  filterOptions?: Array<{ label: string; value: any }>;
  hidden?: boolean;
  align?: "left" | "center" | "right";
  fixed?: "left" | "right";
}

export interface DataTableAction<T> {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: (record: T) => void;
  variant?: "default" | "destructive";
  disabled?: (record: T) => boolean;
  hidden?: (record: T) => boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: DataTableAction<T>[];
  onAdd?: () => void;
  loading?: boolean;
  searchPlaceholder?: string;
  title?: string;
  subtitle?: string;
  addButtonText?: string;
  showSearch?: boolean;
  showFilter?: boolean;
  showExport?: boolean;
  showImport?: boolean;
  showColumnSettings?: boolean;
  selectable?: boolean;
  onSelectedRowsChange?: (selectedRows: T[]) => void;
  selectedRows?: T[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  onExport?: () => void;
  onImport?: () => void;
  emptyMessage?: string;
  stickyHeader?: boolean;
  maxHeight?: string;
}

const formatValue = (value: any): string => {
  if (value == null) return "";
  if (
    value instanceof Date ||
    (typeof value === "string" && !isNaN(Date.parse(value)))
  ) {
    const date = new Date(value);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
  }
  if (typeof value === "boolean") return value ? "Y" : "N";
  return String(value);
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns: initialColumns,
  actions = [],
  onAdd,
  loading = false,
  searchPlaceholder,
  title,
  subtitle,
  addButtonText,
  showSearch = true,
  showFilter = true,
  showExport = false,
  showImport = false,
  showColumnSettings = true,
  selectable = false,
  onSelectedRowsChange,
  selectedRows = [],
  pagination,
  onExport,
  onImport,
  emptyMessage,
  stickyHeader = false,
  maxHeight = "calc(100vh - 200px)",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation("common");
  const searchPlaceholderText =
    searchPlaceholder ?? `${t("common.search")}...`;
  const addButtonTextText = addButtonText ?? t("common.add");
  const emptyMessageText = emptyMessage ?? t("common.noData");

  const getValue = useCallback((record: T, key: string): any => {
    if (!record || !key) return "";
    try {
      if (Object.prototype.hasOwnProperty.call(record, key)) {
        return record[key as keyof T] ?? "";
      }
      if (key.includes(".")) {
        const nestedValue = key
          .split(".")
          .reduce(
            (obj, k) =>
              obj && typeof obj === "object"
                ? (obj as Record<string, any>)[k]
                : undefined,
            record
          );
        return nestedValue ?? "";
      }
      return record[key as keyof T] ?? "";
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `DataTable: Error accessing value for key "${key}" in record:`,
          record,
          error
        );
      }
      return "";
    }
  }, []);

  const visibleColumns = useMemo(() => {
    return initialColumns.filter(
      (col) => !hiddenColumns.has(String(col.key)) && !col.hidden
    );
  }, [initialColumns, hiddenColumns]);

  // 검색 및 필터링
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 검색 필터
      if (searchTerm && showSearch) {
        const searchMatch = visibleColumns.some((column) => {
          if (!column.searchable) return false;
          const columnKey = (column as any).accessorKey || column.key;
          const value = getValue(item, String(columnKey));
          return value
            ? String(value).toLowerCase().includes(searchTerm.toLowerCase())
            : false;
        });
        if (!searchMatch) return false;
      }

      // 컬럼 필터
      for (const [columnKey, filterValue] of Object.entries(columnFilters)) {
        if (filterValue !== undefined && filterValue !== "") {
          const itemValue = getValue(item, columnKey);
          if (Array.isArray(filterValue)) {
            if (!filterValue.includes(itemValue)) return false;
          } else {
            if (itemValue !== filterValue) return false;
          }
        }
      }

      return true;
    });
  }, [data, searchTerm, columnFilters, visibleColumns, showSearch, getValue]);

  // 정렬
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getValue(a, sortColumn);
      const bValue = getValue(b, sortColumn);

      // null/undefined 처리
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // 숫자 비교
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // 문자열 비교
      const aStr = aValue ? String(aValue).toLowerCase() : "";
      const bStr = bValue ? String(bValue).toLowerCase() : "";

      if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
      if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection, getValue]);

  // 페이지네이션
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, pagination]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const handleColumnFilter = (columnKey: string, value: any) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnKey]: value,
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setColumnFilters({});
    setSortColumn("");
    setSortDirection("asc");
  };

  const toggleColumn = (columnKey: string) => {
    setHiddenColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedRowsChange?.(paginatedData);
    } else {
      onSelectedRowsChange?.([]);
    }
  };

  const handleSelectRow = (record: T, checked: boolean) => {
    if (checked) {
      onSelectedRowsChange?.([...selectedRows, record]);
    } else {
      onSelectedRowsChange?.(
        selectedRows.filter((row) => row.id !== record.id)
      );
    }
  };

  const isRowSelected = (record: T) => {
    return selectedRows.some((row) => row.id === record.id);
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((record) => isRowSelected(record));
  const isIndeterminate =
    paginatedData.some((record) => isRowSelected(record)) && !isAllSelected;

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          {title && (
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          )}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {/* 검색 */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholderText}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          )}

          {/* 필터 토글 */}
          {showFilter && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}

          {/* 필터 초기화 */}
          <Button
            variant="outline"
            size="icon"
            onClick={clearFilters}
            title={t("dataTable.reset_filters")}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          {/* 컬럼 설정 */}
          {showColumnSettings && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {initialColumns.map((column) => (
                  <DropdownMenuItem
                    key={String(column.key)}
                    onClick={() => toggleColumn(String(column.key))}
                  >
                    <Checkbox
                      checked={
                        !hiddenColumns.has(String(column.key)) && !column.hidden
                      }
                      className="mr-2"
                    />
                    {column.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* 내보내기 */}
          {showExport && onExport && (
            <Button variant="outline" size="icon" onClick={onExport}>
              <Download className="h-4 w-4" />
            </Button>
          )}

          {/* 가져오기 */}
          {showImport && onImport && (
            <Button variant="outline" size="icon" onClick={onImport}>
              <Upload className="h-4 w-4" />
            </Button>
          )}

          {/* 추가 버튼 */}
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              {addButtonTextText}
            </Button>
          )}
        </div>
      </div>

      {/* 필터 패널 */}
      {showFilters && showFilter && (
        <div className="bg-muted/50 p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleColumns
              .filter((column) => column.filterable)
              .map((column) => {
                const columnKey = (column as any).accessorKey || column.key;
                return (
                  <div key={String(columnKey)} className="space-y-2">
                    <label className="text-sm font-medium">
                      {column.title}
                    </label>
                    {column.filterOptions ? (
                      <Select
                        value={columnFilters[String(columnKey)] || ""}
                        onValueChange={(value) =>
                          handleColumnFilter(
                            String(columnKey),
                            value === "all" ? "" : value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("common.all")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("common.all")}</SelectItem>
                          {column.filterOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder={`${column.title} ${t("common.filter")}`}
                        value={columnFilters[String(columnKey)] || ""}
                        onChange={(e) =>
                          handleColumnFilter(String(columnKey), e.target.value)
                        }
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 선택된 행 정보 */}
      {selectable && selectedRows.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {t("dataTable.selected_count")
                .replace("{count}", selectedRows.length.toString())}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectedRowsChange?.([])}
            >
              {t("dataTable.deselect")}
            </Button>
          </div>
        </div>
      )}

      {/* 테이블 */}
      <div className="border rounded-lg overflow-hidden">
        {/* 디버깅 정보 - 개발 모드에서만 표시 */}
        {process.env.NODE_ENV === "development" && (
          <div className="p-2 bg-gray-50 text-xs text-gray-600 border-b">
            데이터: {data.length}개 | 컬럼: {visibleColumns.length}개 | 표시:{" "}
            {paginatedData.length}개
          </div>
        )}
        <div
          className="overflow-auto"
          style={{ maxHeight: stickyHeader ? maxHeight : "none" }}
        >
          <Table>
            <TableHeader
              className={stickyHeader ? "sticky top-0 bg-background z-10" : ""}
            >
              <TableRow>
                {selectable && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      ref={(ref) => {
                        if (ref) ref.indeterminate = isIndeterminate;
                      }}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                {visibleColumns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={`${column.width || ""} ${
                      column.sortable ? "cursor-pointer hover:bg-muted" : ""
                    } ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                        ? "text-right"
                        : ""
                    }`}
                    onClick={() =>
                      column.sortable && handleSort(String(column.key))
                    }
                  >
                    <div className="flex items-center gap-2">
                      {column.title}
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={`h-3 w-3 ${
                              sortColumn === String(column.key) &&
                              sortDirection === "asc"
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <ChevronDown
                            className={`h-3 w-3 -mt-1 ${
                              sortColumn === String(column.key) &&
                              sortDirection === "desc"
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
                {actions.length > 0 && (
                  <TableHead className="w-[100px]">{t("common.action")}</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      visibleColumns.length +
                      (selectable ? 1 : 0) +
                      (actions.length > 0 ? 1 : 0)
                    }
                    className="text-center py-8"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">{t("common.loading")}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      visibleColumns.length +
                      (selectable ? 1 : 0) +
                      (actions.length > 0 ? 1 : 0)
                    }
                    className="text-center py-8 text-muted-foreground"
                  >
                    {emptyMessageText}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((record, index) => (
                  <TableRow
                    key={record.id || index}
                    className={isRowSelected(record) ? "bg-muted/50" : ""}
                  >
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={isRowSelected(record)}
                          onCheckedChange={(checked) =>
                            handleSelectRow(record, checked as boolean)
                          }
                        />
                      </TableCell>
                    )}
                    {visibleColumns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        className={
                          column.align === "center"
                            ? "text-center"
                            : column.align === "right"
                            ? "text-right"
                            : ""
                        }
                      >
                        {column.render
                          ? column.render(
                              getValue(record, String(column.key)),
                              record,
                              index
                            )
                          : formatValue(getValue(record, String(column.key)))}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions
                              .filter((action) => !action.hidden?.(record))
                              .map((action) => {
                                const Icon = action.icon;
                                return (
                                  <DropdownMenuItem
                                    key={action.key}
                                    onClick={() => action.onClick(record)}
                                    disabled={action.disabled?.(record)}
                                    className={
                                      action.variant === "destructive"
                                        ? "text-red-600"
                                        : ""
                                    }
                                  >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {action.label}
                                  </DropdownMenuItem>
                                );
                              })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 페이지네이션 */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t("dataTable.pagination_summary")
              .replace("{total}", pagination.total.toString())
              .replace(
                "{start}",
                ((pagination.page - 1) * pagination.pageSize + 1).toString()
              )
              .replace(
                "{end}",
                Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.total
                ).toString()
              )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">{t("dataTable.items_per_page")}</span>
              <Select
                value={pagination.pageSize.toString()}
                onValueChange={(value) =>
                  pagination.onPageSizeChange(Number.parseInt(value))
                }
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(1)}
                disabled={pagination.page === 1}
              >
                {t("dataTable.first")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                {t("common.previous")}
              </Button>
              <span className="px-3 py-1 text-sm">
                {pagination.page} /{" "}
                {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={
                  pagination.page >=
                  Math.ceil(pagination.total / pagination.pageSize)
                }
              >
                {t("common.next")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  pagination.onPageChange(
                    Math.ceil(pagination.total / pagination.pageSize)
                  )
                }
                disabled={
                  pagination.page >=
                  Math.ceil(pagination.total / pagination.pageSize)
                }
              >
                {t("dataTable.last")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 요약 정보 */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          {searchTerm || Object.keys(columnFilters).length > 0
            ? t("dataTable.filtered_summary")
                .replace("{filtered}", sortedData.length.toString())
                .replace("{total}", data.length.toString())
            : t("dataTable.total_summary").replace(
                "{count}",
                data.length.toString()
              )}
        </div>
        {selectedRows.length > 0 && (
          <div>
            {t("dataTable.selected_count").replace(
              "{count}",
              selectedRows.length.toString()
            )}
          </div>
        )}
      </div>
    </div>
  );
}
