import { Prisma } from '@prisma/client';

export function getProductSortOption(sort?: string): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case 'price_asc':
      return { price: 'asc' };
    case 'price_desc':
      return { price: 'desc' };
    case 'popularity':
      return { sales: 'desc' };
    case 'oldest':
      return { createdAt: 'asc' };
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
}

export function getOrderSortOption(sort?: string): Prisma.OrderOrderByWithRelationInput {
  switch (sort) {
    case 'amount_asc':
      return { totalAmount: 'asc' };
    case 'amount_desc':
      return { totalAmount: 'desc' };
    case 'oldest':
      return { createdAt: 'asc' };
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
}
