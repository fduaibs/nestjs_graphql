import { Injectable } from '@nestjs/common';

@Injectable()
export class PokemonsService {
  constructor() {}

  async pokemons() {
    return 'Pokemons World!';
  }
}
