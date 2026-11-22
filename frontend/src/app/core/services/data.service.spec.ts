import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { testProviders } from '../../../testing/test-providers';
import { DataService } from './data.service';

const API = 'http://localhost:3001';
const RESSOURCES = ['criteres', 'domaines', 'combinaisons', 'metiers', 'parcours', 'ecoles'];

describe('DataService', () => {
  let service: DataService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: testProviders });
    service = TestBed.inject(DataService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  /** Répond aux 6 requêtes du chargement initial. */
  function repondre(domaines: unknown[] = [{ id: 'ia', nom: 'IA & Data' }]): void {
    for (const r of RESSOURCES)
      http.expectOne(`${API}/${r}`).flush(r === 'domaines' ? domaines : []);
  }

  it('charge tous les contenus et passe à « ready »', async () => {
    expect(service.status()).toBe('loading');
    const chargement = service.load();
    repondre();
    await chargement;
    expect(service.status()).toBe('ready');
    expect(service.domaines.get('ia')?.nom).toBe('IA & Data');
  });

  it('passe à « error » avec un message clair si l’API ne répond pas', async () => {
    const chargement = service.load();
    for (const r of RESSOURCES)
      http.expectOne(`${API}/${r}`).error(new ProgressEvent('error'), { status: 0 });
    await chargement;
    expect(service.status()).toBe('error');
    expect(service.error()).toContain('mock API');
  });

  it('crée un élément (POST) puis met à jour la copie locale', async () => {
    const chargement = service.load();
    repondre([]);
    await chargement;

    const creation = service.save('domaines', { id: 'rf', nom: 'Radiofréquences' }, true);
    const req = http.expectOne(`${API}/domaines`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'rf', nom: 'Radiofréquences' });
    await creation;
    expect(service.domaines.items().map((d) => d.id)).toEqual(['rf']);
  });
});
