import { BadRequest, NotFound } from 'http-errors';

export const errors = {
  ADDRESS_OR_ZIPCODE_REQUIRED: new BadRequest(
    'Inform either the address or the zip query string param.',
  ),
  INVALID_UNITS: new BadRequest(
    "The units param should be either 'mi' or 'km'.",
  ),
  INVALID_ZIPCODE: new BadRequest('The zip code should be a numeric value.'),
  STORE_NOT_FOUND: new NotFound('No store found for the given input.'),
  GEOCODING_SERVER_ERROR: new BadRequest(
    'Error getting the response from the geocoding service.',
  ),
};
