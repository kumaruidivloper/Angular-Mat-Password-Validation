import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable }    from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  formGroup: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';
  public nameMatch: object;
  public passwordMatch: boolean;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.setChangeValidate()
  }
  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formGroup = this.formBuilder.group({
      'email': [null, [Validators.required, Validators.pattern(emailregex)], this.checkInUseEmail],
      'name': [null, [Validators.required, this.checkName.bind(this)]],
      'password': [null, [Validators.required, this.checkPassword.bind(this)]],
      'confirmPassword': [null, [Validators.required, this.checkConfirmPassword.bind(this)]],
      'description': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      'validate': ''
    });
  }

  setChangeValidate() {
    this.formGroup.get('validate').valueChanges.subscribe(
      (validate) => {
        if (validate == '1') {
          this.formGroup.get('name').setValidators([Validators.required, Validators.minLength(3)]);
          this.titleAlert = "You need to specify at least 3 characters";
        } else {
          this.formGroup.get('name').setValidators(Validators.required);
        }
        this.formGroup.get('name').updateValueAndValidity();
      }
    )
  }

  name() {
    return this.formGroup.get('name') as FormControl
  }

  checkName() {
    if(this.formGroup && this.formGroup.get('password')) {
        console.log(this.formGroup.patchValue({'password': ''}))
    }
  }

  checkConfirmPassword() {
    if(this.formGroup && this.formGroup.get('password')) {
       const choosePasword = this.formGroup.get('password').value;
       const reTypePassword = this.formGroup.get('confirmPassword').value;
       if (choosePasword === reTypePassword) {
         console.log('Pasword Match');
           this.passwordMatch = choosePasword === reTypePassword;
       } else {
        console.log('Pasword Not Match');
        this.passwordMatch = choosePasword === reTypePassword;
       }
      }
    return (!this.passwordMatch) ? { 'requirements': true } : null;
  }

  checkPassword(control) {
    if(this.formGroup && this.formGroup.get('name')) {
      const NameMatch = this.formGroup.get('name').value;
      var regex = new RegExp(NameMatch);
    }
    let enteredPassword = control.value
    console.log(enteredPassword);
    enteredPassword = enteredPassword != null ? enteredPassword.replace(regex, '~'):'';
    console.log(enteredPassword);
    let passwordCheck = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  checkInUseEmail(control) {
    // mimic http database access
    let db = ['tony@gmail.com'];
    return new Observable(observer => {
      setTimeout(() => {
        let result = (db.indexOf(control.value) !== -1) ? { 'alreadyInUse': true } : null;
        observer.next(result);
        observer.complete();
      }, 4000)
    })
  }

  getErrorEmail() {
    return this.formGroup.get('email').hasError('required') ? 'Field is required' :
      this.formGroup.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
        this.formGroup.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  }

  getErrorPassword() {
    console.log('Hello1')
    return this.formGroup.get('password').hasError('required') ? 'Field is required' :
      this.formGroup.get('password').hasError('requirements') ? 'Password needs to be (at least 8-20 characters, [A-Z] & [a-z] & [0-9] & [#?!@$%^&*-])': '';
  }

  ErrorPasswordConfirm() {
    console.log('Hello2')
    return this.formGroup.get('confirmPassword').hasError('required') ? 'Please Confirm Your Password' :
      this.formGroup.get('confirmPassword').hasError('requirements') ? 'Password Not Match': '';
  }

  onSubmit(post) {
    this.post = post;
  }

}