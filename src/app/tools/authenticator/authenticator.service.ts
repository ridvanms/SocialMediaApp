import { Injectable } from '@angular/core';
import { FirebaseTSAuth } from "firebasets/firebasetsAuth/firebaseTSAuth"
@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {
  
  auth = new FirebaseTSAuth()
  constructor() { }
  isLoggedIn() {
    return this.auth.isSignedIn()
  }
}
