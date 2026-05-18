export function filterByDirection(
  indicators: any[],
  directionId: number,
): any[] {
  return indicators.filter((indicator) => indicator.direction === directionId);
}
