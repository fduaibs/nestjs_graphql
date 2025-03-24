import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PokemonInterface } from './pokeapi.interface';

@Injectable()
export class PokeapiService {
  constructor(private readonly httpService: HttpService) {}

  async getPokemonById(id: number): Promise<PokemonInterface> {
    const { data } = await firstValueFrom(this.httpService.get<PokemonInterface>(`/pokemon/${id}`));

    return data;
  }
}
