import axios from 'axios';

export class FunctionsClient {
  private baseUrl: string;

  constructor() {
    const url = process.env.FUNCTIONS_BASE_URL;
    if (!url) throw new Error('FUNCTIONS_BASE_URL no está definida');
    this.baseUrl = url.replace(/\/$/, '');
  }

  async getMe() {
    const r = await axios.get(`${this.baseUrl}/get-me`);
    return r.data;
  }

  async getUserBenefits(userId: number) {
    const r = await axios.get(`${this.baseUrl}/get-user-benefits`, {
      params: { userId },
    });
    return r.data;
  }

  async createBenefitRequest(payload: any) {
    const r = await axios.post(`${this.baseUrl}/create-benefit-request`, payload);
    return r.data;
  }

  async getMyRequests() {
    const r = await axios.get(`${this.baseUrl}/get-my-requests`);
    return r.data;
  }

  async getPendingRequests() {
    const r = await axios.get(`${this.baseUrl}/get-pending-requests`);
    return r.data;
  }

  async updateRequestStatus(payload: any) {
    const r = await axios.post(`${this.baseUrl}/update-request-status`, payload);
    return r.data;
  }
}