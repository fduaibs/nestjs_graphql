import { Query, Resolver } from '@nestjs/graphql';
import { PokemonsService } from './pokemons.service';

@Resolver('Pokemons')
export class PokemonsResolver {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Query('pokemons')
  pokemons() {
    return this.pokemonsService.pokemons();
  }
}
