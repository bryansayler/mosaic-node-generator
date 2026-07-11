# Generative AI Mosaic Vision

This project currently builds mosaics by matching an input image's grid cells to the closest existing tile image. A modern generative AI version can extend that idea: instead of relying only on a static tile folder, it can create new people-centric images on demand so each generated tile both looks meaningful on its own and contributes to the larger mosaic when seen from a distance.

## Product concept

Imagine a mosaic builder that accepts:

- A target portrait, group photo, logo, or scene that should appear as the large-scale image.
- A creative brief for the individual tiles, such as "warm candid portraits of community volunteers" or "diverse futuristic avatars in a studio lighting style."
- Constraints for identity, consent, style, color palette, diversity, and safety.

The system then generates a library of tile images whose average color, contrast, and composition are intentionally steered toward the cells they need to fill. The result is a double image: up close, viewers see many unique generated people or portraits; from afar, those pictures resolve into the larger source image.

## Modern pipeline

1. **Analyze the target image**
   - Resize the target into a mosaic grid.
   - Compute each cell's target average color, luminance, edge strength, and optional semantic hints.
   - Group cells into prompt batches so similar regions can share styles while preserving variation.

2. **Generate or retrieve candidate tiles**
   - First search a consented asset library for existing approved images.
   - If no tile is close enough, generate a new tile from a prompt that includes the cell's color target, mood, composition, and safety constraints.
   - Produce multiple candidates per cell when quality or color accuracy matters.

3. **Evaluate candidates**
   - Score each candidate by average color distance, perceptual similarity, face/person quality, prompt adherence, and safety checks.
   - Reject images with identity risks, artifacts, policy violations, or poor color fit.
   - Store accepted tiles with metadata for reproducibility.

4. **Assemble the mosaic**
   - Choose the best tile for each grid cell while avoiding obvious local repetition.
   - Optionally apply lightweight color grading to tiles to improve far-distance readability.
   - Render the final mosaic at web, print, or poster resolution.

5. **Audit and export**
   - Export the finished image plus a manifest describing prompts, model versions, generated asset IDs, consent status, and safety review decisions.
   - Preserve enough metadata to regenerate or review the work later.

## Suggested architecture

The existing code can evolve without throwing away the core mosaic algorithm:

- Keep an `Image` abstraction for reading, resizing, compositing, and measuring colors.
- Add a `TileProvider` abstraction that can return candidate tiles for a cell.
- Implement providers for local folders, thumbnail caches, generated AI images, and hybrid retrieval-plus-generation flows.
- Add a `TileScorer` that separates color matching, aesthetic scoring, safety scoring, and repetition penalties.
- Add a manifest writer so generated mosaics are traceable and reproducible.

A possible TypeScript shape:

```ts
interface MosaicCellIntent {
  row: number;
  col: number;
  targetRgb: RGB;
  luminance: number;
  promptHint?: string;
}

interface TileCandidate {
  image: Image;
  source: 'local' | 'generated' | 'retrieved';
  averageRgb: RGB;
  metadata: Record<string, unknown>;
}

interface TileProvider {
  getCandidates(intent: MosaicCellIntent): Promise<TileCandidate[]>;
}

interface TileScorer {
  score(intent: MosaicCellIntent, candidate: TileCandidate): Promise<number>;
}
```

## People-image safeguards

Because this vision centers on generated images of people, the system should treat trust and consent as core features rather than afterthoughts:

- Prefer synthetic or explicitly consented source imagery.
- Avoid generating real private people or public figures unless the user has rights and the use case is allowed.
- Store prompt, model, seed, and moderation metadata for every generated tile.
- Provide controls for demographic representation without stereotyping or tokenizing.
- Make generated or synthetic content provenance visible in exported manifests.
- Keep a human review path for public, commercial, political, or sensitive deployments.

## Roadmap

### Phase 1: Prompted tile generation prototype

- Add a `TileProvider` interface.
- Keep the existing folder-based provider as the default.
- Add a mock generative provider that creates deterministic placeholder tiles for tests.
- Write manifests for generated runs.

### Phase 2: AI provider integration

- Add a real image generation provider behind configuration flags.
- Batch generation requests by similar target colors and prompt styles.
- Cache generated tiles by prompt, seed, dimensions, and model version.

### Phase 3: Quality and safety scoring

- Cache tile average colors so scoring does not recompute every tile repeatedly.
- Add safety and artifact rejection before tiles can enter the candidate pool.
- Add optional color correction for generated tiles.

### Phase 4: Creator workflow

- Provide presets for portraits, avatars, community walls, brand campaigns, and event mosaics.
- Add preview modes for close-up tile inspection and far-distance readability.
- Export print-ready images and provenance manifests.

## New contributor starting points

If you are new to this codebase and want to work toward this vision, start with:

1. `lib/mosaic-image.ts`, where cells are processed and tiles are selected.
2. `lib/image.ts` and `lib/jimp-image.ts`, where the image abstraction lives.
3. `lib/rgb.ts`, where color distance is currently defined.
4. `index.ts` and `cli.ts`, where API and CLI inputs should eventually expose provider options.

The best first technical improvement is to cache each tile's average color once during tile loading. That change would make both the current local-tile workflow and a future generated-tile workflow easier to scale.
