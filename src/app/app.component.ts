import { Component } from '@angular/core';
import { MatBottomSheet } from "@angular/material/bottom-sheet"
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';

import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import {FirebaseTSFirestore} from "firebasets/firebasetsFirestore/firebaseTSFirestore"
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  userHasProfile: boolean = false;

  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userDocument: UserDocument = { publicName: '', description: '' };
  
  constructor(
    private loginSheet: MatBottomSheet,
    private router: Router
  ) {
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user => {
              // TODO
            },
            whenSignedOut: user => {
              // TODO
            },
            whenSignedInAndEmailNotVerified: user => {
              this.router.navigate(['emailVerification'])
            },
            whenSignedInAndEmailVerified: user => {
              this.getUserProfile()
            },
            whenChanged: user => {
              // TODO
            }
          }
        )
      }
    )
  }
  getUserProfile() {
    this.firestore.listenToDocument(
      {
        name: 'Getting Document', 
        path: ["Users", this.auth.getAuth().currentUser?.uid as string],
        onUpdate: (result) => {
          this.userDocument = <UserDocument>result.data()
          
          this.userHasProfile = result.exists
          if (this.userHasProfile) {
            this.router.navigate(["postfeed"])
          }
        }
      }
    );
  }
  loggedIn() {
    return this.auth.isSignedIn()
  }

  onLogout() { 
    this.auth.signOut();
  }
  
  onLoginClick() {
    this.loginSheet.open(AuthenticatorComponent)
  }
}

export interface UserDocument {
  publicName: string,
  description: string,
}