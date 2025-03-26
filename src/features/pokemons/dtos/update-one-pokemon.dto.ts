import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateOnePokemonInputDto {
  @IsInt()
  @Min(1)
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
