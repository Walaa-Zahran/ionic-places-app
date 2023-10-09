import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, delay, map, switchMap, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// [
//   new Place(
//     'p1',
//     'Manhattan Mansion',
//     'In the heart of new york city',
//     'https://thumbs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', 149.99,
//     new Date('2019-01-01'),
//     new Date('2019-01-02'),
//     'abc'

//   ),
//   new Place(
//     'p2',
//     'L\'Amour Toujours',
//     'A romantic place in Paris',
//     'https://www.meandhimphotography.com/cache/images/677x_a13099a06c902e9d9c7051e350fb8465.jpg',
//     189.99,
//     new Date('2019-01-01'),
//     new Date('2019-01-02'),
//     'abc'
//   ),
//   new Place(
//     'p3',
//     'The Foggy Palace',
//     'Not your average city trip',
//     'https://t4.ftcdn.net/jpg/05/83/89/09/360_F_583890918_fzQMBskLiehG2psD48jkotRx1B2tQNlH.jpg',
//     99.99,
//     new Date('2019-01-01'),
//     new Date('2019-01-02'),
//     'abc'

//   )
// ]
interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}
@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);
  get places() {
    return this._places.asObservable()
  }
  constructor(private authService: AuthService, private http: HttpClient) { }
  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>('https://ionic-angular-course-eb216-default-rtdb.firebaseio.com/offered-places.json')
      .pipe(map(resData => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(
              new Place(
                key,
                resData[key].title,
                resData[key].description,
                resData[key].imageUrl,
                resData[key].price,
                new Date(resData[key].availableFrom),
                new Date(resData[key].availableTo),
                resData[key].userId
              )
            )
          }
        }
        return places;
        // return [];
      }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      const place = places.find(p => p.id === id);
      if (place) {
        return place;
      } else {
        // Return a default Place object if no matching place is found
        return new Place(
          'default-id',
          'default-title',
          'default-description',
          'default-imageUrl',
          0,
          new Date(),
          new Date(),
          'default-userId'
        );
      }
    }));
  }
  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId!: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://t4.ftcdn.net/jpg/05/83/89/09/360_F_583890918_fzQMBskLiehG2psD48jkotRx1B2tQNlH.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.http.post<{ name: string }>('https://ionic-angular-course-eb216-default-rtdb.firebaseio.com/offered-places.json', { ...newPlace, id: null }).pipe(switchMap(resData => {
      generatedId = resData.name;
      return this.places;
    }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
    // return this.places.pipe(take(1), delay(1000), tap(places => {

    //   this._places.next(places.concat(newPlace));

    // }))
  }
  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(take(1), switchMap(places => {
      const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      const updatedPlaces = [...places];
      const old = updatedPlaces[updatedPlaceIndex];
      updatedPlaces[updatedPlaceIndex] = new Place(old.id, title, description, old.imageUrl, old.price, old.availableFrom, old.availableTo, old.userId);
      return this.http.put(`https://ionic-angular-course-eb216-default-rtdb.firebaseio.com/offered-places/${placeId}.json`, { ...updatedPlaces[updatedPlaceIndex], id: null })
    }), tap(() => {
      this._places.next(updatedPlaces);

    }));


  }
}
