import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { MetaDataService } from '../_services/metadata.service';
import { Major, Occupation, University } from '../_models/metadatas';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;
  universities: University[] = [];
  majors: Major[] = [];
  occupations: Occupation[] = [];

  getMetadata() {
    this.metadataService.universityAll().subscribe({
      next: response => {
        this.universities = response;
      }
    })

    this.metadataService.majorAll().subscribe({
      next: response => {
        this.majors = response;
      }
    })

    this.metadataService.occupationAll().subscribe({
      next: response => {
        this.occupations = response;
      }
    })
  }
  constructor(private accountService: AccountService, private toastr: ToastrService, 
      private fb: FormBuilder, private router: Router, private metadataService: MetaDataService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getMetadata();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18);
  }
  

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male',Validators.required],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      yearofgraduate: ['', Validators.required],
      universityid: ['', Validators.required],
      majorid: ['', Validators.required],
      occupationid: ['', Validators.required],
      password: ['', [Validators.required, 
        Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],

    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true}
    }
  }

  register() {
    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values = {...this.registerForm.value, dateOfBirth: dob};
    this.accountService.register(values).subscribe({
      next: () => {
        this.router.navigateByUrl('/members')
      },
      error: error => {
        this.validationErrors = error
      } 
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes()-theDob.getTimezoneOffset()))
      .toISOString().slice(0,10);
  }

  onUniversitySelected(event: Event)
  {
    this.registerForm.controls['universityid'].setValue((event.target as HTMLSelectElement).value);
  }

  onYearSelected(event: Event)
  {
    this.registerForm.controls['yearofgraduate'].setValue((event.target as HTMLSelectElement).value);
  }

  onMajorSelected(event: Event)
  {
    this.registerForm.controls['majorid'].setValue((event.target as HTMLSelectElement).value);
  }

  onOccupationSelected(event: Event)
  {
    this.registerForm.controls['occupationid'].setValue((event.target as HTMLSelectElement).value);
  }

}
