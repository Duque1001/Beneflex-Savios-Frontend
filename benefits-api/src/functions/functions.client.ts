import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FunctionsClient {
  private readonly http: AxiosInstance;

  constructor() {
    const url =
      process.env.FUNCTIONS_BASE_URL || process.env.FUNCTIONS_API_BASE_URL;

    if (!url) {
      throw new Error('FUNCTIONS_BASE_URL no está definida');
    }

    const baseURL = url.replace(/\/$/, '');

    this.http = axios.create({
      baseURL,
      timeout: 15000,
    });
  }

  private authHeaders(auth?: string) {
    return auth ? { Authorization: auth } : {};
  }

  async getMe(auth?: string): Promise<any> {
    const r: AxiosResponse<any> = await this.http.get('/get-me', {
      headers: this.authHeaders(auth),
    });
    return r.data;
  }

  async getUserBenefits(userId: number, auth?: string): Promise<any> {
    const r: AxiosResponse<any> = await this.http.get('/get-user-benefits', {
      params: { userId },
      headers: this.authHeaders(auth),
    });
    return r.data;
  }

  async createBenefitRequest(payload: any, auth?: string): Promise<any> {
    const r: AxiosResponse<any> = await this.http.post(
      '/create-benefit-request',
      payload,
      { headers: this.authHeaders(auth) },
    );
    return r.data;
  }

  async getMyRequests(auth?: string): Promise<any> {
    const r: AxiosResponse<any> = await this.http.get('/get-my-requests', {
      headers: this.authHeaders(auth),
    });
    return r.data;
  }

  async getPendingRequests(auth?: string): Promise<any> {
    const r: AxiosResponse<any> = await this.http.get('/get-pending-requests', {
      headers: this.authHeaders(auth),
    });
    return r.data;
  }

  async updateRequestStatus(payload: any, auth?: string): Promise<any> {
    const r: AxiosResponse<any> = await this.http.post(
      '/update-request-status',
      payload,
      { headers: this.authHeaders(auth) },
    );
    return r.data;
  }
}
