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

type UpdateStatusAllowed =
  | BenefitRequestStatus.APROBADO
  | BenefitRequestStatus.RECHAZADO
  | BenefitRequestStatus.CANCELADO;

function isAllowedUpdateStatus(
  status: BenefitRequestStatus,
): status is UpdateStatusAllowed {
  return (
    status === BenefitRequestStatus.APROBADO ||
    status === BenefitRequestStatus.RECHAZADO ||
    status === BenefitRequestStatus.CANCELADO
  );
}

@Controller('benefit-requests')
export class BenefitRequestsController {
  constructor(
    private readonly benefitRequestsService: BenefitRequestsService,
  ) {}

  @Post()
  create(@Body() dto: CreateBenefitRequestDto) {
    return this.benefitRequestsService.create(dto);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.benefitRequestsService.findByUser(Number(userId));
  }

  @Post('update-request-status')
  updateStatus(
    @Body()
    body: {
      id: number;
      status: BenefitRequestStatus;
      comment?: string;
    },
  ) {
    const status = body.status;

    if (!isAllowedUpdateStatus(status)) {
      throw new BadRequestException(
        `Estado inválido. Solo se permite: ${BenefitRequestStatus.APROBADO}, ${BenefitRequestStatus.RECHAZADO}, ${BenefitRequestStatus.CANCELADO}`,
      );
    }

    return this.benefitRequestsService.updateStatus(
      body.id,
      status,
      body.comment,
    );
  }

  @Get('pending')
  findPending() {
    return this.benefitRequestsService.findPending();
  }
}
