import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          console.log('Login success', res);
          
          if (res.data && res.data.token) {
            localStorage.setItem('token', res.data.token);
            this.router.navigate(['/habits']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Login failed', err);
          console.error('Error details:', {
            status: err.status,
            statusText: err.statusText,
            error: err.error,
            message: err.message
          });
          
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
            
            if (err.error.needsEmailVerification) {
              this.errorMessage += ' Please check your email for verification.';
            }
          } else {
            this.errorMessage = 'An error occurred during login. Please try again.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.touched && field.errors) {
      if (field.errors['required']) {
        return 'This field is required';
      }
      if (field.errors['email']) {
        return 'Invalid email format';
      }
    }
    return '';
  }
}