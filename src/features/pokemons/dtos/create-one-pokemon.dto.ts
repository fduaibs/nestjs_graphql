import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOnePokemonInputDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
