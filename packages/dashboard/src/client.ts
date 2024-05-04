import * as http from 'http';
import * as querystring from 'querystring';
import { URLSearchParams } from 'url';

interface RequestOptions<Params> {
  hostname: string;
  path: string;
  headers?: { [key: string]: string };
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Params;
  timeout?: number;
}

export interface APIClientOptions {
  restEndpoint: string;
}

export class APIClient {
  private hostname: string;
  private port: number = 8001; // Default Kubernetes proxy port
  private defaultTimeout: number = 10000; // 10 seconds

  constructor(options: APIClientOptions) {
    const url = new URL(options.restEndpoint);
    this.hostname = url.hostname;
    this.port = url.port ? parseInt(url.port) : this.port;
  }

  get<Resp = unknown>(endpoint: string, query?: { [key: string]: any }, opts: http.RequestOptions & { timeout?: number } = {}): Promise<Resp> {
    const queryString = query ? `?${querystring.stringify(query)}` : '';
    const fullPath = endpoint + queryString;
    return this.request<Resp, void>({
      path: fullPath,
      method: 'GET',
      // @ts-ignore
      headers: opts.headers,
      timeout: opts.timeout || this.defaultTimeout,
    });
  }

  post<Resp = unknown, Params = any>(endpoint: string, params: Params, opts: http.RequestOptions & { timeout?: number, isFormData?: boolean } = {}): Promise<Resp> {
    const headers = opts.isFormData ? {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...opts.headers
    } : {
      'Content-Type': 'application/json',
      ...opts.headers
    };
    const body = opts.isFormData ? new URLSearchParams(params as any).toString() : JSON.stringify(params);
    headers['Content-Length'] = Buffer.byteLength(body).toString();

    return this.request<Resp, Params>({
      path: endpoint,
      method: 'POST',
      // @ts-ignore
      headers,
      // @ts-ignore
      params: body,
      timeout: opts.timeout || this.defaultTimeout,
    });
  }

  patch<Resp = unknown, Params = any>(endpoint: string, params: Params, opts: http.RequestOptions & { timeout?: number, isFormData?: boolean } = {}): Promise<Resp> {
    const headers = opts.isFormData ? {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...opts.headers
    } : {
      'Content-Type': 'application/json',
      ...opts.headers
    };
    const body = opts.isFormData ? new URLSearchParams(params as any).toString() : JSON.stringify(params);
    headers['Content-Length'] = Buffer.byteLength(body).toString();

    return this.request<Resp, Params>({
      path: endpoint,
      // @ts-ignore
      method: 'PATCH',
      // @ts-ignore
      headers,
      // @ts-ignore
      params: body,
      timeout: opts.timeout || this.defaultTimeout,
    });
  }

  put<Resp = unknown, Params = any>(endpoint: string, params: Params, opts: http.RequestOptions & { timeout?: number } = {}): Promise<Resp> {
    const stringParams = JSON.stringify(params);
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(stringParams).toString(),
      ...opts.headers
    };
    return this.request<Resp, Params>({
      path: endpoint,
      method: 'PUT',
      // @ts-ignore
      headers: defaultHeaders,
      // @ts-ignore
      params: stringParams,
      timeout: opts.timeout || this.defaultTimeout,
    });
  }

  delete<Resp = unknown>(endpoint: string, opts: http.RequestOptions & { timeout?: number } = {}): Promise<Resp> {
    return this.request<Resp, void>({
      path: endpoint,
      method: 'DELETE',
      // @ts-ignore
      headers: opts.headers,
      timeout: opts.timeout || this.defaultTimeout,
    });
  }

  private request<Resp, Params>(options: RequestOptions<Params>): Promise<Resp> {
    return new Promise((resolve, reject) => {
      const requestOptions: http.RequestOptions = {
        hostname: this.hostname,
        port: this.port,
        path: options.path,
        method: options.method,
        headers: options.headers,
      };

      const req = http.request(requestOptions, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const parsedData: Resp = JSON.parse(data);
            resolve(parsedData);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', error => {
        reject(error);
      });

      // @ts-ignore
      req.setTimeout(options.timeout, () => {
        req.abort();
        reject(new Error('Request timeout'));
      });

      if (options.params && (options.method === 'POST' || options.method === 'PUT')) {
        req.write(options.params);
      }

      req.end();
    });
  }
}
