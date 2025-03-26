import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PokeapiService } from '../../services/pokeapi/pokeapi.service';
import { SortOrderEnum } from './enums/sort-order.enum';
import { Pokemon } from './pokemon.entity';
import { PokemonsService } from './pokemons.service';

describe('PokemonsService', () => {
  let service: PokemonsService;
  let pokemonsRepository: Repository<Pokemon>;
  let pokeapiService: PokeapiService;

  beforeEach(async () => {
    const mockPokeapiService = {
      getPokemonById: jest.fn().mockResolvedValue({
        name: 'pikachu',
        types: [{ type: { name: 'electric' } }],
      }),
    };

    const mockPokemonsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOneByOrFail: jest.fn(),
      findOneBy: jest.fn(),
      findAndCount: jest.fn(),
      delete: jest.fn(),
      merge: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonsService,
        { provide: getRepositoryToken(Pokemon), useValue: mockPokemonsRepository },
        { provide: PokeapiService, useValue: mockPokeapiService },
      ],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
    pokemonsRepository = module.get(getRepositoryToken(Pokemon));
    pokeapiService = module.get<PokeapiService>(PokeapiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOnePokemon', () => {
    it('should create and save a new Pokemon', async () => {
      const name = 'pikachu';
      const type = 'electric';

      const mockCreatedPokemon = { name, type };

      jest.spyOn(pokemonsRepository, 'create').mockReturnValue(mockCreatedPokemon as any);
      jest.spyOn(pokemonsRepository, 'save').mockResolvedValue(mockCreatedPokemon as any);

      const result = await service.createOnePokemon(name, type);

      expect(pokemonsRepository.create).toHaveBeenCalledWith({ name, type });
      expect(pokemonsRepository.save).toHaveBeenCalledWith(mockCreatedPokemon);
      expect(result).toEqual(mockCreatedPokemon);
    });
  });

  describe('updateOnePokemon', () => {
    it('should update and save an existing Pokemon', async () => {
      const id = 1;
      const name = 'pikachu';
      const type = 'electric';

      const mockFoundPokemon = { id, name: 'bulbasaur', type: 'grass' };

      jest.spyOn(pokemonsRepository, 'findOneByOrFail').mockResolvedValue(mockFoundPokemon as any);
      jest.spyOn(pokemonsRepository, 'merge').mockReturnValue({ ...mockFoundPokemon, name, type } as Pokemon);
      jest.spyOn(pokemonsRepository, 'save').mockResolvedValue({ id, name, type } as any);

      const result = await service.updateOnePokemon(id, name, type);

      expect(pokemonsRepository.findOneByOrFail).toHaveBeenCalledWith({ id });
      expect(pokemonsRepository.merge).toHaveBeenCalledWith(mockFoundPokemon, { name, type });
      expect(pokemonsRepository.save).toHaveBeenCalledWith({ id, name, type });
      expect(result).toEqual({ id, name, type });
    });
  });

  describe('deleteOnePokemon', () => {
    it('should delete a Pokemon', async () => {
      const id = 1;

      const mockDeleteResponse = { affected: 1 };

      jest.spyOn(pokemonsRepository, 'delete').mockResolvedValue(mockDeleteResponse as any);

      const result = await service.deleteOnePokemon(id);

      expect(pokemonsRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });

    it('should return false if Pokemon is not found', async () => {
      const id = 1;

      const mockDeleteResponse = { affected: 0 };

      jest.spyOn(pokemonsRepository, 'delete').mockResolvedValue(mockDeleteResponse as any);

      const result = await service.deleteOnePokemon(id);

      expect(pokemonsRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toBe(false);
    });
  });

  describe('findManyPokemon', () => {
    it('should return paginated list of pokemons', async () => {
      const page = 1;
      const limit = 10;
      const sortField = 'name';
      const sortOrder = SortOrderEnum.ASC;
      const name = 'pikachu';

      const mockPokemons = [{ id: 1, name: 'pikachu', type: 'electric', created_at: '2025-03-26 06:29:20', updated_at: '2025-03-26 06:29:20' }];
      const mockTotalCount = 1;

      jest.spyOn(pokemonsRepository, 'findAndCount').mockResolvedValue([mockPokemons, mockTotalCount]);

      const result = await service.findManyPokemon(page, limit, sortField, sortOrder, name);

      expect(pokemonsRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { [sortField]: sortOrder },
        where: { name: Like(`%${name}%`) },
      });
      expect(result).toEqual({
        totalCount: mockTotalCount,
        totalPages: 1,
        currentPage: page,
        pokemons: mockPokemons,
      });
    });
  });

  describe('importPokemonById', () => {
    it('should import a pokemon if not exists', async () => {
      const id = 1;

      const mockFetchedPokemon = { name: 'pikachu', types: [{ type: { name: 'electric' } }] };
      const mockCreatedPokemon = { id, name: 'pikachu', type: 'electric' };

      jest.spyOn(pokeapiService, 'getPokemonById').mockResolvedValue(mockFetchedPokemon as any);
      jest.spyOn(pokemonsRepository, 'create').mockReturnValue(mockCreatedPokemon as any);
      jest.spyOn(pokemonsRepository, 'save').mockResolvedValue(mockCreatedPokemon as any);
      jest.spyOn(pokemonsRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.importPokemonById(id);

      expect(pokeapiService.getPokemonById).toHaveBeenCalledWith(id);
      expect(pokemonsRepository.create).toHaveBeenCalledWith({ id, name: 'pikachu', type: 'electric' });
      expect(pokemonsRepository.save).toHaveBeenCalledWith(mockCreatedPokemon);
      expect(result).toEqual(mockCreatedPokemon);
    });

    it('should update a pokemon if exists', async () => {
      const id = 1;

      const mockFetchedPokemon = { name: 'pikachu', types: [{ type: { name: 'electric', url: 'mock.url.com' }, slot: 1 }] };
      const mockFoundPokemon = { id, name: 'bulbasaur', type: 'grass', created_at: '2025-03-26 06:29:20', updated_at: '2025-03-26 06:29:20' };
      const mockUpdatedPokemon = { id, name: 'pikachu', type: 'electric' };
      const name = mockFetchedPokemon.name;
      const type = mockFetchedPokemon.types[0].type.name;

      jest.spyOn(pokeapiService, 'getPokemonById').mockResolvedValue(mockFetchedPokemon as any);
      jest.spyOn(pokemonsRepository, 'findOneBy').mockResolvedValue(mockFoundPokemon as any);
      jest.spyOn(pokemonsRepository, 'merge').mockReturnValue(mockUpdatedPokemon as any);
      jest.spyOn(pokemonsRepository, 'save').mockResolvedValue(mockUpdatedPokemon as any);

      const result = await service.importPokemonById(id);

      expect(pokeapiService.getPokemonById).toHaveBeenCalledWith(id);
      expect(pokemonsRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(pokemonsRepository.merge).toHaveBeenCalledWith(mockFoundPokemon, { name, type });
      expect(pokemonsRepository.save).toHaveBeenCalledWith(mockUpdatedPokemon);
      expect(result).toEqual(mockUpdatedPokemon);
    });
  });
});
