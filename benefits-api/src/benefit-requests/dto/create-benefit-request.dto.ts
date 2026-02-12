import {
  IsInt,
  IsDateString,
  IsOptional,
  Min,
  IsNumber,
} from 'class-validator';

export class CreateBenefitRequestDto {
  @IsInt()
  userId: number;

  @IsInt()
  benefitId: number;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsNumber()
  @Min(0.5)
  requestedDays: number;

  @IsOptional()
  comment?: string;
}
