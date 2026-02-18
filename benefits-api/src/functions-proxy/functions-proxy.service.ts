import { Injectable } from '@nestjs/common';

@Injectable()
export class FunctionsProxyService {
  private baseUrl = process.env.FUNCTIONS_BASE_URL!;

  async callFunction(path: string, token: string, body?: any) {
    const response = await fetch(`${this.baseUrl}/${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Function error ${response.status}`);
    }

    return response.json();
  }
}
