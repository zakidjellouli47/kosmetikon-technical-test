import { Component, OnInit } from '@angular/core';
import { RawMaterialService } from '../../services/raw-material.service';
import { RawMaterial } from '../../models/raw-material.model';

@Component({
  selector: 'app-raw-material-list',
  templateUrl: './raw-material-list.component.html',
  styleUrls: ['./raw-material-list.component.css']
})
export class RawMaterialListComponent implements OnInit {
  materials: RawMaterial[] = [];
  loading = false;
  error = '';
  filters = { name: '', category: '', status: '' };
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  showDeleteModal = false;
  materialToDelete: RawMaterial | null = null;

  constructor(private materialService: RawMaterialService) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.loading = true;
    this.error = '';
    const params = { page: this.currentPage, limit: this.pageSize, ...this.filters };
    this.materialService.getMaterials(params).subscribe({
      next: (response) => {
        this.materials = response.data;
        this.totalItems = response.pagination.total;
        this.totalPages = response.pagination.totalPages;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load materials.';
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadMaterials();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMaterials();
  }

  confirmDelete(material: RawMaterial): void {
    this.materialToDelete = material;
    this.showDeleteModal = true;
  }

  deleteMaterial(): void {
    if (!this.materialToDelete) return;
    this.materialService.deleteMaterial(this.materialToDelete.id!).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.materialToDelete = null;
        this.loadMaterials();
      },
      error: () => {
        this.error = 'Failed to delete material.';
        this.showDeleteModal = false;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.materialToDelete = null;
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}