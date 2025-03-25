import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindManyPokemonResponseDto } from './dtos/find-many-pokemon.dto';
import { SortOrderEnum } from './enums/sort-order.enum';
import { Pokemon } from './pokemon.entity';
import { PokemonsService } from './pokemons.service';

@Resolver('Pokemons')
export class PokemonsResolver {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Query(() => FindManyPokemonResponseDto)
  findManyPokemon(
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page: number = 1,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number = 10,
    @Args('sortField', { type: () => String, nullable: true, defaultValue: 'id' }) sortField: string = 'id',
    @Args('sortOrder', { type: () => SortOrderEnum, nullable: true, defaultValue: SortOrderEnum.ASC }) sortOrder: SortOrderEnum = SortOrderEnum.ASC,
    @Args('name', { type: () => String, nullable: true }) name?: string,
    @Args('type', { type: () => String, nullable: true }) type?: string,
  ): Promise<FindManyPokemonResponseDto> {
    return this.pokemonsService.findManyPokemon(page, limit, sortField, sortOrder, name, type);
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
