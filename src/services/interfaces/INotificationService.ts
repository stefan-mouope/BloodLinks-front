export interface INotificationService {
  requestPermission(): Promise<void>;
  getToken(): Promise<string | null>;
  sendTokenToServer(token: string, userId: number | null): Promise<void>; 
}
