export interface SubmitRequest<T> {
  model: T;
  callback: (result: { error: boolean; message?: string }) => void;
}