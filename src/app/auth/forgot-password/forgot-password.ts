import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isEmailSent = false;
  errorCta: 'none' | 'register' = 'none';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  getFieldError(field: string): string {
    const control = this.forgotPasswordForm.get(field);
    if (control?.errors?.['required']) return 'This field is required';
    if (control?.errors?.['email']) return 'Please enter a valid email address';
    return '';
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.errorCta = 'none';

    const email = this.forgotPasswordForm.value.email;

    this.http.post('http://localhost:5000/api/users/forgot-password', { email }).subscribe({
      next: () => {
        this.isLoading = false;
        this.isEmailSent = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to send reset email. Please try again.';
        if (error.status === 404 && (error.error?.accountNotFound || /not found/i.test(error.error?.message || ''))) {
          this.errorCta = 'register';
        }
      },
    });
  }
}
