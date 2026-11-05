export interface BackendHealthResponse {
  status: 'ok' | 'degraded' | 'error';
  message: string;
  uptime: number;
  timestamp: string;
  database: {
    connected: boolean;
    name: string;
    message: string;
  };
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
