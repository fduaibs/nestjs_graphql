import { IsInt, Min } from 'class-validator';

export class ImportPokemonByIdInputDto {
  @IsInt()
  @Min(1)
  id: number;
}
