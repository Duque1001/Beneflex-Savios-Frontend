import axios, { AxiosInstance } from 'axios';

export class FunctionsClient {
  private readonly http: AxiosInstance;

  constructor() {
    const url = process.env.FUNCTIONS_BASE_URL;
    if (!url) throw new Error('FUNCTIONS_BASE_URL no está definida');

    const baseURL = url.replace(/\/$/, '');

    this.http = axios.create({
      baseURL,
      timeout: 15000,
    });
  }

  async getMe(): Promise<unknown> {
    const r = await this.http.get('/get-me');
    return r.data;
  }

  async getUserBenefits(userId: number): Promise<unknown> {
    const r = await this.http.get('/get-user-benefits', { params: { userId } });
    return r.data;
  }

  async createBenefitRequest(payload: unknown): Promise<unknown> {
    const r = await this.http.post('/create-benefit-request', payload);
    return r.data;
  }

  async getMyRequests(): Promise<unknown> {
    const r = await this.http.get('/get-my-requests');
    return r.data;
  }

  async getPendingRequests(): Promise<unknown> {
    const r = await this.http.get('/get-pending-requests');
    return r.data;
  }

  async updateRequestStatus(payload: unknown): Promise<unknown> {
    const r = await this.http.post('/update-request-status', payload);
    return r.data;
  }
}
