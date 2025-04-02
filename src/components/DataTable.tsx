import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	type Row,
	useReactTable,
	type ColumnDef,
} from "@tanstack/react-table";
import { Loader } from "lucide-react";
import {
	type ReactNode,
	type SetStateAction,
	useEffect,
	useState,
} from "react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	onChangePage: (page: number) => Promise<void>;
	isLoading: boolean;
	data: TData[];
	renderContextMenuContent?: (row: Row<TData>) => ReactNode;
	onChangeSelection: (selectedItems: string[]) => void;
	meta: {
		page: number;
		perPage: number;
		total: number;
	};
}

export function DataTable<TData, TValue>({
	columns,
	data,
	isLoading,
	onChangePage,
	onChangeSelection,
	renderContextMenuContent,
	meta: { page, perPage, total },
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = useState(
		{} as Record<string, boolean>,
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onRowSelectionChange: setRowSelection,
		state: {
			rowSelection,
		},
	});

	const selectedRows = table.getFilteredSelectedRowModel().rows;

	useEffect(() => {
		onChangeSelection(selectedRows.map((row) => row.getValue("id")));
	}, [selectedRows, onChangeSelection]);

	function handlePageChange(page: number) {
		setRowSelection({});
		onChangePage(page);
	}

	const totalPages = Math.ceil(total / perPage);

	return (
		<>
			{isLoading ? (
				<div className="flex items-center justify-center h-64">
					<Loader className="animate-spin" size={"3rem"} />
				</div>
			) : (
				<>
					<div className="border-b border-b-gray-200 dark:border-b-gray-800 flex-grow flex-1 overflow-auto">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead key={header.id}>
												<div
													className="flex items-center justify-start"
													style={{ width: `${header.getSize()}px` }}
												>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
												</div>
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="p-4 text-start"
									>
										{selectedRows.length} registros selecionados
									</TableCell>
								</TableRow>

								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<>
											{renderContextMenuContent ? (
												<ContextMenu key={row.id}>
													<ContextMenuTrigger asChild>
														<TableRow
															key={row.id}
															data-state={row.getIsSelected() && "selected"}
														>
															{row.getVisibleCells().map((cell) => (
																<TableCell key={cell.id}>
																	{flexRender(
																		cell.column.columnDef.cell,
																		cell.getContext(),
																	)}
																</TableCell>
															))}
														</TableRow>
													</ContextMenuTrigger>
													{renderContextMenuContent(row)}
												</ContextMenu>
											) : (
												<TableRow
													key={row.id}
													data-state={row.getIsSelected() && "selected"}
												>
													{row.getVisibleCells().map((cell) => (
														<TableCell key={cell.id}>
															{flexRender(
																cell.column.columnDef.cell,
																cell.getContext(),
															)}
														</TableCell>
													))}
												</TableRow>
											)}
										</>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											Nenhum registro encontrado
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
					<Pagination className="justify-end p-6">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => {
										handlePageChange(page - 1);
									}}
									isActive={page === 1}
								/>
							</PaginationItem>
							{page < 3 &&
								Array.from({ length: Math.min(3, totalPages) })
									.map((_, index) => index + 1)
									.map((pageNumber) => (
										<PaginationItem key={pageNumber}>
											<Button
												onClick={() => {
													handlePageChange(pageNumber);
												}}
												disabled={pageNumber === page}
											>
												{pageNumber}
											</Button>
										</PaginationItem>
									))}
							{page < 3 && totalPages > 5 && (
								<>
									<PaginationItem>
										<PaginationEllipsis />
									</PaginationItem>
									<PaginationItem>
										<Button
											onClick={() => {
												handlePageChange(totalPages);
											}}
										>
											{totalPages}
										</Button>
									</PaginationItem>
								</>
							)}
							{page > 2 && page < totalPages - 2 && (
								<>
									<PaginationItem>
										<Button
											onClick={() => {
												handlePageChange(1);
											}}
										>
											1
										</Button>
									</PaginationItem>
									<PaginationItem>
										<PaginationEllipsis />
									</PaginationItem>
									<PaginationItem>
										<Button
											onClick={() => {
												handlePageChange(page - 1);
											}}
										>
											{page - 1}
										</Button>
									</PaginationItem>
									<PaginationItem>
										<Button disabled>{page}</Button>
									</PaginationItem>
									<PaginationItem>
										<Button
											onClick={() => {
												handlePageChange(page + 1);
											}}
										>
											{page + 1}
										</Button>
									</PaginationItem>
									<PaginationItem>
										<PaginationEllipsis />
									</PaginationItem>
									<PaginationItem>
										<Button
											onClick={() => {
												handlePageChange(totalPages);
											}}
										>
											{totalPages}
										</Button>
									</PaginationItem>
								</>
							)}
							{page > 3 && page >= totalPages - 2 && (
								<>
									<PaginationItem>
										<Button
											onClick={() => {
												handlePageChange(1);
											}}
										>
											1
										</Button>
									</PaginationItem>
									<PaginationItem>
										<PaginationEllipsis />
									</PaginationItem>
								</>
							)}
							{page > 3 &&
								page >= totalPages - 2 &&
								[totalPages - 2, totalPages - 1, totalPages].map(
									(pageNumber) => (
										<PaginationItem key={pageNumber}>
											<Button
												onClick={() => {
													handlePageChange(pageNumber);
												}}
												disabled={page === pageNumber}
											>
												{pageNumber}
											</Button>
										</PaginationItem>
									),
								)}
							<PaginationItem>
								<PaginationNext
									onClick={() => {
										handlePageChange(page + 1);
									}}
									isActive={page === totalPages}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</>
			)}
		</>
	);
}
