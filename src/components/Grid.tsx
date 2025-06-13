/*  src/components/common/Grid.tsx  */
import React from "react"
import {
    Pagination as PaginationRoot,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Loader, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

export type Column<T> = {
    header: string
    accessor: keyof T | ((row: T) => React.ReactNode)
    className?: string
    /** Se true, esconde na grade principal  */
    hidden?: boolean
}


export type PaginationMeta = { page: number; totalPages: number }

export interface GridProps<T> {
    /** Cabeçalhos + mapeamento de conteúdo */
    columns: Column<T>[]
    rows: T[]
    getRowKey(row: T): string | number

    /** ▸ DETALHES EXPANDIDOS */
    showDetails?: boolean
    renderDetails?(row: T): React.ReactNode

    /** ▸ BOTÕES DE AÇÃO */
    showActions?: boolean
    onEdit?(row: T): void
    onDelete?(row: T): void

    /** ▸ PAGINAÇÃO */
    pagination?: PaginationMeta
    onPageChange?(page: number): void

    isLoading: boolean;
}

export function Grid<T>({
    columns,
    rows,
    getRowKey,
    showDetails = false,
    renderDetails,
    showActions = false,
    onEdit,
    onDelete,
    pagination,
    onPageChange,
    isLoading
}: GridProps<T>) {
    const [expandedId, setExpandedId] = React.useState<string | number | null>(null)

    /** helpers */
    const toggle = (id: string | number) =>
        setExpandedId((prev) => (prev === id ? null : id))

    /** paginação */
    const hasPag = !!pagination && !!onPageChange
    const { page = 1, totalPages = 1 } = pagination ?? {}

    const visibleCols = columns.filter(c => !c.hidden)
    const invisibleCols = columns.filter(c => c.hidden)

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader className="animate-spin" size={"3rem"} />
                </div>
            ) : (
                <>
                    {/* ---------- TABELA ---------- */}
                    < div className="rounded-md border overflow-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    {visibleCols.map(({ header, className }) => (
                                        <th
                                            key={header}
                                            className={`h-10 px-2 text-left font-medium ${className ?? ''}`}
                                        >
                                            {header}
                                        </th>
                                    ))}

                                    {showActions && (
                                        <th className="h-10 px-2 text-right font-medium w-16">
                                        </th>
                                    )}
                                </tr>
                            </thead>


                            <tbody>

                                {rows.map((row) => {
                                    const rowId = getRowKey(row)
                                    const isOpen = expandedId === rowId

                                    return (
                                        <React.Fragment key={rowId}>
                                            <tr className="border-b hover:bg-muted/50">
                                                {visibleCols.map(({ accessor, className }, i) => {
                                                    const value =
                                                        typeof accessor === 'function' ? accessor(row) : (row as any)[accessor]
                                                    return (
                                                        <td key={i} className={`p-2 ${className ?? ''}`}>{value}</td>
                                                    )
                                                })}

                                                {showActions && (
                                                    <td className="p-2 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            {/* botão expandir/contrair */}
                                                            {showDetails && (
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() => toggle(rowId)}
                                                                    className="w-6 h-6"
                                                                >
                                                                    {expandedId === rowId ? (
                                                                        <ChevronUp className="h-4 w-4" />
                                                                    ) : (
                                                                        <ChevronDown className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            )}

                                                            {/* menu suspenso de ações */}
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="bg-white hover:bg-gray-100"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>

                                                                <DropdownMenuContent
                                                                    align="end"
                                                                    className="p-4 bg-white border shadow-lg p-0 w-24"
                                                                >
                                                                    {onEdit && (
                                                                        <DropdownMenuItem
                                                                            onClick={() => onEdit(row)}
                                                                            className="mb-2 bg-white hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                                                                        >
                                                                            <Pencil className="mr-2 h-4 w-4" /> Editar
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                    {onDelete && (
                                                                        <DropdownMenuItem
                                                                            onClick={() => onDelete(row)}
                                                                            className="bg-white text-destructive hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </td>
                                                )}

                                            </tr>

                                            {showDetails && isOpen && (
                                                <tr className="bg-gray-50">
                                                    <td colSpan={visibleCols.length + (showActions ? 1 : 0)}>
                                                        {renderDetails
                                                            ? renderDetails(row)
                                                            : (
                                                                <div className="grid grid-cols-3 gap-4 p-4 text-sm">
                                                                    {invisibleCols.map(({ header, accessor }) => {
                                                                        const val =
                                                                            typeof accessor === 'function'
                                                                                ? accessor(row)
                                                                                : (row as any)[accessor]
                                                                        return (
                                                                            <div key={String(header)}>
                                                                                <strong>{header}:</strong> {val}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            )}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div >

                    {/* ---------- PAGINAÇÃO ---------- */}
                    {
                        hasPag && (
                            <PaginationRoot className="justify-end p-6">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious onClick={() => onPageChange(page - 1)} disabled={page === 1} />
                                    </PaginationItem>

                                    <PaginationItem>
                                        <Button disabled>{page}</Button>
                                    </PaginationItem>

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => onPageChange(page + 1)}
                                            disabled={page === totalPages}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </PaginationRoot>
                        )
                    }
                </>
            )}
        </>
    )
}
