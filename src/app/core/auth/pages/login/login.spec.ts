import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Login } from './login';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { AuthStore } from '../../../services/auth.store';
import { of, throwError } from 'rxjs';

fdescribe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authStoreSpy: jasmine.SpyObj<AuthStore>;

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    const authStoreMock = jasmine.createSpyObj('AuthStore', ['login']);

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: routerMock },
        { provide: AuthStore, useValue: authStoreMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authStoreSpy = TestBed.inject(AuthStore) as jasmine.SpyObj<AuthStore>;
    fixture.detectChanges(); // whenstable();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    const email = component.loginForm.controls['email'];
    email.setValue('');
    const password = component.loginForm.controls['password'];
    password.setValue('');
    fixture.detectChanges();
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should make the form invalid if email is empty', () => {
    component.loginForm.controls['email'].setValue('');
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should validate email field', () => {
    const email = component.loginForm.controls['email'];
    email.setValue('');
    expect(email.hasError('required')).toBeTrue();

    email.setValue('invalid-email');
    expect(email.hasError('email')).toBeTrue();

    email.setValue('valid@email.com');
    expect(email.valid).toBeTrue();
  });

  it('should validate password field as required', () => {
    const password = component.loginForm.controls['password'];
    password.setValue('');
    expect(password.hasError('required')).toBeTrue();

    password.setValue('mypassword');
    expect(password.valid).toBeTrue();
  });

  it('should call authStore.login and navigate on successful login', (done: DoneFn) => {
    const formValue = component.loginForm.value;

    authStoreSpy.login.and.returnValue(of({
      id: 'mock-id',
      email: formValue.email,
      name: 'Mock User',
      pictureUrl: 'https://example.com/default-picture.png'
    }));

    component.login();

    authStoreSpy.login(formValue.email, formValue.password).subscribe(() => {
      expect(authStoreSpy.login).toHaveBeenCalledWith(formValue.email, formValue.password);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/dashboard');
      done();
    });
  });

  it('should log error on login failure', (done: DoneFn) => {
    const consoleSpy = spyOn(console, 'error');
    authStoreSpy.login.and.returnValue(throwError(() => new Error('Invalid credentials')));
    component.login();
    done();

    expect(authStoreSpy.login).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Login failed', jasmine.any(Error));
  });

  it('should not login or navigate if form is invalid', () => {
    component.loginForm.setValue({
      email: '',
      password: ''
    });

    component.login();

    expect(authStoreSpy.login).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
