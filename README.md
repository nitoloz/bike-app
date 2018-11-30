# BikeApp
Web application that allows user to find a bike on a map and rent it
![GitHub Logo](/docs/screenshot-1.PNG)

## Technical description
### Frontend
Web application is based on Angular version 7.0.0, developed with Typescript and built by webpack-based [Angular CLI](https://github.com/angular/angular-cli).

Map is integrated using the [Google Maps Platform](https://cloud.google.com/maps-platform/). Every bike is represented on a map with either a blue (in case it's available) or greyed (in case it's rented) bike image that is based on [Markers](https://developers.google.com/maps/documentation/javascript/markers).

Every marker on the map is clickable and opens on click window with a short summary about the bike using the [InfoWindow](https://developers.google.com/maps/documentation/javascript/infowindows). Depending on the bike status (rented/available) text in the InfoWindow may vary. User is able to rent only 1 bike per session (session is unlimited).

Before start using the application one should login using the google account that acts as a user identifier (more precisely - gmail). Authorization is provided by means of [Firebase Signin](https://firebase.google.com/docs/auth/web/google-signin).

### Server side
Backend is based on a [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore/) while integration with a frontend part is done using official [Angular library for Firebase](https://github.com/angular/angularfire2/).

Firestore includes 2 collections: `Users` and `Bikes`. 

Bikes collection represents all available bikes, where every object stores name, location and status of the bike. Bike object has randomly generated ID and following strucure:
``` javascript
{
  name: string;
  location: Geopoint; //includes latitude and logitude
  rented: boolean;
}
```

Users collection reprents all bikes users, where every object stores name (google account display name) and information about the last rent: time, bike id, bike name. User object has following strucure:
``` javascript
{
  name: string;
  rentStartTime: number;
  rentedBikeId: string;
  rentedBikeName: string;
}
```
 

## Development server
### Prerequisites
* Install nodejs and npm
* Goto `\BikeApp` folder and run `npm i`
* Prepare google account credentials

### Running application
* Goto `\BikeApp` folder and run `ng serve` for a dev server. 
* Navigate to `http://localhost:4200/`.
