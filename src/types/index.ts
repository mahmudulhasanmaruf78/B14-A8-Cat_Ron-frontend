export interface BackendHealthResponse {
  success?: boolean;
  status: string;
  message: string;
  uptime?: number;
  timestamp?: string;
  database?: {
    connected: boolean;
    name: string;
    message: string;
  };
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

