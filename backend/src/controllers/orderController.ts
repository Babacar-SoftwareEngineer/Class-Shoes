import type { Request, Response } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import prisma from '../config/db.js';
import { BadRequestError, NotFoundError } from '../errors/AppError.js';
import type { AuthenticatedRequest } from '../middlewares/auth.js';

type CreateOrderBody = {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    region: string;
    city: string;
    address: string;
  };
  paymentMethod: 'mobile-money' | 'orange-money' | 'delivery';
  items: Array<{
    productId: number;
    quantity: number;
  }>;
};

const normalizeItems = (items: CreateOrderBody['items']): Array<{ productId: number; quantity: number }> => {
  const aggregated = new Map<number, number>();

  for (const item of items) {
    aggregated.set(item.productId, (aggregated.get(item.productId) ?? 0) + item.quantity);
  }

  return Array.from(aggregated, ([productId, quantity]) => ({ productId, quantity }));
};

export async function createOrder(req: Request, res: Response): Promise<void> {
  const { customer, paymentMethod, items } = req.body as CreateOrderBody;
  const normalizedItems = normalizeItems(items);
  const userId = (req as AuthenticatedRequest).user?.userId ?? null;
  const initialStatus = paymentMethod === 'delivery' ? 'pending_confirmation' : 'pending_payment';

  const result = await prisma.$transaction(async (tx) => {
    const productIds = normalizedItems.map((item) => item.productId);
    const products = await tx.product.findMany({
      where: {
        ProductId: { in: productIds },
        IsActive: true,
      },
      select: {
        ProductId: true,
        ProductName: true,
        Price: true,
        Quantity: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundError('Un ou plusieurs produits du panier sont indisponibles.');
    }

    const productsById = new Map(products.map((product) => [product.ProductId, product]));
    let totalAmount = new Prisma.Decimal(0);

    for (const item of normalizedItems) {
      const product = productsById.get(item.productId);
      if (!product) {
        throw new NotFoundError('Un produit du panier est introuvable.');
      }

      if (product.Quantity < item.quantity) {
        throw new BadRequestError(`Le stock est insuffisant pour "${product.ProductName}".`);
      }
    }

    const order = await tx.orders.create({
      data: {
        UserId: userId,
        CustomerName: customer.fullName,
        CustomerEmail: customer.email,
        CustomerPhone: customer.phone,
        ShippingRegion: customer.region,
        ShippingCity: customer.city,
        ShippingAddress: customer.address,
        TotalAmount: new Prisma.Decimal(0),
      },
      select: {
        OrderId: true,
      },
    });

    for (const item of normalizedItems) {
      const product = productsById.get(item.productId);
      if (!product) {
        throw new NotFoundError('Un produit du panier est introuvable.');
      }

      const unitPrice = new Prisma.Decimal(product.Price.toString());
      const lineTotal = unitPrice.mul(item.quantity);
      totalAmount = totalAmount.add(lineTotal);

      await tx.orderItem.create({
        data: {
          OrderId: order.OrderId,
          ProductId: product.ProductId,
          Quantity: item.quantity,
          Price: unitPrice,
          TotalCost: lineTotal,
        },
      });

      await tx.product.update({
        where: { ProductId: product.ProductId },
        data: {
          Quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    const updatedOrder = await tx.orders.update({
      where: { OrderId: order.OrderId },
      data: {
        TotalAmount: totalAmount,
      },
    });

    await tx.paymentInformation.create({
      data: {
        OrderId: order.OrderId,
        PaymentAmount: totalAmount,
        PaymentMethod: paymentMethod,
      },
    });

    await tx.orderStatus.create({
      data: {
        OrderId: order.OrderId,
        StatusName: initialStatus,
      },
    });

    return updatedOrder;
  });

  res.status(201).json({
    success: true,
    message: 'Commande créée avec succès.',
    data: {
      orderId: result.OrderId,
      totalAmount: result.TotalAmount.toString(),
      status: paymentMethod === 'delivery' ? 'pending_confirmation' : 'pending_payment',
      customer: {
        fullName: customer.fullName,
        email: customer.email,
      },
    },
  });
}
