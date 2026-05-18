import qs from "qs";
import { pathParams } from "../utils/PathParams";
import ky, { Hooks, Options as KYOptions, ResponsePromise } from "ky";
import { apiLogger } from "../utils/ApiUtils";
import { toCamelCase } from "../utils/CaseUtils";
import { AppError, AppErrorProps } from "../helpers/AppError";

export interface ApiProps {
  readonly host: string;
  readonly token?: string;
  readonly logout?: () => void;
  readonly employeeId?: string;
  readonly userId?: string;
  readonly taxNo?: string;
  readonly login?: string;
}

export interface ResponseListProps<TData = any> {
  readonly list: TData[];
  readonly page: number;
  readonly perPage: number;
  readonly pageCount: number;
  readonly totalCount: number;
}

export interface Options extends KYOptions {
  readonly query?: object;
  readonly params?: object;
}

export class BaseApi {
  private readonly host: string;
  private readonly token?: string;
  private readonly logout?: () => void;
  protected readonly userId?: string;
  protected readonly taxNo?: string;
  protected readonly login?: string;

  constructor({ token, host, logout, userId, taxNo, login }: ApiProps) {
    this.host = host;
    this.token = token;
    this.logout = logout;
    this.userId = userId;
    this.taxNo = taxNo;
    this.login = login;
  }

  private queryToString(query = {}): string {
    return qs.stringify(query);
  }

  private createRequestUrl(url: string, query = {}, params = {}): string {
    const formattedUrl = pathParams(url, params);

    return [formattedUrl, this.queryToString(query)].filter(Boolean).join("?");
  }

  private createRequestOptions(options: KYOptions): KYOptions {
    const { hooks = {} as Hooks, headers: optionHeaders = [] as any } = options;

    const headers = new Headers(optionHeaders);

    if (this.userId) {
      headers.set("userId", this.userId);
    }

    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }

    return {
      timeout: 120000,
      prefixUrl: this.host,
      ...options,
      headers: [...(headers as any), ...optionHeaders],
      hooks: {
        ...hooks,
        beforeRequest: [...(hooks?.beforeRequest || []), apiLogger],
        afterResponse: [
          ...(hooks?.afterResponse || []),
          async (_, __, response) => {
            if (
              (response.status === 403 || response.status === 401) &&
              this.logout
            ) {
              this.logout();
            }
          },
        ],
      },
    };
  }

  private request(url: string, options: Options = {}): ResponsePromise {
    const { query, params, ...kyOptions } = options;

    const formattedOptions = this.createRequestOptions(kyOptions);
    const formattedUrl = this.createRequestUrl(url, query, params);

    return ky(formattedUrl, formattedOptions);
  }

  private jsonRequest<TData>(url: string, options?: Options): Promise<TData> {
    return new Promise<TData>((resolve, reject) => {
      this.request(url, options)
        .then((response) => {
          if (response.ok) {
            return response.json().then((data: any) => {
              if (data.success && data.data) {
                return data.data;
              } else if (data) {
                return data;
              } else {
                return this.parseError(data);
              }
            });
          }

          return response
            .json()
            .then((data: any) => this.parseError(data))
            .then((error) => {
              throw error;
            });
        })
        .then(resolve)
        .catch((error) => {
          if (error instanceof AppError) {
            reject(error);
          } else if (error?.response?.json) {
            error?.response
              ?.json()
              .then((data: Response) => reject(this.parseError(data)));
          } else if (error) {
            reject(
              this.parseError({
                statusText: error.message,
                errors: [{ userMsg: error.message }],
              } as any),
            );
          } else {
            reject(
              this.parseError({
                statusText: "Unknown",
                errors: [{ userMsg: "Unknown" }],
              } as any),
            );
          }
        });
    });
  }

  protected getImage(url: string, options?: Options): Promise<Blob> {
    return this.request(url, options).then((res) => res.blob());
  }

  protected downloadPdf(
    url: string,
    options?: Options,
    fileName?: string,
  ): Promise<void> {
    return this.request(url, options)
      .then((res) => res.blob())
      .then((blob) => {
        const pdfUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = fileName ? `${fileName}.pdf` : "B.Toifa anketa.pdf"; // fayl nomi
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(pdfUrl);
      });
  }

  protected downloadExcel(
    url: string,
    options?: Options,
    fileName?: string,
  ): Promise<void> {
    return this.request(url, options)
      .then((res) => res.blob())
      .then((blob) => {
        const excelUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = excelUrl;
        link.download = fileName ? `${fileName}.xlsx` : "Ma'lumotlar.xlsx"; // fayl nomi
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(excelUrl);
      });
  }

  private parseError(response: Response): AppError {
    const error = new Error(response.statusText) as AppErrorProps;

    error.status = response?.status;
    // @ts-ignore
    error.data = toCamelCase(response?.errors || []);

    return new AppError(error);
  }

  // Blob (Excel/PDF) yuklab olish uchun
  protected async downloadBlob(url: string, fileName: string, query?: object): Promise<void> {
    const qs = query ? '?' + new URLSearchParams(query as any).toString() : '';
    const fullUrl = `${this.host}/${url}${qs}`;
    const res = await fetch(fullUrl, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
    });
    if (!res.ok) throw new Error('Fayl yuklab olishda xatolik');
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  public get<TData = any>(url: string, options?: Options): Promise<TData> {
    return this.jsonRequest(url, { ...options, method: "get" });
  }

  // To'liq response qaytaradi: { data, meta, success, message }
  protected getWithMeta(url: string, options?: Options): Promise<any> {
    return new Promise((resolve, reject) => {
      this.request(url, { ...options, method: "get" })
        .then((response) => {
          if (response.ok) return response.json().then(resolve);
          return response.json().then((d: any) => reject(this.parseError(d)));
        })
        .catch(reject);
    });
  }

  protected post<TData = any>(url: string, options?: Options): Promise<TData> {
    return this.jsonRequest(url, { ...options, method: "post" });
  }

  protected put<TData = any>(url: string, options?: Options): Promise<TData> {
    return this.jsonRequest(url, { ...options, method: "put" });
  }

  protected patch<TData = any>(url: string, options?: Options): Promise<TData> {
    return this.jsonRequest(url, { ...options, method: "patch" });
  }

  protected delete<TData = any>(
    url: string,
    options?: Options,
  ): Promise<TData> {
    return this.jsonRequest(url, { ...options, method: "delete" });
  }
}
