import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BenefitRequest, BenefitRequestStatus } from './entities/benefit-request.entity';
import { Benefit } from '../benefits/entities/benefit.entity';
import { BenefitBalance } from '../benefit-balances/entities/benefit-balance.entity';
import { CreateBenefitRequestDto } from './dto/create-benefit-request.dto';

@Injectable()
export class BenefitRequestsService {
  constructor(
    @InjectRepository(BenefitRequest)
    private readonly requestRepo: Repository<BenefitRequest>,

    @InjectRepository(BenefitBalance)
    private readonly balanceRepo: Repository<BenefitBalance>,

    @InjectRepository(Benefit)
    private readonly benefitRepo: Repository<Benefit>,
  ) {}

  async create(dto: CreateBenefitRequestDto) {
    return this.requestRepo.manager.transaction(async (manager) => {
      const balance = await manager.findOne(BenefitBalance, {
        where: {
          user_id: dto.userId,
          benefit_id: dto.benefitId,
        },
      });

      if (!balance) {
        throw new BadRequestException('No existe balance para este beneficio');
      }

      if (balance.available_days < dto.requestedDays) {
        throw new BadRequestException('No tienes días suficientes');
      }

      const request = manager.create(BenefitRequest, {
        user_id: dto.userId,
        benefit_id: dto.benefitId,
        requested_days: dto.requestedDays,
        start_date: new Date(dto.startDate),
        end_date: dto.endDate ? new Date(dto.endDate) : null,
        status: BenefitRequestStatus.PENDIENTE,
        comment: dto.comment ?? null,
        reviewed_at: null,
      });

      await manager.save(request);
      return request;
    });
  }

  async findByUser(userId: number) {
    return this.requestRepo.find({
      where: { user_id: userId },
      relations: ['benefit'],
      order: { created_at: 'DESC' },
    });
  }

  async findPending() {
    return this.requestRepo.find({
      where: { status: BenefitRequestStatus.PENDIENTE },
      relations: ['benefit'],
      order: { created_at: 'DESC' },
    });
  }

  async updateStatus(
    requestId: number,
    status: BenefitRequestStatus.APROBADO | BenefitRequestStatus.RECHAZADO | BenefitRequestStatus.CANCELADO,
    comment?: string,
  ) {
    return this.requestRepo.manager.transaction(async (manager) => {
      const request = await manager.findOne(BenefitRequest, {
        where: { id: requestId },
      });

      if (!request) {
        throw new NotFoundException('Solicitud no encontrada');
      }

      if (request.status !== BenefitRequestStatus.PENDIENTE) {
        throw new BadRequestException('La solicitud ya fue procesada');
      }

      // SOLO si se aprueba, afecta el balance
      if (status === BenefitRequestStatus.APROBADO) {
        const balance = await manager.findOne(BenefitBalance, {
          where: {
            user_id: request.user_id,
            benefit_id: request.benefit_id,
          },
        });

        if (!balance) {
          throw new NotFoundException('Balance no encontrado');
        }

        if (balance.available_days < request.requested_days) {
          throw new BadRequestException('Balance insuficiente para aprobar');
        }

        balance.used_days += request.requested_days;
        balance.available_days -= request.requested_days;

        await manager.save(balance);
      }

      request.status = status;
      request.comment = comment ?? request.comment ?? null;
      request.reviewed_at = new Date();

      return manager.save(request);
    });
  }
}
