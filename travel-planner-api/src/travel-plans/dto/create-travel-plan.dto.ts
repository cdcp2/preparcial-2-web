import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateTravelPlanDto {
  @IsString()
  @Length(3, 3)
  countryCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
