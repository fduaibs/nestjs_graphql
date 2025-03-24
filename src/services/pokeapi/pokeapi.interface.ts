export interface PokemonInterface {
  name: string;
  types: PokemonTypes[];
}

interface PokemonTypes {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}
