export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedResult<T> {
    result?: T;
    pagination?: Pagination;
}

export class PaginatedResult2<T> {
    result?: T;
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface Pagination2 {
    CurrentPage: number;
    PageSize: number;
    TotalCount: number;
    TotalPages: number;
}
