import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  selectedImageFile: File | any
  constructor(

  ) {
    
  }
  ngOnInit(): void {
      //
  }
  onPhotoSelected(
    photoSelector:HTMLInputElement
  ) {
    this.selectedImageFile = photoSelector.files?.[0] 
    if (!this.selectedImageFile) return;
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.selectedImageFile);
    fileReader.addEventListener(
      "loadend",
      ev => {
        let readableString = fileReader.result?.toString()
        let postPreviewImage = <HTMLImageElement>document.getElementById("post-preview-image");
        postPreviewImage.src = readableString as string
      }
    )
  }
}

