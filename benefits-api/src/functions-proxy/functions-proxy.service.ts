import { Injectable } from '@nestjs/common';

@Injectable()
export class FunctionsProxyService {
  private readonly baseUrl = process.env.FUNCTIONS_BASE_URL ?? '';

  async callFunction(
    path: string,
    token?: string,
    body?: unknown,
  ): Promise<unknown> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}/${path}`, {
      method: body ? 'POST' : 'GET',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Function error ${response.status} ${text}`);
    }

    // por si alguna function responde vacío
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return response.text();
    }

    return response.json();
  }
}
