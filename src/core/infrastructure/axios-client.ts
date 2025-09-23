import {
  CustomInternalAxiosRequestConfig,
  RequestConfig,
  ResponseAPI,
} from "@/core/interfaces/api.interface";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ApiErrorHandler } from "../helpers/error-handler";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/presentation/context/auth.store";

interface AxiosConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

const DEFAULT_CONFIG: AxiosConfig = {
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://backend-cementerio-pillaro.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
};

class AxiosClient {
  private axiosInstance: AxiosInstance;

  private constructor(config: AxiosConfig = DEFAULT_CONFIG) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.headers,
    });

    this.setupAuthInterceptor();
    this.setupErrorHandling();
  }

  static getInstance(config?: AxiosConfig): AxiosClient {
    return new AxiosClient(config);
  }

  private setupAuthInterceptor() {
    this.axiosInstance.interceptors.request.use(
      async (config: CustomInternalAxiosRequestConfig) => {
        if (config?.skipAuth) return config;

        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      }
    );
  }

  private setupErrorHandling() {
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const apiError = ApiErrorHandler.handle(error);
        
        // Only show toast in client-side environments
        if (typeof window !== 'undefined') {
          toast.error(apiError.message, {
            description: Array.isArray(apiError.errors)
              ? apiError.errors.join("\n")
              : apiError.errors || "",
          });
        }
        
        return Promise.reject(apiError);
      }
    );
  }

  getUri(config?: RequestConfig): string {
    return this.axiosInstance.getUri(config);
  }

  request<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    config: RequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.request(config);
  }

  get<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    config?: RequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.get(url, config);
  }

  delete<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    config?: RequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.delete(url, config);
  }

  head<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    config?: RequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.head(url, config);
  }

  options<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    config?: RequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.options(url, config);
  }

  post<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.post(url, data, config);
  }

  put<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.put(url, data, config);
  }

  patch<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.patch(url, data, config);
  }

  postForm<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.postForm(url, data, config);
  }

  putForm<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.putForm(url, data, config);
  }

  patchForm<T, R = AxiosResponse<ResponseAPI<T>>, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.patchForm(url, data, config);
  }
}

export default AxiosClient;
