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
  private static userDocument: UserDocument | null;
  
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
              AppComponent.userDocument = null;
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
  getUsername() {
    try {
      return AppComponent.userDocument?.publicName
    } catch (err) {
      return "NO name"
    }
  }
  public static getUserDocument() {
    return AppComponent.userDocument
  }
  getUserProfile() {
    this.firestore.listenToDocument(
      {
        name: 'Getting Document', 
        path: ["Users", this.auth.getAuth().currentUser?.uid as string],
        onUpdate: (result) => {
          AppComponent.userDocument = <UserDocument>result.data()
          AppComponent.userDocument.userId = this.auth.getAuth().currentUser?.uid as string
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
  userId: string
}