export type UserStatus = 'active' | 'pending' | 'suspended' | 'deleted';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  roles: string[];
  emailConfirmed: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Session {
  id: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  lastActivityAt?: string;
}

export interface LoginHistoryEntry {
  id: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'locked_out';
  failureReason?: string;
  createdAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface MFASetupResponse {
  secret: string;
  qrCodeUri: string;
}
