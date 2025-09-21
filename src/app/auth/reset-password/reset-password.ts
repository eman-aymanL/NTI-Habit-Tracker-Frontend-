import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isSuccess = false;
  token = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Create the form with the validator as a separate function
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    console.log('ResetPasswordComponent initialized');
    this.token = this.route.snapshot.paramMap.get('token') || '';
    console.log('Token:', this.token);
    if (!this.token) {
      this.errorMessage = 'Invalid or missing reset token';
    }
  }

  // Fixed validator - changed to arrow function to maintain "this" context
  passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Only validate if both fields have values
    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }

    return null;
  };

  getFieldError(field: string): string {
    const control = this.resetForm.get(field);
    if (control?.errors?.['required']) return 'This field is required';
    if (control?.errors?.['minlength']) return 'Password must be at least 8 characters';
    if (field === 'confirmPassword' && this.resetForm.hasError('mismatch'))
      return 'Passwords do not match';
    return '';
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http
      .post(`http://localhost:5000/api/users/reset-password/${this.token}`, {
        password: this.resetForm.value.password,
        confirmPassword: this.resetForm.value.confirmPassword,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.isSuccess = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to reset password. Please try again.';
        },
      });
  }
}
