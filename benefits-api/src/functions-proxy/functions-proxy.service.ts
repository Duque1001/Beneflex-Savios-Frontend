import { Injectable } from '@nestjs/common';

@Injectable()
export class FunctionsProxyService {
  private baseUrl = process.env.FUNCTIONS_BASE_URL!;
  private fxKey = process.env.FUNCTIONS_KEY; // opcional

  async getMe(accessToken: string) {
    const url = `${this.baseUrl}/get-me`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Si proteges Functions con key:
    if (this.fxKey) headers['x-functions-key'] = this.fxKey;

    const r = await fetch(url, { headers });
    if (!r.ok) throw new Error(`Functions get-me failed: ${r.status}`);
    return r.json();
  }
}
