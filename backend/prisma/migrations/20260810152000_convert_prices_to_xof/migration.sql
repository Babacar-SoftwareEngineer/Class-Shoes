-- Convert all existing monetary values from EUR-equivalent units to FCFA.
-- New prices must be inserted directly in FCFA.
BEGIN;

UPDATE "Product"
SET "Price" = ROUND("Price" * 655.957, 2);

UPDATE "ProductVariant"
SET "Price" = ROUND("Price" * 655.957, 2)
WHERE "Price" IS NOT NULL;

UPDATE "Coupon"
SET "DiscountAmount" = ROUND("DiscountAmount" * 655.957, 2);

UPDATE "OrderItem"
SET
  "Price" = ROUND("Price" * 655.957, 2),
  "TotalCost" = ROUND("TotalCost" * 655.957, 2);

UPDATE "Orders"
SET "TotalAmount" = ROUND("TotalAmount" * 655.957, 2);

UPDATE "PaymentInformation"
SET "PaymentAmount" = ROUND("PaymentAmount" * 655.957, 2);

COMMIT;
