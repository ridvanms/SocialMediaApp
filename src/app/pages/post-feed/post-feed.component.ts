
import { Component,OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog"
import { Router } from '@angular/router'; 
import { CreatePostComponent } from 'src/app/tools/create-post/create-post.component';
import { FirebaseTSAuth } from "firebasets/firebasetsAuth/firebaseTSAuth"
import { FirebaseTSFirestore, Limit, OrderBy } from "firebasets/firebasetsFirestore/firebaseTSFirestore"
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from 'src/app/tools/authenticator/authenticator.component';
@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent implements OnInit{
  firestore = new FirebaseTSFirestore();
  auth = new FirebaseTSAuth();
  posts: PostData[] = [];
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private loginSheet: MatBottomSheet
  ) {
    //
  }
  ngOnInit(): void {
    this.getPosts()
  }
  onCreatePostClick() {
    let isLoggedIn = this.auth.isSignedIn()
    if (isLoggedIn) {
      this.dialog.open(CreatePostComponent)
    } else {
      this.loginSheet.open(AuthenticatorComponent)
    }
  }
  getPosts() {
    this.firestore.getCollection(
      {
        path: ["Posts"],
        where: [
          new OrderBy("timestamp", "desc"),
          new Limit(10)
        ],
        onComplete: (result) => {
          result.docs.forEach(
            doc => {
              let post = <PostData>doc.data()
              post.postId = doc.id;
              this.posts.push(post)
            }
          )
        },
        onFail: (err) => {
          //TODO - 
        }
      }
    )
  }
}
export interface PostData{
  comment: string,
  creatorId: string,
  imageDownloadUrl?: string
  postId: string
}
