import csv from 'csvtojson';
import KDBush from 'kdbush';
import geokdbush from 'geokdbush';
import path from 'path';

export const storeRepository = {
  async init() {
    const opts = {
      colParser: {
        latitude: 'number',
        longitude: 'number',
      },
      checkType: true,
    };

    const stores = await csv(opts).fromFile(path.join(__dirname, 'stores.csv'));

    this.index = new KDBush(stores, s => s.longitude, s => s.latitude);
  },

  clear() {
    this.index = null;
  },

  find({ longitude, latitude }) {
    return geokdbush.around(this.index, longitude, latitude, 1)[0];
  },
};
