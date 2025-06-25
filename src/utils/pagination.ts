export function getPaginationParams(
  page: string | number = 1,
  limit: string | number = 10,
) {
  const pageNumber = Math.max(Number(page) || 1, 1);
  const pageSize = Math.max(Number(limit) || 10, 1);
  const skip = (pageNumber - 1) * pageSize;
  const take = pageSize;

  return { page: pageNumber, limit: pageSize, skip, take };
}
