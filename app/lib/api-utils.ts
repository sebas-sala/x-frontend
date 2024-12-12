import { toast } from "sonner";
import type {
  ApiResponse,
  ApiResponseError,
  ApiResponseList,
  ApiResponseListUnion,
  ApiResponseUnion,
  Filter,
} from "~/types";

export async function apiFetch<T>(
  url: string | URL,
  options: RequestInit,
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json();

    throw new ApiError(error);
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  } else {
    return {} as T;
  }
}

export async function handleApiFetchError<T>(
  fetch: Promise<T>,
): Promise<T | { error: ApiResponseError; status: number }> {
  try {
    return await fetch;
  } catch (error) {
    if (error instanceof ApiError) {
      toast.error(error.message);
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An error occurred");
    }

    throw error;
  }
}

export function isApiResponse<T>(
  response: ApiResponseUnion<T>,
): response is ApiResponse<T> {
  return (response as ApiResponse<T>).data !== undefined && response.success;
}

export function isApiResponseError<T>(
  response: ApiResponseUnion<T>,
): response is ApiResponseError {
  return (response as ApiResponseError).error !== undefined;
}

export function isApiResponseList<T>(
  response: ApiResponseListUnion<T>,
): response is ApiResponseList<T> {
  return (response as ApiResponseList<T>).data !== undefined;
}

export function isApiResponseListError<T>(
  response: ApiResponseUnion<T>,
): response is ApiResponseError {
  return (response as ApiResponseError).error !== undefined;
}

export function handleApiError(err: unknown) {
  if (err instanceof ApiError) {
    return {
      error: err,
      status: err.status,
    };
  } else if (err instanceof Error) {
    return {
      error: {
        error: err.message,
        message: err.message,
      },
      status: 500,
    };
  } else {
    return {
      error: {
        error: "An error occurred",
        message: "An error occurred",
      },
      status: 500,
    };
  }
}

export async function setSearchParams(url: URL, params: Filter): Promise<URL> {
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });

  return url;
}

export class ApiError extends Error {
  path: string;
  status: number;
  success: boolean;
  error: string;
  message: string;
  timestamp: string;

  constructor(error: ApiResponseError) {
    super(error.message);
    this.name = "ApiError";
    this.path = error.path;
    this.status = error.status;
    this.success = error.success;
    this.message = error.message;
    this.error = error.error;
    this.timestamp = error.timestamp;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}
