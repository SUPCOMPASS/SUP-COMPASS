import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { testProviders } from '../../../testing/test-providers';
import { AuthService } from './auth.service';

const API = 'http://localhost:3001';

describe('AuthService', () => {
  let auth: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: testProviders });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('ouvre une session avec le jeton et le rôle renvoyés par l’API', async () => {
    const connexion = auth.login('admin@supcom.tn', 'admin1234');
    const req = http.expectOne(`${API}/auth/login`);
    expect(req.request.body).toEqual({ email: 'admin@supcom.tn', password: 'admin1234' });
    req.flush({
      token: 'abc',
      user: { id: 'u-admin', nom: 'Admin', email: 'admin@supcom.tn', role: 'admin' },
    });
    await connexion;
    expect(auth.isAdmin()).toBe(true);
    expect(auth.token()).toBe('abc');
  });

  it('relaie le message d’erreur de l’API', async () => {
    const connexion = auth.login('etudiant@supcom.tn', 'mauvais00');
    http
      .expectOne(`${API}/auth/login`)
      .flush(
        { error: 'E-mail ou mot de passe incorrect.' },
        { status: 401, statusText: 'Unauthorized' },
      );
    await expect(connexion).rejects.toThrow('E-mail ou mot de passe incorrect.');
    expect(auth.isLoggedIn()).toBe(false);
  });

  it('refuse un mot de passe trop court sans appeler l’API', async () => {
    await expect(auth.login('etudiant@supcom.tn', '123')).rejects.toThrow('8 caractères');
    http.expectNone(`${API}/auth/login`);
  });
});
