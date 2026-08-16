ALTER TABLE "Product" ADD COLUMN "WooCommerceId" INTEGER;

CREATE UNIQUE INDEX "Product_WooCommerceId_key" ON "Product"("WooCommerceId");

CREATE TABLE "Color" (
	"ColorId" SERIAL NOT NULL,
	"ColorName" VARCHAR(50) NOT NULL,
	"HexCode" VARCHAR(7),
	CONSTRAINT "Color_pkey" PRIMARY KEY ("ColorId")
);

CREATE TABLE "Size" (
	"SizeId" SERIAL NOT NULL,
	"SizeName" VARCHAR(50) NOT NULL,
	CONSTRAINT "Size_pkey" PRIMARY KEY ("SizeId")
);

CREATE TABLE "ProductVariant" (
	"VariantId" SERIAL NOT NULL,
	"ProductId" INTEGER NOT NULL,
	"ColorId" INTEGER,
	"SizeId" INTEGER,
	"Quantity" INTEGER NOT NULL DEFAULT 0,
	"Price" DECIMAL(10,2),
	CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("VariantId")
);

CREATE UNIQUE INDEX "ProductVariant_ProductId_ColorId_SizeId_key"
ON "ProductVariant"("ProductId", "ColorId", "SizeId");

ALTER TABLE "ProductVariant"
ADD CONSTRAINT "ProductVariant_ProductId_fkey"
FOREIGN KEY ("ProductId") REFERENCES "Product"("ProductId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductVariant"
ADD CONSTRAINT "ProductVariant_ColorId_fkey"
FOREIGN KEY ("ColorId") REFERENCES "Color"("ColorId") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProductVariant"
ADD CONSTRAINT "ProductVariant_SizeId_fkey"
FOREIGN KEY ("SizeId") REFERENCES "Size"("SizeId") ON DELETE SET NULL ON UPDATE CASCADE;