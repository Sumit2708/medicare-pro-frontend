import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-page-header',
  imports: [MatIcon,CommonModule,MatButtonModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {


    @Input() title = '';

  @Input() subtitle = '';

  @Input() buttonLabel = '';

  @Input() buttonIcon = '';

  @Input() showButton = true;

  @Output() buttonClick = new EventEmitter<void>();


   onButtonClick() {
    this.buttonClick.emit();
  }

}
