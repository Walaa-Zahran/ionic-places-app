import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
  place!: Place | null;
  form!: FormGroup;
  private placeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      const placeId = paramMap.get('placeId');
      if (placeId === null) {
        // Handle the case when placeId is null
        return;
      }
      this.placeSub = this.placesService
        .getPlace(placeId)
        .subscribe(place => {
          this.place = place;
          this.form = new FormGroup({
            title: new FormControl(this.place?.title, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            description: new FormControl(this.place?.description, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)]
            })
          });
        });
    });
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating place...'
      })
      .then(loadingEl => {
        loadingEl.present();
        if (this.place) {
          this.placesService
            .updatePlace(
              this.place.id,
              this.form.value.title,
              this.form.value.description
            ).subscribe(() => {
              loadingEl.dismiss();
              this.form.reset();
              this.router.navigate(['/places/tabs/offers']);
            });
          // rest of your code
        }


      });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
