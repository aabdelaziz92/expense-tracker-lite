import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges(); // whenstable();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalse();
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

  it('should store user data in localStorage and navigate on valid form', () => {
    spyOn(localStorage, 'setItem');

    component.loginForm.setValue({
      email: 'test@example.com',
      password: '123456'
    });

    component.login();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({
        email: 'test@example.com',
        password: '123456'
      })
    );

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not login or navigate if form is invalid', () => {
    component.loginForm.setValue({
      email: '',
      password: ''
    });

    component.login();

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
