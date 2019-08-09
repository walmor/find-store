import KDBush from 'kdbush';

import { storeRepository } from '../src/store-repository';

const STORES_COUNT = 1791;

const FIRST_STORE = {
  name: 'Crystal',
  location: 'SWC Broadway & Bass Lake Rd',
  address: '5537 W Broadway Ave',
  city: 'Crystal',
  state: 'MN',
  zipcode: '55428-3507',
  coords: {
    latitude: 45.0521539,
    longitude: -93.364854,
  },
  county: 'Hennepin County',
};

const LAST_STORE = {
  name: 'Freeport',
  location: 'SWC SWC Sunrise Hwy & Buffalo St',
  address: '248 Sunrise Hwy',
  city: 'Freeport',
  state: 'NY',
  zipcode: '11520-3943',
  coords: {
    latitude: 40.6555849,
    longitude: -73.5717874,
  },
  county: 'Nassau County',
};

describe('The store repository', () => {
  describe('when initializing', () => {
    afterEach(() => {
      storeRepository.clear();
    });

    it('should load all the stores from the csv file', async () => {
      await storeRepository.init();

      const { index } = storeRepository;

      expect(index.points).toHaveLength(STORES_COUNT);
      expect(index.points[0]).toMatchObject(FIRST_STORE);
      expect(index.points[index.points.length - 1]).toMatchObject(LAST_STORE);
    });

    it('should build the geospatial index', async () => {
      await storeRepository.init();

      const { index } = storeRepository;

      expect(index).toBeInstanceOf(KDBush);
      expect(index.coords).toHaveLength(STORES_COUNT * 2);
    });
  });

  describe('when finding a store', () => {
    beforeAll(async () => {
      await storeRepository.init();
    });

    it('should find a store given an exact coordinate', async () => {
      const { coords } = FIRST_STORE;

      const store = storeRepository.find(coords);

      expect(store.name).toEqual(FIRST_STORE.name);
    });

    it('should find a store given a close coordinate', async () => {
      const coords = {
        longitude: LAST_STORE.coords.longitude - 0.05,
        latitude: LAST_STORE.coords.latitude - 0.03,
      };

      const store = storeRepository.find(coords);

      expect(store.name).toEqual(LAST_STORE.name);
    });

    it('should find a store given a far away coordinate', async () => {
      // Somewhere in Brazil
      const coords = {
        longitude: -45.557849,
        latitude: -23.790977,
      };

      const store = storeRepository.find(coords);

      // Should return some store in Miami, Florida
      expect(store.city).toEqual('Miami');
      expect(store.state).toEqual('FL');
    });
  });
});
