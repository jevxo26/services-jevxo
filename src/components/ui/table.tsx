"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Search, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { PremiumSearch } from "@/components/ui/input"

/* ==========================================================================
   1. STANDARD TABLE PRIMITIVES (PREMIUM STYLED WITH THEME VARIABLES)
   ========================================================================== */

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        "relative w-full overflow-x-auto md:overflow-x-visible",
        "[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5",
        "[&::-webkit-scrollbar-track]:bg-slate-50",
        "[&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300"
      )}
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm border-collapse", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("bg-premium-light border-b border-slate-100", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("divide-y divide-slate-100 [&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-premium-light font-semibold [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-slate-100 transition-colors hover:bg-premium-light/50",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-12 px-3 md:px-6 text-left align-middle font-bold text-premium-gray uppercase tracking-wider text-xs whitespace-nowrap",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-3 md:px-6 py-3 md:py-4 align-middle whitespace-nowrap text-sm text-premium-slate font-semibold",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-xs text-premium-gray font-medium", className)}
      {...props}
    />
  )
}

/* ==========================================================================
   2. HIGH-LEVEL PREMIUM DYNAMIC CUSTOM TABLE COMPONENT
   ========================================================================== */

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export interface TableAction<T> {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ComponentType<any>;
  variant?: "default" | "destructive" | "secondary";
}

export interface CustomTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
  searchKey?: keyof T & string;
  searchPlaceholder?: string;
  filterKey?: keyof T & string;
  filterPlaceholder?: string;
  filterOptions?: { label: string; value: string }[];
  pageSize?: number;
  className?: string;
  rowClassName?: (row: T) => string;
  expandableContent?: (row: T) => React.ReactNode;
}

export function CustomTable<T extends { id?: string | number;[key: string]: any }>({
  columns,
  data,
  actions = [],
  searchKey,
  searchPlaceholder = "Search records...",
  filterKey,
  filterPlaceholder = "All Filters",
  filterOptions = [],
  pageSize = 5,
  className,
  rowClassName,
  expandableContent,
}: CustomTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeFilter, setActiveFilter] = React.useState("ALL")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [expandedRowId, setExpandedRowId] = React.useState<string | number | null>(null)



  // Filter & Search Logic
  const filteredData = React.useMemo(() => {
    return data.filter((row) => {
      // 1. Search Query check
      if (searchKey && searchQuery) {
        const value = row[searchKey]
        if (!value || !value.toString().toLowerCase().includes(searchQuery.toLowerCase())) {
          return false
        }
      }

      // 2. Dropdown Filter check
      if (filterKey && activeFilter !== "ALL") {
        const value = row[filterKey]
        if (!value || value.toString() !== activeFilter) {
          return false
        }
      }

      return true
    })
  }, [data, searchQuery, activeFilter, searchKey, filterKey])

  // Pagination Calculations
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  // Reset page when queries change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeFilter])

  return (
    <div className={cn("space-y-4 w-full animate-in fade-in duration-200", className)}>

      {/* Top Filter & Search Controls */}
      {(searchKey || (filterKey && filterOptions.length > 0)) && (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">

          {/* Search bar */}
          {searchKey && (
            <div className="flex-1 max-w-sm">
              <PremiumSearch
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={setSearchQuery}
                resultsCount={filteredData.length}
              />
            </div>
          )}

          {/* Dynamic Filter Dropdown */}
          {filterKey && filterOptions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-premium-gray uppercase tracking-wider hidden sm:inline-block">Filter By:</span>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-primary transition-all cursor-pointer shadow-sm"
              >
                <option value="ALL">{filterPlaceholder}</option>
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Main Responsive Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-premium relative">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.header}</TableHead>
              ))}
              {actions.length > 0 && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => {
                const uniqueRowId = row.id ?? idx
                const isExpanded = expandedRowId === uniqueRowId
                return (
                  <React.Fragment key={uniqueRowId}>
                    <TableRow 
                      className={cn(
                        rowClassName ? rowClassName(row) : undefined, 
                        expandableContent && "cursor-pointer",
                        isExpanded && "bg-premium-light/50"
                      )}
                      onClick={() => {
                        if (expandableContent) {
                          setExpandedRowId(isExpanded ? null : uniqueRowId)
                        }
                      }}
                    >
                      {columns.map((col) => (
                        <TableCell key={col.key}>
                          {col.render ? col.render(row) : row[col.key]}
                        </TableCell>
                      ))}

                      {/* Action dropdown or buttons */}
                      {actions.length > 0 && (
                        <TableCell className="text-right relative" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center justify-end gap-2">

                            {actions.map((act, actIdx) => {
                              const ActIcon = act.icon
                              return (
                                <button
                                  key={actIdx}
                                  title={act.label}
                                  onClick={() => act.onClick(row)}
                                  className={cn(
                                    "p-2 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center shadow-sm",
                                    act.variant === "destructive"
                                      ? "bg-rose-50 text-brand-primary hover:bg-rose-100 border border-rose-100"
                                      : act.variant === "secondary"
                                        ? "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"
                                        : "bg-[#EEF2FF] text-[#1E4E8C] hover:bg-[#E0E7FF] border border-[#E0E7FF]"
                                  )}
                                >
                                  {ActIcon ? <ActIcon size={16} /> : <span className="text-[10px] font-bold px-1">{act.label}</span>}
                                </button>
                              )
                            })}

                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                    
                    {/* Expandable Content Row */}
                    {expandableContent && isExpanded && (
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100/60">
                        <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="p-0">
                          <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                            {expandableContent(row)}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-12 text-premium-gray font-medium">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-premium">
          <span className="text-xs text-premium-gray font-semibold">
            Showing Page <strong className="text-premium-slate font-bold">{currentPage}</strong> of <strong className="text-premium-slate font-bold">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 hover:bg-premium-light text-premium-gray disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }).map((_, pageIdx) => {
              const pageNum = pageIdx + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-xl text-xs font-bold transition-all",
                    currentPage === pageNum
                      ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                      : "border border-slate-200 hover:bg-premium-light text-premium-gray"
                  )}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 hover:bg-premium-light text-premium-gray disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
