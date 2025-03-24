import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Pokemon } from './pokemon.entity';
import { PokemonsService } from './pokemons.service';

@Resolver('Pokemons')
export class PokemonsResolver {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Query(() => [Pokemon])
  findManyPokemon() {
    return this.pokemonsService.findManyPokemon();
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
