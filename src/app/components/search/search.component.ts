import { Component, ElementRef, ViewChild } from '@angular/core';
import { CardsSearchService } from '../../services/search/cards-search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CardType } from '../../models/card.model';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSkeletonLoaderModule, AppComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  nomeCarta: string = '';
  blocoSelecionado: string = '';
  blocosDisponiveis: string[] = [
    'Amonkhet',
    'Ixalan',
    'Zendikar',
    'Ravnica',
    'Onslaught',
  ];
  colectionResults: any[] = [];
  code: string = '';
  cards: any[] = [];
  colectionResults$: Observable<CardType[]> | undefined;
  cards$: Observable<any[]> | undefined;
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  boosterLoading$ = new BehaviorSubject<boolean>(false);
  boosterError$ = new BehaviorSubject<string | null>(null);

  constructor(private cardService: CardsSearchService) {}

  search(): void {
    this.loading$.next(true);
    this.error$.next(null);
    this.colectionResults$ = this.cardService
      .getCartas(this.nomeCarta, this.blocoSelecionado)
      .pipe(
        tap(() => this.loading$.next(false)),
        catchError((error) => {
          this.error$.next('Erro ao buscar cartas');
          this.loading$.next(false);
          return of([]);
        })
      );
  }

  onItemClick(code: string): void {
    this.boosterLoading$.next(true);
    this.boosterError$.next(null);
    this.cards$ = this.cardService.getBoosterDetails(code).pipe(
      tap((data) => {
        this.boosterLoading$.next(false);
        this.scrollToAnchorPoint();
        // console.log('Dados do booster:', data);
      }),
      catchError((error) => {
        this.boosterError$.next('Erro ao buscar detalhes do booster');
        this.boosterLoading$.next(false);
        console.error('Erro ao buscar detalhes do booster:', error);
        return of([]);
      })
    );
  }

  getCardImageUrl(colorIdentity: string): string {
    switch (colorIdentity) {
      case 'W':
        return '../../../assets/U.webp';
      case 'U':
        return '../../../assets/U.webp';
      case 'B':
        return '../../../assets/B.webp';
      case 'R':
        return '../../../assets/R.webp';
      case 'G':
        return '../../../assets/G.png';
      default:
        return '../../../assets/R.webp';
    }
  }

  @ViewChild('cartas') anchorPointRef: ElementRef | undefined;

  scrollToAnchorPoint() {
    if (this.anchorPointRef) {
      this.anchorPointRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
