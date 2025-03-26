import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SortOrderEnum } from '../enums/sort-order.enum';
import { Pokemon } from '../pokemon.entity';

export class FindManyPokemonInputDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortField?: string = 'id';

  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortOrder?: SortOrderEnum = SortOrderEnum.ASC;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
export class FindManyPokemonResponseDto {
  totalCount: number;

  totalPages: number;

  currentPage: number;

  pokemons: Pokemon[];
}
