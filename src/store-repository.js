import csv from 'csvtojson';
import KDBush from 'kdbush';
import geokdbush from 'geokdbush';
import path from 'path';

export const storeRepository = {
  async init() {
    const opts = {
      colParser: {
        'coords.latitude': 'number',
        'coords.longitude': 'number',
      },
      checkType: true,
    };

    const stores = await csv(opts).fromFile(path.join(__dirname, 'stores.csv'));

    this.index = new KDBush(
      stores,
      s => s.coords.longitude,
      s => s.coords.latitude,
    );
  },

  clear() {
    this.index = null;
  },

  find({ longitude, latitude }) {
    return geokdbush.around(this.index, longitude, latitude, 1)[0];
  },
};
