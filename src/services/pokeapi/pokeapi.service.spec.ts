import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { PokemonInterface } from './pokeapi.interface';
import { PokeapiService } from './pokeapi.service';

describe('PokeapiService', () => {
  let service: PokeapiService;
  let httpService: HttpService;

  beforeEach(async () => {
    const mockHttpService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PokeapiService, { provide: HttpService, useValue: mockHttpService }],
    }).compile();

    service = module.get<PokeapiService>(PokeapiService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPokemonById', () => {
    it('should return a pokemon object when the API call is successful', async () => {
      const mockPokemon: PokemonInterface = {
        name: 'bulbasaur',
        types: [{ type: { name: 'grass', url: 'fake.url.com' }, slot: 1 }],
      };

      const mockResponse = {
        data: mockPokemon,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: {},
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse as any));

      const result = await service.getPokemonById(1);

      expect(httpService.get).toHaveBeenCalledWith('/pokemon/1');
      expect(result).toEqual(mockPokemon);
    });

    it('should throw an error if the API call fails', async () => {
      const errorResponse = new Error('API call failed');

      jest.spyOn(httpService, 'get').mockReturnValueOnce(throwError(() => errorResponse));

      try {
        await service.getPokemonById(1);
      } catch (error) {
        expect(error).toEqual(errorResponse);
      }
    });
  });
});
