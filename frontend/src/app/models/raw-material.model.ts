export interface RawMaterial {
    id?: number;
    name: string;
    code: string;
    category: string;
    unit_of_measure: string;
    quantity: number;
    status: 'active' | 'inactive';
    description?: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface PaginatedResponse {
    success: boolean;
    data: RawMaterial[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }