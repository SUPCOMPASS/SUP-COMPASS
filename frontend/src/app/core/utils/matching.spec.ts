import { Domaine } from '../models/models';
import { classerDomaines } from './matching';

const domaine = (id: string, profil: number[]): Domaine => ({
  id,
  nom: id,
  resume: '',
  description: '',
  prerequis: [],
  competences: [],
  debouches: [],
  profil,
});

describe('classerDomaines', () => {
  it('classe en premier le domaine le plus proche du profil', () => {
    const resultat = classerDomaines([5, 0], [domaine('loin', [0, 5]), domaine('proche', [5, 1])]);
    expect(resultat.map((r) => r.domaine.id)).toEqual(['proche', 'loin']);
    expect(resultat[0].match).toBe(90);
    expect(resultat[1].match).toBe(0);
  });
});
