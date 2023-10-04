import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { InfiniteScrollCustomEvent, MenuController, SegmentChangeEventDetail } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[] = [];
  listedLoadedPlaces!: Place[];
  private placesSub!: Subscription;
  constructor(private placesService: PlacesService, private menuCtrl: MenuController) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.listedLoadedPlaces = this.loadedPlaces.slice(1);
    })

  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }
  onFilterUpdate(event: any) {
    // Your code here...
    console.log(event);
  }
  ngOnDestroy(): void {
    this.placesSub?.unsubscribe();
  }
}
