# Find the nearest store

This is a simple example API to find the nearest store given an address or a zipcode. The problem can be broken down in two parts, geocoding and spatial index.

## Geocoding

The first step to solve the problem is to use a geocoding service to get the coordinates (latitude and longitude) of a given address or zipcode.

There are multiple geocoding services available, probably the most famous is the [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/start), but for this project, I'm using the [HERE Geocoder API](https://developer.here.com/documentation/geocoder).

The service will take the address or zipcode as input and will return, among other things, the coordinates that we need for the next step.

## Spatial index

The second step is to query a predefined dataset to find the nearest store to the coordinates obtained from the previous step. To do that efficiently, we need to build a spatial index, otherwise, we would have to scan to whole dataset every time.

As this is just a simple test, and we don't have a big dataset (less than 2000 stores), I'm loading the CSV file and building that index on memory, using the [kdbush libray](https://github.com/mourner/kdbush) which creates the index based on a flat KD-tree.

To find the nearest store, I'm using the [geokdbush library](https://github.com/mourner/geokdbush), a kdbush extension which provides a method to return the closest points from a given location, based on a kdbush index.

In a production environment with a large dataset, we would need a database to persist the stores. In this case, the idea is still the same, creating a spatial index, but that should be supported by the database. If using Postgres, for example, we could use [PostGIS](http://postgis.net/) which is spatial database extender for PostgreSQL.

## Live Demo

A live demo could be found here:

https://findstore-demo.herokuapp.com/

## Running the project locally

After cloning the project, first install the dependencies:

```bash
npm install
```

To run the project in your local machine, you're going to need a [HERE account](https://developer.here.com). Create an .env file inside of the `src/config` directory, following the structure of the `.env.example` file, using the APP ID and APP CODE that you can find on your HERE dashboard.

Then, simply start the project:

```bash
npm start
```

## Running the tests

To run the tests, HERE credentials are not required. Just run:

```bash
npm test
```
