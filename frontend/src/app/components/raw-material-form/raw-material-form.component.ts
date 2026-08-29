import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RawMaterialService } from '../../services/raw-material.service';

@Component({
  selector: 'app-raw-material-form',
  templateUrl: './raw-material-form.component.html',
  styleUrls: ['./raw-material-form.component.css']
})
export class RawMaterialFormComponent implements OnInit {
  materialForm: FormGroup;
  isEditing = false;
  materialId: number | null = null;
  loading = false;
  submitting = false;
  error = '';
  success = '';
  showValidationPopup = false;
  validationErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private materialService: RawMaterialService
  ) {
    this.materialForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      category: ['', [Validators.required, Validators.maxLength(80)]],
      unitOfMeasure: ['', [Validators.required, Validators.maxLength(20)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      status: ['active', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.materialId = parseInt(params['id']);
        this.loadMaterial();
      }
    });
  }

  loadMaterial(): void {
    this.loading = true;
    if (this.materialId) {
      this.materialService.getMaterial(this.materialId).subscribe({
        next: (response) => {
          const data = response.data;
          this.materialForm.patchValue({
            name: data.name,
            code: data.code,
            category: data.category,
            unitOfMeasure: data.unit_of_measure,
            quantity: data.quantity,
            status: data.status,
            description: data.description
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load material.';
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    this.validationErrors = [];
    this.showValidationPopup = false;

    // Check all required fields
    const requiredFields = ['name', 'code', 'category', 'unitOfMeasure', 'quantity', 'status'];
    let hasErrors = false;

    requiredFields.forEach(field => {
      const control = this.materialForm.get(field);
      if (!control?.value || control.value === '' || control.value === null || control.value === undefined) {
        this.validationErrors.push(this.getFieldLabel(field) + ' is required');
        hasErrors = true;
      }
    });

    // Check quantity is not negative
    const quantity = this.materialForm.get('quantity')?.value;
    if (quantity !== undefined && quantity !== null && quantity < 0) {
      this.validationErrors.push('Quantity cannot be negative');
      hasErrors = true;
    }

    // Check max lengths
    const name = this.materialForm.get('name')?.value;
    if (name && name.length > 150) {
      this.validationErrors.push('Name cannot exceed 150 characters');
      hasErrors = true;
    }

    const code = this.materialForm.get('code')?.value;
    if (code && code.length > 50) {
      this.validationErrors.push('Code cannot exceed 50 characters');
      hasErrors = true;
    }

    const category = this.materialForm.get('category')?.value;
    if (category && category.length > 80) {
      this.validationErrors.push('Category cannot exceed 80 characters');
      hasErrors = true;
    }

    const unitOfMeasure = this.materialForm.get('unitOfMeasure')?.value;
    if (unitOfMeasure && unitOfMeasure.length > 20) {
      this.validationErrors.push('Unit of measure cannot exceed 20 characters');
      hasErrors = true;
    }

    if (hasErrors) {
      this.showValidationPopup = true;
      // Scroll to top to show the popup
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If validation passes, submit
    this.submitting = true;
    this.error = '';
    this.success = '';
    const formData = this.materialForm.value;

    if (this.isEditing && this.materialId) {
      this.materialService.updateMaterial(this.materialId, formData).subscribe({
        next: () => {
          this.success = 'Material updated successfully!';
          this.submitting = false;
          setTimeout(() => this.router.navigate(['/materials']), 1500);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update material.';
          this.submitting = false;
          if (err.error?.errors) {
            this.validationErrors = err.error.errors.map((e: any) => e.message);
            this.showValidationPopup = true;
          }
        }
      });
    } else {
      this.materialService.createMaterial(formData).subscribe({
        next: () => {
          this.success = 'Material created successfully!';
          this.submitting = false;
          setTimeout(() => this.router.navigate(['/materials']), 1500);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create material.';
          this.submitting = false;
          if (err.error?.errors) {
            this.validationErrors = err.error.errors.map((e: any) => e.message);
            this.showValidationPopup = true;
          }
        }
      });
    }
  }

  getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      'name': 'Name',
      'code': 'Code',
      'category': 'Category',
      'unitOfMeasure': 'Unit of Measure',
      'quantity': 'Quantity',
      'status': 'Status'
    };
    return labels[field] || field;
  }

  closePopup(): void {
    this.showValidationPopup = false;
  }

  onCancel(): void {
    this.router.navigate(['/materials']);
  }

  get f() {
    return this.materialForm.controls;
  }

  getFieldError(fieldName: string): string {
    const control = this.materialForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      if (control.errors?.['required']) return `${fieldName} is required`;
      if (control.errors?.['maxlength']) return `${fieldName} exceeds maximum length`;
      if (control.errors?.['min']) return `${fieldName} cannot be negative`;
    }
    return '';
  }
}