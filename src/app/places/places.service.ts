import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of new york city',
      'https://thumbs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', 149.99,
      new Date('2019-01-01'),
      new Date('2019-01-02'),
      'abc'

    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romantic place in Paris',
      'https://www.meandhimphotography.com/cache/images/677x_a13099a06c902e9d9c7051e350fb8465.jpg',
      189.99,
      new Date('2019-01-01'),
      new Date('2019-01-02'),
      'abc'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip',
      'https://t4.ftcdn.net/jpg/05/83/89/09/360_F_583890918_fzQMBskLiehG2psD48jkotRx1B2tQNlH.jpg',
      99.99,
      new Date('2019-01-01'),
      new Date('2019-01-02'),
      'abc'

    )
  ];
  get places() {
    return [...this._places];
  }
  constructor(private authService: AuthService) { }
  getPlace(id: string): Place {
    const place = this._places.find(p => p.id === id);
    if (!place) {
      throw new Error(`No place found with id ${id}`);
    }
    return { ...place };
  }
  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
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
    this._places.push(newPlace);
  }
}
