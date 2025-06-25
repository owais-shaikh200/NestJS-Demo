export function buildProductSearchFilter(search?: string) {
  if (!search) return undefined;

  return {
    OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ],
  };
}

export function buildOrderSearchFilter(search?: string) {
  if (!search) return undefined;

  return {
    OR: [
      { id: { contains: search, mode: 'insensitive' } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ],
  };
}
