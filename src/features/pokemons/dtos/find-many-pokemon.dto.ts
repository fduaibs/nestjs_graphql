import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Pokemon } from '../pokemon.entity';

@ObjectType()
export class FindManyPokemonResponseDto {
  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => [Pokemon])
  pokemons: Pokemon[];
}
