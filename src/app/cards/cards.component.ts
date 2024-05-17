import { Component, Input } from '@angular/core';
import { CardType } from '../../models/card.model';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent {
  @Input() card!: CardType;
}
