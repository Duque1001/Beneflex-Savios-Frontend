import { Injectable } from '@nestjs/common';
import { FunctionsClient } from '../functions/functions.client';

@Injectable()
export class BenefitsService {
  private readonly fx = new FunctionsClient();

  getBenefitsForUser(userId: number): Promise<unknown> {
    return this.fx.getUserBenefits(userId);
  }
}
