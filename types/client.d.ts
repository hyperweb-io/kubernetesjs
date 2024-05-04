/// <reference types="node" />
import * as http from 'http';
export interface APIClientOptions {
    restEndpoint: string;
}
export declare class APIClient {
    private hostname;
    private port;
    private defaultTimeout;
    constructor(options: APIClientOptions);
    get<Resp = unknown>(endpoint: string, query?: {
        [key: string]: any;
    }, opts?: http.RequestOptions & {
        timeout?: number;
    }): Promise<Resp>;
    post<Resp = unknown, Params = any>(endpoint: string, params: Params, opts?: http.RequestOptions & {
        timeout?: number;
        isFormData?: boolean;
    }): Promise<Resp>;
    patch<Resp = unknown, Params = any>(endpoint: string, params: Params, opts?: http.RequestOptions & {
        timeout?: number;
        isFormData?: boolean;
    }): Promise<Resp>;
    put<Resp = unknown, Params = any>(endpoint: string, params: Params, opts?: http.RequestOptions & {
        timeout?: number;
    }): Promise<Resp>;
    delete<Resp = unknown>(endpoint: string, opts?: http.RequestOptions & {
        timeout?: number;
    }): Promise<Resp>;
    private request;
}
