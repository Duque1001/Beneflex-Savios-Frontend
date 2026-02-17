import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FunctionsProxyService {
  constructor(private readonly http: HttpService) {}

  private get baseUrl() {
    const base =
      process.env.FUNCTIONS_BASE_URL || process.env.FUNCTIONS_API_BASE_URL;

    if (!base) {
      throw new Error('Missing environment variable: FUNCTIONS_BASE_URL');
    }
    return base;
  }

  async getMe(auth?: string) {
    const r = await firstValueFrom(
      this.http.get(`${this.baseUrl}/get-me`, {
        headers: auth ? { Authorization: auth } : {},
      }),
    );
    return r.data;
  }

  async getUserBenefits(userId: string, auth?: string) {
    const r = await firstValueFrom(
      this.http.get(`${this.baseUrl}/get-user-benefits`, {
        params: { userId },
        headers: auth ? { Authorization: auth } : {},
      }),
    );
    return r.data;
  }

  async createBenefitRequest(body: any, auth?: string) {
    const r = await firstValueFrom(
      this.http.post(`${this.baseUrl}/create-benefit-request`, body, {
        headers: auth ? { Authorization: auth } : {},
      }),
    );
    return r.data;
  }

  async getMyRequests(userId?: string, auth?: string) {
    const r = await firstValueFrom(
      this.http.get(`${this.baseUrl}/get-my-requests`, {
        params: userId ? { userId } : {},
        headers: auth ? { Authorization: auth } : {},
      }),
    );
    return r.data;
  }

  async getPendingRequests(auth?: string) {
    const r = await firstValueFrom(
      this.http.get(`${this.baseUrl}/get-pending-requests`, {
        headers: auth ? { Authorization: auth } : {},
      }),
    );
    return r.data;
  }

  async updateRequestStatus(body: any, auth?: string) {
    const r = await firstValueFrom(
      this.http.post(`${this.baseUrl}/update-request-status`, body, {
        headers: auth ? { Authorization: auth } : {},
      }),
    );
    return r.data;
  }
}
