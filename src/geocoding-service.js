import axios from 'axios';
import { config } from './config';
import { errors } from './errors';

export const HERE_URL = 'https://geocoder.api.here.com/6.2/geocode.json';

export const geocodingService = {
  async getCoordinates(searchtext) {
    const params = {
      app_id: config.HERE_APP_ID,
      app_code: config.HERE_APP_CODE,
      responseAttributes: 'none',
      locationAttributes: 'none',
      gen: 9,
      searchtext,
    };

    try {
      const response = await axios.get(HERE_URL, { params });

      const view = response.data.Response.View;

      if (view && view.length > 0) {
        const pos = view[0].Result[0].Location.DisplayPosition;

        return {
          latitude: pos.Latitude,
          longitude: pos.Longitude,
        };
      }

      return null;
    } catch (err) {
      throw errors.GEOCODING_SERVER_ERROR;
    }
  },
};
