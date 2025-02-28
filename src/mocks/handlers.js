// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon/pikachu', () => {
    return HttpResponse.json({ name: 'pikachu' });
  }),
];
