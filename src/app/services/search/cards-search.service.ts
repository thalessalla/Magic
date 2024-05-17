import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, take, tap } from 'rxjs';
import { CardType } from '../../models/card.model';

interface BoosterResponse {
  cards: any[];
}

@Injectable({
  providedIn: 'root',
})
export class CardsSearchService {
  private apiUrl = 'https://api.magicthegathering.io/v1';

  constructor(private http: HttpClient) {}

  getCartas(
    nomeCarta: string,
    blocoSelecionado: string
  ): Observable<CardType[]> {
    let params = new HttpParams();
    if (nomeCarta) {
      params = params.set('name', nomeCarta);
    }
    if (blocoSelecionado) {
      params = params.set('block', blocoSelecionado);
    }
    const url = `${this.apiUrl}/sets/?${params.toString()}`;
    return this.http.get<any>(url).pipe(
      map((response) => response.sets)
      // tap((data) => console.log('Dados das cartas:', data))
    );
  }

  // ----

  getBoosterDetails(setCode: string): Observable<any[]> {
    const url = `${this.apiUrl}/sets/${setCode}/booster`;
    return this.http.get<BoosterResponse>(url).pipe(
      map((response: BoosterResponse) => {
        if (response && response.cards) {
          const creatureCards = response.cards.filter(
            (card) =>
              typeof card.type === 'string' && card.type.includes('Creature')
          );
          const totalCreatureCards = creatureCards.length;
          const desiredNumberOfCards = 30;
          const cardsToRender = [];

          for (let i = 0; i < desiredNumberOfCards; i++) {
            cardsToRender.push(creatureCards[i % totalCreatureCards]);
          }
          console.log('Retorno: ', cardsToRender);
          console.log('url : ', url);
          return cardsToRender;
        } else {
          throw new Error('Resposta da API não possui a estrutura esperada');
        }
      }),
      take(1)
    );
  }
}
