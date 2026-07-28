// Shape of the backend `/vqa` response.
export interface VqaResponse {
  answer: string;
  query_id: string;
  result?: string;
  error?: string;
  [key: string]: unknown;
}
