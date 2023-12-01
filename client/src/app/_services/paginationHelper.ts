import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs";
import { PaginatedResult, PaginatedResult2 } from "../_models/pagination";
import { UserParams } from "../_models/userParams";

export function getPaginatedResult<T>(url: string, params: HttpParams, http: HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>;
    return http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }

  export function getPaginatedResultWithBody<T>(url: string, params: UserParams, http: HttpClient) {
    let paginatedResult: T;

    return http.post<T>(url, params).pipe(
      map(response => {
        paginatedResult = response;
        return paginatedResult;
      })
    );
  }

  

  

  export function getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

    return params;
  }