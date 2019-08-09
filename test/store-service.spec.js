import { storeService } from '../src/store-service';
import { errors } from '../src/errors';
import { geocodingService } from '../src/geocoding-service';
import { storeRepository } from '../src/store-repository';

describe('The store service', () => {
  describe('when validating the input', () => {
    const validate = input => () => storeService.validate(input);

    it('should throw error if no params are given', () => {
      const input = undefined;

      expect(validate(input)).toThrowError(errors.ADDRESS_OR_ZIPCODE_REQUIRED);
    });

    it('should throw error if neither the address or the zip code are given', () => {
      const input = { othervalue: 'test' };

      expect(validate(input)).toThrowError(errors.ADDRESS_OR_ZIPCODE_REQUIRED);
    });

    it('should throw error if both the address or the zip code are given', () => {
      const input = { address: 'some-address', zip: '88888' };

      expect(validate(input)).toThrowError(errors.ADDRESS_OR_ZIPCODE_REQUIRED);
    });

    it('should throw error if the zip code is not numeric', () => {
      const input = { zip: 'not-a-number' };

      expect(validate(input)).toThrowError(errors.INVALID_ZIPCODE);
    });

    it('should throw error if the the units is neither "mi" or "km"', () => {
      const input = { zip: '88888', units: 'meters' };

      expect(validate(input)).toThrowError(errors.INVALID_UNITS);
    });

    it('should clean up the zip code', () => {
      const input = { zip: '8888-888' };

      const { search } = storeService.validate(input);

      expect(search).toEqual('8888888');
    });

    it('should default to miles if the units param is not given', () => {
      const input = { address: '120 W Parker Rd' };

      const { units } = storeService.validate(input);

      expect(units).toEqual('mi');
    });
  });

  describe('when finding the closest store', () => {
    function mockGeocodingService(coords) {
      return jest
        .spyOn(geocodingService, 'getCoordinates')
        .mockImplementationOnce(() => coords);
    }

    function mockStoreRepository(store) {
      return jest
        .spyOn(storeRepository, 'find')
        .mockImplementationOnce(() => store);
    }

    it('should validate the input', async () => {
      const validate = jest.spyOn(storeService, 'validate');

      const input = { zip: '88888' };

      const coords = { latitude: 0, longitude: 0 };

      mockGeocodingService(coords);
      mockStoreRepository({ coords });

      await storeService.closest(input);

      expect(validate).toHaveBeenCalledWith(input);
    });

    it('should throw error if no coordinates were found', async () => {
      const input = { zip: '88888' };

      const coords = null;

      mockGeocodingService(coords);

      const closest = storeService.closest(input);

      await expect(closest).rejects.toEqual(errors.STORE_NOT_FOUND);
    });

    it('should return the store', async () => {
      const input = { zip: '88888' };

      const coords = { latitude: 0, longitude: 0 };
      const expectedStore = { coords };

      mockGeocodingService(coords);
      mockStoreRepository(expectedStore);

      const { store } = await storeService.closest(input);

      expect(store).toEqual(expectedStore);
    });

    it('should return the distance in miles', async () => {
      const input = { zip: '88888', units: 'mi' };

      const coords = { latitude: 42.59484, longitude: -78.67021 };
      const store = {
        coords: { latitude: 42.7923981, longitude: -78.7831571 },
      };

      mockGeocodingService(coords);
      mockStoreRepository(store);

      const { distance, units } = await storeService.closest(input);

      expect(distance).toBeCloseTo(14.8228);
      expect(units).toEqual(input.units);
    });

    it('should return the distance in kilometers', async () => {
      const input = { zip: '88888', units: 'km' };

      const coords = { latitude: 42.59484, longitude: -78.67021 };
      const store = {
        coords: { latitude: 42.7923981, longitude: -78.7831571 },
      };

      mockGeocodingService(coords);
      mockStoreRepository(store);

      const { distance, units } = await storeService.closest(input);

      expect(distance).toBeCloseTo(23.855);
      expect(units).toEqual(input.units);
    });
  });
});
