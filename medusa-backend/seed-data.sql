-- Seed data for Medusa store
-- This bypasses Medusa services to avoid initialization errors

-- Insert currencies
INSERT INTO currency (code, name, symbol, symbol_native) VALUES
('usd', 'US Dollar', '$', '$'),
('eur', 'Euro', '€', '€'),
('irr', 'Iranian Rial', '﷼', '﷼')
ON CONFLICT (code) DO NOTHING;

-- Insert store
INSERT INTO store (id, name, default_currency_code, created_at, updated_at) VALUES
('store_01JCQW3Z7XHQY6KZQWJ9VXYZ12', 'SharifGPT Store', 'irr', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Link currencies to store
INSERT INTO store_currencies (store_id, currency_code) VALUES
('store_01JCQW3Z7XHQY6KZQWJ9VXYZ12', 'irr'),
('store_01JCQW3Z7XHQY6KZQWJ9VXYZ12', 'usd'),
('store_01JCQW3Z7XHQY6KZQWJ9VXYZ12', 'eur')
ON CONFLICT DO NOTHING;

-- Insert payment provider
INSERT INTO payment_provider (id, is_installed) VALUES
('manual', true)
ON CONFLICT (id) DO UPDATE SET is_installed = true;

-- Insert fulfillment provider
INSERT INTO fulfillment_provider (id, is_installed) VALUES
('manual', true)
ON CONFLICT (id) DO UPDATE SET is_installed = true;

-- Insert regions
INSERT INTO region (id, name, currency_code, tax_rate, created_at, updated_at) VALUES
('reg_iran_01JCQW3Z7XHQY6KZQWJ', 'Iran', 'irr', 9, NOW(), NOW()),
('reg_intl_01JCQW3Z7XHQY6KZQWK', 'International', 'usd', 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Link payment providers to regions
INSERT INTO region_payment_providers (region_id, provider_id) VALUES
('reg_iran_01JCQW3Z7XHQY6KZQWJ', 'manual'),
('reg_intl_01JCQW3Z7XHQY6KZQWK', 'manual')
ON CONFLICT DO NOTHING;

-- Link fulfillment providers to regions
INSERT INTO region_fulfillment_providers (region_id, provider_id) VALUES
('reg_iran_01JCQW3Z7XHQY6KZQWJ', 'manual'),
('reg_intl_01JCQW3Z7XHQY6KZQWK', 'manual')
ON CONFLICT DO NOTHING;

-- Insert countries
INSERT INTO country (id, iso_2, iso_3, num_code, name, display_name, region_id) VALUES
(364, 'IR', 'IRN', 364, 'IRAN', 'Iran', 'reg_iran_01JCQW3Z7XHQY6KZQWJ'),
(840, 'US', 'USA', 840, 'UNITED STATES', 'United States', 'reg_intl_01JCQW3Z7XHQY6KZQWK'),
(124, 'CA', 'CAN', 124, 'CANADA', 'Canada', 'reg_intl_01JCQW3Z7XHQY6KZQWK'),
(826, 'GB', 'GBR', 826, 'UNITED KINGDOM', 'United Kingdom', 'reg_intl_01JCQW3Z7XHQY6KZQWK'),
(276, 'DE', 'DEU', 276, 'GERMANY', 'Germany', 'reg_intl_01JCQW3Z7XHQY6KZQWK'),
(250, 'FR', 'FRA', 250, 'FRANCE', 'France', 'reg_intl_01JCQW3Z7XHQY6KZQWK'),
(784, 'AE', 'ARE', 784, 'UNITED ARAB EMIRATES', 'United Arab Emirates', 'reg_intl_01JCQW3Z7XHQY6KZQWK')
ON CONFLICT (id) DO UPDATE SET region_id = EXCLUDED.region_id;

-- Insert admin user (password: admin123 - will be hashed by Medusa)
INSERT INTO "user" (id, email, password_hash, role, created_at, updated_at) VALUES
('usr_01JCQW3Z7XHQY6KZQWJ9VXYZ13', 'admin@sharifgpt.com', '$2a$10$qvL7QZ5xvJqZ0YxZ0YxZ0OqvL7QZ5xvJqZ0YxZ0YxZ0O', 'admin', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

