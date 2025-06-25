export function buildProductFilter(params: {
  categoryId?: string;
  subcategoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
}) {
  const where: any = {};

  if (params.subcategoryId) {
    where.subcategoryId = params.subcategoryId;
  }

  if (params.categoryId) {
    where.subcategory = { categoryId: params.categoryId };
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = +params.minPrice;
    if (params.maxPrice) where.price.lte = +params.maxPrice;
  }

  if (params.inStock === 'true') {
    where.stock = { gt: 0 };
  }

  return where;
}

export function buildOrderFilter(params: {
  status?: string;
}) {
  const filters: any = {};

  if (params.status) {
    filters.status = params.status;
  }

  return filters;
}

