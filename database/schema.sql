-- ============================================================
-- KOSMETIKON - Raw Materials Database Schema
-- PostgreSQL 15+
-- ============================================================

-- Create database (IF NOT EXISTS is not supported for CREATE DATABASE)
-- For Docker, the database is already created by the POSTGRES_DB env var
-- If running locally, manually create it first:
-- CREATE DATABASE kosmetikon;

-- Connect to the database
\c kosmetikon;

-- ============================================================
-- TABLE: raw_material
-- ============================================================
CREATE TABLE IF NOT EXISTS raw_material (
    -- Primary key
    id SERIAL PRIMARY KEY,
    
    -- Business fields
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    category VARCHAR(80) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    description TEXT,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- ============================================================
    -- CONSTRAINTS
    -- ============================================================
    
    -- Unique constraints (test requirement)
    CONSTRAINT uq_raw_material_name UNIQUE (name),
    CONSTRAINT uq_raw_material_code UNIQUE (code),
    
    -- Check constraints
    CONSTRAINT chk_raw_material_status CHECK (status IN ('active', 'inactive')),
    CONSTRAINT chk_raw_material_quantity CHECK (quantity >= 0)
);

-- ============================================================
-- INDEXES (for performance)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_raw_material_name ON raw_material(name);
CREATE INDEX IF NOT EXISTS idx_raw_material_category ON raw_material(category);
CREATE INDEX IF NOT EXISTS idx_raw_material_status ON raw_material(status);
CREATE INDEX IF NOT EXISTS idx_raw_material_created_at ON raw_material(created_at DESC);

-- ============================================================
-- TRIGGER: Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_raw_material_updated_at ON raw_material;

CREATE TRIGGER update_raw_material_updated_at
    BEFORE UPDATE ON raw_material
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SAMPLE DATA (Seed)
-- ============================================================
INSERT INTO raw_material (name, code, category, unit_of_measure, quantity, status, description) VALUES
    ('Shea Butter', 'SB-001', 'emollient', 'kg', 150.50, 'active', 'Refined shea butter for skin care products'),
    ('Coconut Oil', 'CO-002', 'emollient', 'l', 75.00, 'active', 'Organic cold-pressed coconut oil'),
    ('Hyaluronic Acid', 'HA-003', 'active ingredient', 'g', 25.00, 'active', 'High molecular weight hyaluronic acid'),
    ('Phenoxyethanol', 'PE-004', 'preservative', 'l', 100.00, 'active', 'Broad-spectrum preservative'),
    ('Vitamin E', 'VE-005', 'active ingredient', 'kg', 10.00, 'inactive', 'Natural vitamin E oil'),
    ('Lavender Essential Oil', 'LE-006', 'fragrance', 'ml', 500.00, 'active', 'Pure lavender essential oil'),
    ('Aloe Vera Gel', 'AV-007', 'active ingredient', 'kg', 200.00, 'active', 'Organic aloe vera gel concentrate'),
    ('Titanium Dioxide', 'TD-008', 'active ingredient', 'g', 50.00, 'active', 'White pigment for sunscreens'),
    ('Jojoba Oil', 'JO-009', 'emollient', 'l', 125.75, 'active', 'Golden jojoba oil for face serums'),
    ('Sodium Benzoate', 'SB-010', 'preservative', 'kg', 30.00, 'active', 'Food grade preservative')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Count total records
SELECT COUNT(*) as total_materials FROM raw_material;

-- Check status distribution
SELECT status, COUNT(*) as count FROM raw_material GROUP BY status;

-- Show all data
SELECT * FROM raw_material ORDER BY id;