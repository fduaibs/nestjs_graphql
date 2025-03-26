import { IsInt, Min } from 'class-validator';

export class DeleteOnePokemonInputDto {
  @Min(1)
  @IsInt()
  id: number;
}
