import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindManyPokemonResponseDto } from './dtos/find-many-pokemon.dto';
import { Pokemon } from './pokemon.entity';
import { PokemonsService } from './pokemons.service';

@Resolver('Pokemons')
export class PokemonsResolver {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Query(() => FindManyPokemonResponseDto)
  findManyPokemon(
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page: number = 1,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number = 10,
  ): Promise<FindManyPokemonResponseDto> {
    return this.pokemonsService.findManyPokemon(page, limit);
  }

  @Mutation(() => Pokemon)
  async createOnePokemon(@Args({ name: 'name', type: () => String }) name: string, @Args({ name: 'type', type: () => String }) type: string) {
    return this.pokemonsService.createOnePokemon(name, type);
  }

  @Mutation(() => Pokemon)
  async updateOnePokemon(
    @Args({ name: 'id', type: () => ID }) id: number,
    @Args({ name: 'name', type: () => String, nullable: true }) name?: string,
    @Args({ name: 'type', type: () => String, nullable: true }) type?: string,
  ) {
    return this.pokemonsService.updateOnePokemon(id, name, type);
  }

  @Mutation(() => Pokemon)
  async deleteOnePokemon(@Args({ name: 'id', type: () => ID }) id: number) {
    return this.pokemonsService.deleteOnePokemon(id);
  }
}
