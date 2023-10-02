import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { InfiniteScrollCustomEvent, MenuController, SegmentChangeEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[] = [];
  listedLoadedPlaces!: Place[];
  items: string[] = [];

  ev!: CustomEvent;

  constructor(private placesService: PlacesService, private menuCtrl: MenuController) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
    this.generateItems();

  }
  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 3; i++) {
      this.items.push(`Item ${count + i}`);
    }
  }
  onIonInfinite(ev: any) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
  onOpenMenu() {
    this.menuCtrl.toggle();
  }
  onFilterUpdate($event: CustomEvent<SegmentChangeEventDetail>) {
    // Your code here...
    console.log($event);
  }
}
