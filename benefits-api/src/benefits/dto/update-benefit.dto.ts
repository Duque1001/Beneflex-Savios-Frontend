import { PartialType } from '@nestjs/mapped-types';
import { BenefitCardDto } from './benefitCard.dto';

export class UpdateBenefitDto extends PartialType(BenefitCardDto) { }
