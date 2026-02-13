import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { BenefitRequestsService } from './benefit-requests.service';
import { CreateBenefitRequestDto } from './dto/create-benefit-request.dto';
import { BenefitRequestStatus } from './entities/benefit-request.entity';

const ALLOWED_UPDATE_STATUSES = [
  BenefitRequestStatus.APROBADO,
  BenefitRequestStatus.RECHAZADO,
  BenefitRequestStatus.CANCELADO,
] as const;

type UpdateStatusAllowed = (typeof ALLOWED_UPDATE_STATUSES)[number];

function parseAndValidateUpdateStatus(input: unknown): UpdateStatusAllowed {
  if (typeof input !== 'string') {
    throw new BadRequestException('El campo "status" debe ser un string.');
  }

  const normalized = input.trim().toUpperCase();

  // ✅ acepta EN/ES desde el front o desde Postman
  const map: Record<string, UpdateStatusAllowed> = {
    // español
    APROBADO: BenefitRequestStatus.APROBADO,
    RECHAZADO: BenefitRequestStatus.RECHAZADO,
    CANCELADO: BenefitRequestStatus.CANCELADO,

    // inglés
    APPROVED: BenefitRequestStatus.APROBADO,
    REJECTED: BenefitRequestStatus.RECHAZADO,
    CANCELLED: BenefitRequestStatus.CANCELADO,
    CANCELED: BenefitRequestStatus.CANCELADO, // por si llega con una L
  };

  const parsed = map[normalized];
  if (!parsed) {
    throw new BadRequestException(
      `Estado inválido: "${input}". Solo se permite: APROBADO/RECHAZADO/CANCELADO (o APPROVED/REJECTED/CANCELLED).`,
    );
  }

  return parsed;
}

@Controller('benefit-requests')
export class BenefitRequestsController {
  constructor(private readonly benefitRequestsService: BenefitRequestsService) {}

  @Post()
  create(@Body() dto: CreateBenefitRequestDto) {
    return this.benefitRequestsService.create(dto);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    const id = Number(userId);
    if (Number.isNaN(id)) {
      throw new BadRequestException('userId inválido');
    }
    return this.benefitRequestsService.findByUser(id);
  }

  @Post('update-request-status')
  updateStatus(
    @Body()
    body: {
      id: number;
      status: unknown; // 👈 importante (viene del body, TS no debe asumir)
      comment?: string;
    },
  ) {
    if (typeof body?.id !== 'number') {
      throw new BadRequestException('El campo "id" debe ser numérico.');
    }

    const status = parseAndValidateUpdateStatus(body.status);

    return this.benefitRequestsService.updateStatus(body.id, status, body.comment);
  }

  @Get('pending')
  findPending() {
    return this.benefitRequestsService.findPending();
  }
}
