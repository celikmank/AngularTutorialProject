import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocationInfo } from '../housinglocation';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  template: `
    <article *ngIf="housingLocation">
      <img
        class="listing-photo"
        [src]="housingLocation.photo"
        alt="Exterior photo of {{ housingLocation.name }}"
        crossorigin
      />
      <section class="listing-description">
        <h2 class="listing-heading">{{ housingLocation.name }}</h2>
        <p class="listing-location">{{ housingLocation.city }}, {{ housingLocation.state }}</p>
      </section>
      <section class="listing-features">
        <h2 class="section-heading">About this housing location</h2>
        <ul>
          <li>Units available: {{ housingLocation.availableUnits }}</li>
          <li>Does this location have wifi: {{ housingLocation.wifi }}</li>
          <li>Does this location have laundry: {{ housingLocation.laundry }}</li>
        </ul>
      </section>
      <section class="listing-apply">
        <h2 class="section-heading">Apply for housing</h2>
        <form [formGroup]="applyForm" (ngSubmit)="submitApplication()">
          <label for="firstName">First Name</label>
          <input id="firstName" type="text" formControlName="firstName" />
          <label for="lastName">Last Name</label>
          <input id="lastName" type="text" formControlName="lastName" />
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" />
          <button class="primary" type="submit">Submit Application</button>
        </form>
      </section>
    </article>
    <p *ngIf="!housingLocation">Location not found</p>
  `,
  styleUrls: ['./details.css'],
})
export class Details {
  route = inject(ActivatedRoute);
  housingService = inject(HousingService);

  housingLocation: HousingLocationInfo | undefined;

  applyForm  = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  constructor() {
    // Get the housing location ID from the route parameters
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId).then((housingLocation) => {
      this.housingLocation = housingLocation;
    });
  }
  
  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? '' 
    );
  }

}
