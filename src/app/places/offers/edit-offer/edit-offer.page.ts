import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
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
  place!: Place;
  form!: FormGroup;
  isLoading = false;
  placeId!: string;
  private placeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    // Initialize the form object when the component is created
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      })
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/offers');
        return;
      }
      const placeId = paramMap.get('placeId');
      if (placeId === null) {
        this.navCtrl.navigateBack('/places/offers');
        return;
      }
      this.placeId = paramMap.get('placeId')!;
      this.isLoading = true;
      this.placeSub = this.placesService
        .getPlace(placeId)
        .subscribe(place => {
          this.place = place;
          // Update the form values when the getPlace Observable emits a value
          this.form.setValue({
            title: this.place.title,
            description: this.place.description
          });
          this.isLoading = false;
        }, error => {
          this.alertCtrl.create({
            header: 'An Error occurred!',
            message: 'Place could not be fetched . please try again later',
            buttons: [{
              text: 'Okay', handler: () => {
                this.router.navigate(['/places/offers']);
              }
            }]
          }).then(alertEl => {
            alertEl.present();
          })
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
        this.placesService
          .updatePlace(
            this.place.id,
            this.form.value.title,
            this.form.value.description
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/places/offers']);
          });
      });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
