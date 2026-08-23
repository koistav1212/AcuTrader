export interface ApiResponse<T> {
  success: boolean;
  data: T;
  source?: string;
  cached?: boolean;
  updatedAt?: string;
  error?: string | null;
}
