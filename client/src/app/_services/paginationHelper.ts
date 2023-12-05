import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs";
import { PaginatedResult, PaginatedResult2 } from "../_models/pagination";
import { UserParams } from "../_models/userParams";

export function getPaginatedResult<T>(url: string, params: HttpParams, http: HttpClient) {
    //const paginatedResult: PaginatedResult2<T> = new PaginatedResult2<T>;
    let paginatedResult: T;
    return http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult = response.body as T;
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