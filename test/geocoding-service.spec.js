import nock from 'nock';

import { geocodingService, HERE_URL } from '../src/geocoding-service';
import { config } from '../src/config';
import { errors } from '../src/errors';

function mockHEREEndpoint(searchtext, response) {
  const status = response ? 200 : 500;

  nock(HERE_URL)
    .get('')
    .query({
      app_id: config.HERE_APP_ID,
      app_code: config.HERE_APP_CODE,
      responseAttributes: 'none',
      locationAttributes: 'none',
      gen: 9,
      searchtext,
    })
    .reply(status, response);
}

function getHEREValidResponse({ latitude, longitude }) {
  return {
    Response: {
      MetaInfo: {
        Timestamp: '2019-08-09T13:07:12.807+0000',
      },
      View: [
        {
          _type: 'SearchResultsViewType',
          ViewId: 0,
          Result: [
            {
              Relevance: 1,
              MatchLevel: 'postalCode',
              Location: {
                LocationId: 'NT_ORPV4X00oTeuEIKM8lv.GC',
                LocationType: 'area',
                DisplayPosition: {
                  Latitude: latitude,
                  Longitude: longitude,
                },
                NavigationPosition: [
                  {
                    Latitude: latitude,
                    Longitude: longitude,
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  };
}

function getHEREEmptyResponse() {
  return {
    Response: {
      MetaInfo: {
        Timestamp: '2019-08-09T13:07:12.807+0000',
      },
      View: [],
    },
  };
}

describe('The geocoding service', () => {
  afterAll(() => {
    nock.restore();
  });

  it('should get coordinates by zip code', async () => {
    const responseCoords = {
      latitude: 42.56203,
      longitude: -97.82435,
    };

    const zipcode = '502661104';

    mockHEREEndpoint(zipcode, getHEREValidResponse(responseCoords));

    const coords = await geocodingService.getCoordinates(zipcode);

    expect(coords).toMatchObject(responseCoords);
  });

  it('should get coordinates by address', async () => {
    const responseCoords = {
      latitude: 40.02175,
      longitude: -105.25657,
    };

    const address = '2800 Pearl St,Boulder';

    mockHEREEndpoint(address, getHEREValidResponse(responseCoords));

    const coords = await geocodingService.getCoordinates(address);

    expect(coords).toMatchObject(responseCoords);
  });

  it('should return null if no results were found', async () => {
    const zipcode = '999999999';

    mockHEREEndpoint(zipcode, getHEREEmptyResponse());

    const coords = await geocodingService.getCoordinates(zipcode);

    expect(coords).toBeNull();
  });

  it('should handle server errors and return a friendly error', async () => {
    const zipcode = '999999999';

    mockHEREEndpoint(zipcode, null);

    const get = geocodingService.getCoordinates(zipcode);

    expect(get).rejects.toEqual(errors.GEOCODING_SERVER_ERROR);
  });
});
