import { Component, OnInit } from '@angular/core';
import { GalleryService } from '../shared/gallery.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  constructor(private galleryService: GalleryService) { }

  gallery: any;
  currentImage: string;
  active: string;
  isCarouselOpen: boolean = false;
  displayCarousel: string = "none";


  changeImage(i: string): void {
    this.currentImage = this.gallery[Number(i)];
    this.active = i;
  }

  onMouseEnter(index: string): void {
    this.galleryService.opacityControl.next(index);
  }

  onMouseLeave(): void {
    this.galleryService.opacityControl.next();
  }

  openCarousel(index: string): void {
    this.isCarouselOpen = true;
    this.displayCarousel = "flex";
    this.currentImage = this.gallery[Number(index)];
    this.galleryService.getActiveImage.next(this.currentImage);
    this.galleryService.navbarBackground.next("open");
  }

  closeCarousel(): void {
    this.isCarouselOpen = false;
    this.displayCarousel = "none";
    this.galleryService.navbarBackground.next("close");
  }

  loadImage(image: string) {
    
  }

  ngOnInit() {
    this.galleryService.getGallery().subscribe((response) => {
      this.gallery = response;
      this.currentImage = this.gallery[0];
      this.active = "0";
      console.log(this.gallery);
    })
  }

}
