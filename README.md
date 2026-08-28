[![Build Status](https://travis-ci.org/Dellos7/mosaic-node-generator.svg?branch=master)](https://travis-ci.org/Dellos7/mosaic-node-generator) [![npm version](https://badge.fury.io/js/mosaic-node-generator.svg)](https://badge.fury.io/js/mosaic-node-generator) [![HitCount](http://hits.dwyl.io/Dellos7/mosaic-node-generator.svg)](http://hits.dwyl.io/Dellos7/mosaic-node-generator)

# mosaic-node-generator
A Node module to generate mosaic images.

[<img src="https://github.com/Dellos7/mosaic-node-generator-example/raw/master/input.jpg" width="300" align="left" />](https://github.com/Dellos7/mosaic-node-generator-example/raw/master/input.jpg)

[<img src="https://github.com/Dellos7/mosaic-node-generator-example/blob/master/outputs/output_rc-100_30x30.jpg" width="300" />](https://github.com/Dellos7/mosaic-node-generator-example/blob/master/outputs/output_rc-100_30x30.jpg)


## Generative AI mosaic vision

A modern version of this project could generate people-centric tile images on demand instead of relying only on a static tile folder. See [Generative AI Mosaic Vision](docs/generative-ai-mosaic-vision.md) for a proposed product direction, architecture, safeguards, and roadmap.

### Open-source integration catalog

The machine-readable [integration catalog](integrations/catalog.json) maps generation engines, vision and semantic scoring, retrieval, safety, provenance, storage, orchestration, policy, observability, identity, and supply-chain tooling to their possible pipeline roles. Its `tier` describes whether the **capability** is critical; alternatives in the same role are not all required in a production deployment. Entries marked `review` have licensing or operational caveats that must be resolved before use.

Explore it as a sortable, searchable, filterable table:

```sh
npm run integrations:catalog
# open http://localhost:8080/docs/integration-catalog.html
```

Preview or shallow-clone the upstream repositories into the ignored `.integrations/` workspace:

```sh
npm run integrations:list
npm run integrations:install:critical
npm run integrations:install
```

Cloning does not execute, build, configure, or endorse upstream code. Pin reviewed commits, scan dependencies and containers, verify model licenses separately, and deploy only the integrations selected in an architecture review. The installer is idempotent for existing directories and accepts `--destination=PATH`.

## Installation

You must have [Node.js](https://nodejs.org/es/) installed in your system.

Using **npm**:
```sh
npm install mosaic-node-generator --save
```

## ChatGPT and Codex development environment

This repository includes durable agent guidance in [`AGENTS.md`](AGENTS.md) and a repeatable setup script for hosted coding environments.

When creating a ChatGPT/Codex environment for this repository:

1. Connect the environment to the GitHub repository.
2. Select an image with Node.js and npm installed.
3. Use the following setup command:

   ```sh
   ./scripts/setup-environment.sh
   ```

4. Leave secrets out of the setup script and repository. Add any future credentials through the environment's encrypted secrets settings instead.
5. Allow the setup step network access so `npm ci` can install the dependencies pinned in `package-lock.json`.

The setup script checks for Node.js and npm, installs the locked dependencies, and compiles the TypeScript sources. Agents should read `AGENTS.md` before changing the project and run the validation commands documented there before submitting work.

## Example

Example: [mosaic-node-generator-example](https://github.com/Dellos7/mosaic-node-generator-example)

## Code usage

### Javascript

**Easy example**. Create a mosaic image from picture `picture.jpg` using the tiles from the folder `pictures_folder`.

```javascript
var mosaic = require('mosaic-node-generator');
mosaic.mosaic( 
  'picture.jpg', 
  'pictures_folder' 
);
```

```javascript
/**
 * Generates a mosaic image
 * @param inputImagePath The path of the input image that will be used to generate the mosaic
 * @param tilesDirectory The tiles directory we will use to read the images we will use in the mosaic generation
 * @param cellWidth The width (in pixels) of each cell in the mosaic
 * @param cellHeight The height (in pixels) of each cell in the mosaic
 * @param columns The number of columns (of tiles) of the mosaic
 * @param rows The number of rows (of tiles) of the mosaic
 * @param thumbsDirectoryFromRead We will use this folder in order to read the already generated thumbs from it
 * @param thumbsDirectoryToWrite We will use this folder in order to write the generated thumbs of the tiles
 * @param enableConsoleLogging Enable console logging
 */
function mosaic( 
  inputImagePath: string, 
  tilesDirectory?: string, 
  cellWidth?: number, 
  cellHeight?: number, 
  columns?: number, 
  rows?: number, 
  thumbsDirectoryFromRead?: string, thumbsDirectoryToWrite?: string, 
  enableConsoleLogging?: boolean
): void;
```

### TypeScript

> TODO

```typescript
```

## CLI usage

### Install

Install npm package as global:

```sh
npm install mosaic-node-generator -g
```

### Usage

```sh
mosaic-node-generator --help
```
```
Options:

-V, --version                                output the version number
    -i, --input-image [input_image]              The input image path
    -d, --tiles-directory [tiles_directory]      The tiles directory path
    -R, --thumbs-read [thumbs_read_directory]    The thumbnails read directory
    -W, --thumbs-write [thumbs_write_directory]  The thumbnails write directory
    -r, --rows [rows]                            The number of rows of the output image
    -c, --columns [columns]                      The number of columns of the output image
    -w, --cell-width [width]                     The cell width of each cell of the output image
    -h, --cell-height [height]                   The cell height of each cell of the output image
    -l, --disable-log [true/false]               Disable console logging
    -h, --help                                   output usage information
```

### Usage example
Basic example. Create mosaic from input image and pictures folder. Write the generated thumbs from the pictures so next time we can just read the thumbs and not the pictures again:

```sh
mosaic-node-generator -i photo.jpg -d pictures_folder -W thumbs
```

Then we generate the mosaic again but this time reading from the thumbs generated from the last execution:

```sh
mosaic-node-generator -i photo.jpg  -R thumbs
```
> We must take into account that if we have written the thumbnails using e.g `cell_width` and `cell_height` of 50x50 and then we generate again the mosaic reading from these thumbs, we should use a `cell_width` and `cell_height` of 50x50 again.

## Test 

Run Typescript tests:
```sh
npm run test:ts
```
