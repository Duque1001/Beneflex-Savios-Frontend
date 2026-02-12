import { Injectable } from '@nestjs/common';
import { FunctionsClient } from '../functions/functions.client';

@Injectable()
export class BenefitsService {
  private fx = new FunctionsClient();

  async getBenefitsForUser(userId: number, year: number) {
    // (year lo ignoras si tu function no lo necesita)
    return this.fx.getUserBenefits(userId);
  }
}