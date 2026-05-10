-- Add latitude and longitude columns to Order table for map pin location
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "lat" Double Precision;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "lng" Double Precision;