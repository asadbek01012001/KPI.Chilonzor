export class CrimesResponse {
  id!: string;
  regionId!: string;

  totalCrimes!: number;
  minorCrimes!: number;
  mediumCrimes!: number;
  seriousCrimes!: number;
  criticalCrimes!: number;
}
