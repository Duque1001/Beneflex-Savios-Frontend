import { PartialType } from '@nestjs/mapped-types';
import { CreateBenefitRequestDto } from './create-benefit-request.dto';

export class UpdateBenefitRequestDto extends PartialType(CreateBenefitRequestDto) {}
