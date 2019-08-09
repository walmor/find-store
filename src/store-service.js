import { getDistance, convertDistance } from 'geolib';

import { geocodingService } from './geocoding-service';
import { storeRepository } from './store-repository';
import { errors } from './errors';

export const storeService = {
  async closest(input) {
    const { search, units } = this.validate(input);

    const coords = await geocodingService.getCoordinates(search);

    if (!coords) {
      throw errors.STORE_NOT_FOUND;
    }

    const store = storeRepository.find(coords);

    const distance = convertDistance(getDistance(coords, store.coords), units);

    return { store, distance, units };
  },

  validate(input) {
    if (!input) {
      throw errors.ADDRESS_OR_ZIPCODE_REQUIRED;
    }

    const { address, zip, units = 'mi' } = input;

    if ((!address && !zip) || (address && zip)) {
      throw errors.ADDRESS_OR_ZIPCODE_REQUIRED;
    }

    if (units !== 'mi' && units !== 'km') {
      throw errors.INVALID_UNITS;
    }

    let zipcode = zip;

    if (zipcode) {
      zipcode = zipcode.replace('-', '');

      if (!/^\d+$/.test(zipcode)) {
        throw errors.INVALID_ZIPCODE;
      }
    }

    return { search: address || zipcode, units };
  },
};
