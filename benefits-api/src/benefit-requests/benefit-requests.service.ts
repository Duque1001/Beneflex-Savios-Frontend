import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BenefitRequest } from './entities/benefit-request.entity';
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
    return await this.requestRepo.manager.transaction(async (manager) => {
      // 1. Buscar balance del usuario
      const balance = await manager.findOne(BenefitBalance, {
        where: {
          user_id: dto.userId,
          benefit_id: dto.benefitId,
        },
      });

      if (!balance) {
        throw new Error('No existe balance para este beneficio');
      }

      if (balance.available_days < dto.requestedDays) {
        throw new Error('No tienes días suficientes');
      }

      // 2. Crear solicitud
      const request = manager.create(BenefitRequest, {
        user_id: dto.userId,
        benefit_id: dto.benefitId,
        requested_days: dto.requestedDays,
        start_date: new Date(dto.startDate),
        end_date: dto.endDate ? new Date(dto.endDate) : null,
        status: 'PENDING',
        comment: dto.comment,
        created_at: new Date(),
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

  async updateStatus(requestId: number, status: 'APPROVED' | 'REJECTED') {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('La solicitud ya fue procesada');
    }

    // SOLO si se aprueba, afecta el balance
    if (status === 'APPROVED') {
      const balance = await this.balanceRepo.findOne({
        where: {
          user_id: request.user_id,
          benefit_id: request.benefit_id,
        },
      });

      if (!balance) {
        throw new NotFoundException('Balance no encontrado');
      }

      balance.used_days += request.requested_days;
      balance.available_days -= request.requested_days;

      await this.balanceRepo.save(balance);
    }

    // SI SE RECHAZA → DEVOLVER DÍAS
    if (status === 'REJECTED') {
      const balance = await this.balanceRepo.findOne({
        where: {
          user_id: request.user_id,
          benefit_id: request.benefit_id,
        },
      });

      if (!balance) {
        throw new NotFoundException('Balance no encontrado');
      }

      balance.available_days += request.requested_days;
      await this.balanceRepo.save(balance);
    }

    request.status = status;
    request.reviewed_at = new Date();

    return this.requestRepo.save(request);
  }

  /*  async findPending() {
    console.log('ENTRÓ A findPending');
    return this.requestRepo.find();
  }*/

  async findPending() {
    return this.requestRepo.find({
      where: { status: 'PENDING' },
      relations: ['benefit'],
      order: { created_at: 'DESC' },
    });
  }
}
