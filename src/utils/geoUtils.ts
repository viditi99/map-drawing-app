import * as turf from '@turf/turf';
import type { Feature } from 'geojson';

export function isFullyEnclosing(
  newFeature: Feature<any, any>,
  existingFeatures: Feature<any, any>[]
): boolean {
  return existingFeatures.some((f) =>
    turf.booleanContains(newFeature as any, f as any)
  );
}

export function trimOverlap(
  newFeature: Feature<any, any>,
  existingFeatures: Feature<any, any>[]
): Feature<any, any> | null {
  let result: any = newFeature;

  for (const f of existingFeatures) {
    const diff = turf.difference(
  turf.featureCollection([result, f]) as any
);
    if (diff) {
      result = diff;
    }
  }
  return result;
}