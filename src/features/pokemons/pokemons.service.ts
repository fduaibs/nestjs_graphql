import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './pokemon.entity';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonsRepository: Repository<Pokemon>,
  ) {}

  async createOnePokemon(name: string, type: string): Promise<Pokemon> {
    const createdPokemon = this.pokemonsRepository.create({ name, type });

    return await this.pokemonsRepository.save(createdPokemon);
  }

  async updateOnePokemon(id: number, name?: string, type?: string): Promise<Pokemon> {
    const foundPokemon = await this.pokemonsRepository.findOneByOrFail({ id: id });

    const mergedPokemon = this.pokemonsRepository.merge(foundPokemon, { name, type });

    return await this.pokemonsRepository.save(mergedPokemon);
  }

  async deleteOnePokemon(id: number): Promise<Boolean> {
    const deletedData = await this.pokemonsRepository.delete(id);

    return deletedData.affected === 1;
  }

  async findManyPokemon(): Promise<Pokemon[]> {
    const pokemonsFound = await this.pokemonsRepository.find();

    return pokemonsFound;
  }
}
