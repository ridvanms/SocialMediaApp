import { Component } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { MatBottomSheetRef } from "@angular/material/bottom-sheet"

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent {

  firebaseTsAuth: FirebaseTSAuth

  state = AuthenticatorCompState.LOGIN
  constructor(
    private bottomSheetRef: MatBottomSheetRef
  ) {
    this.firebaseTsAuth = new FirebaseTSAuth()
  }

  onResetClick(
    resetEmail: HTMLInputElement
  ) {
    let email = resetEmail.value
    if (this.isNotEmpty(email)) {
      this.firebaseTsAuth.sendPasswordResetEmail(
        {
          email,
          onComplete: (res) => {
            // alert(`Resent email send to ${email}`)
            this.bottomSheetRef.dismiss()
          }
        }
      )
    }
  }

  onLogin(
    loginEmail: HTMLInputElement,
    loginPassword: HTMLInputElement
  ) {
    let email = loginEmail.value
    let password = loginPassword.value

    if (this.isNotEmpty(email && password)) {
      this.firebaseTsAuth.signInWith(
        {
          email,
          password,
          onComplete: (res) => {
            // alert("You logged in successfully!")
            this.bottomSheetRef.dismiss()
          },
          onFail: (err) => {
            alert("Failed on log in!")
          }
        }
      )
    }
  }

  onRegister(
    registerEmail: HTMLInputElement,
    registerPassword: HTMLInputElement,
    registerConfirmPassword:HTMLInputElement
  ) {
    let email = registerEmail.value;
    let password = registerPassword.value;
    let confirmPassword = registerConfirmPassword.value;

    if (
      this.isNotEmpty(email) && this.isNotEmpty(password) && this.isNotEmpty(confirmPassword) &&
      this.isAMatch(password,confirmPassword)
    ) {
      this.firebaseTsAuth.createAccountWith(
      {
        email,
        password,
        onComplete: (res) => {
          // alert("Account created!")
          this.bottomSheetRef.dismiss()
          registerEmail.value = '';
          registerPassword.value = '';
          registerConfirmPassword.value = '';
        },
        onFail: (err) => {
          alert("Failed to create the account")
        } 
      }
    )
    }
  }
  isNotEmpty(text:string) {
    return text != null && text.length > 0;
  }

  isAMatch(text: string, compareWith: string) {
    return text === compareWith;
  }

  onForgotPasswordClick() {
    this.state = AuthenticatorCompState.FORGOT_PASSWORD
   }
  onCreateAnAccountClick() {
    this.state = AuthenticatorCompState.REGISTER
  }
  onLoginClick() {
    this.state = AuthenticatorCompState.LOGIN
  }

  isLoginState() {
    return this.state == AuthenticatorCompState.LOGIN
  }

  isRegisterState() {
    return this.state == AuthenticatorCompState.REGISTER
  }

  isForgotPasswordState() {
    return this.state == AuthenticatorCompState.FORGOT_PASSWORD
  }

  getStateText() {
    switch (this.state) {
      case AuthenticatorCompState.LOGIN:
        return 'Login'
      case AuthenticatorCompState.REGISTER:
        return "Register"
      case AuthenticatorCompState.FORGOT_PASSWORD:
        return "Forgot Password"
    }
  }
}

export enum AuthenticatorCompState{
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD 
}
