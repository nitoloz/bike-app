# BikeApp
Web application that allows user to find a bike on a map and rent it

## Technical description
### Frontend
Web application is based on Angular version 7.0.0, developed with Typescript and built by webpack-based [Angular CLI](https://github.com/angular/angular-cli).

Map is integrated using the [Google Maps Platform](https://cloud.google.com/maps-platform/). Every bike is represented on a map with either a blue (in case it's available) or greyed (in case it's rented) bike image that is based on [Markers](https://developers.google.com/maps/documentation/javascript/markers).

Every marker on the map is clickable and opens on click window with a short summary about the bike using the [InfoWindow](https://developers.google.com/maps/documentation/javascript/infowindows). Depending on the bike status (rented/available) text in the InfoWindow may vary.

## Development server
### Prerequisites
* Install nodejs and npm
* Goto `\BikeApp` folder and run `npm i`
* Prepare google account credentials

### Running application
* Goto `\BikeApp` folder and run `ng serve` for a dev server. 
* Navigate to `http://localhost:4200/`.
