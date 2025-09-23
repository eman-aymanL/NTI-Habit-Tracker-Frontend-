import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.css']
})
export class VerifyEmail implements OnInit {
  isVerifying = true;
  isSuccess = false;
  errorMessage = '';
  
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // استخراج الرمز من المسار
    const token = this.route.snapshot.paramMap.get('token');
    
    console.log('Extracted token:', token);
    
    if (token) {
      // إرسال طلب للتحقق من الرمز
      const verifyUrl = `http://localhost:5000/api/users/verify-email/${token}`;
      console.log('Making verification request to:', verifyUrl);
      
      this.http.get(verifyUrl).subscribe({
        next: (response: any) => {
          console.log('Verification successful:', response);
          this.isVerifying = false;
          this.isSuccess = true;
          const token = response?.data?.token;
          if (token) {
            this.auth.setSession(token);
            this.router.navigate(['/habits']);
          }
        },
        error: (error) => {
          console.error('Verification error:', error);
          this.isVerifying = false;
          this.errorMessage = error.error?.message || 'Failed to verify email, please try again.';
        }
      });
    } else {
      this.isVerifying = false;
      this.errorMessage = 'Invalid verification token';
    }
  }
}