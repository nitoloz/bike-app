# Coding Challenge for [COBI.Bike](https://cobi.bike/) (November 2018)
Web application that allows user to find a bike on a map and rent it
![Bikes Map](/docs/screenshot-1.PNG)

## Task
Your goal is to create a simple bike sharing service with a frontend web application.
### Frontend: 
* Display a map of bicycles that are available for rent. Already rented bikes are grayed out. 
* Clicking on an icon will open a popup displaying bicycle name and status. 
* Clicking the "Rent bike" button will mark the bike as unavailable in the system. If the user opens the dialog again, he will be able to click on a "Return bike" button to make it available for rent again. 

### Server side: 
The backend should provide API endpoints to retrieve and manage bicycle renting. 
* Differentiate between users using sessions 
* Create an endpoint to retrieve all bicycles and their necessary information for the frontend application. 
* Create an endpoint to rent a bicycle. A user who currently rents a bike should not be able to rent a second bicycle at the same time. 
* Create an endpoint to return a bicycle. A user shouldn't be able to return a bicycle that he hasn't rented. 
* Sample data: 

| id  | name | latitude | longitude | rented |
| - | - | - | - | - |
| 0 | "Henry"  | 50.119504 | 8.638137 | false |
| 1 | "Hans"  | 50.119229 | 8.640020 | false |
| 2 | "Thomas"  | 50.120452 | 8.650507 | false |

### Further information: 
* Choose your favorite language, frameworks and tools for the frontend and backend application. 
* It is up to you to use a database for storage. 
* Use version control. 
* There should be no references to COBI.Bike in the code. 

Upload your final code to Github and make it available to COBI.Bike for us to check out! 

## Solution
### Frontend
Web application is based on Angular version 8.0.0, developed with Typescript and built by webpack-based [Angular CLI](https://github.com/angular/angular-cli).

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
* Goto project root folder and run `npm i`
* Prepare google account credentials

### Running application
* Goto project root folder and run `npm run start` to start a dev server. 
* Open `http://localhost:4200/` in browser.
