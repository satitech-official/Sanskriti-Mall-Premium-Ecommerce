import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("ships the Sanskriti Mall experience rather than the starter preview", async () => {
  const [home, layout, packageJson, catalog] = await Promise.all([
    readFile(new URL("app/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/layout.tsx", projectRoot), "utf8"),
    readFile(new URL("package.json", projectRoot), "utf8"),
    readFile(new URL("lib/catalog.ts", projectRoot), "utf8"),
  ]);

  assert.match(home, /HomeExperience/);
  assert.match(layout, /Sanskriti Mall/);
  assert.match(layout, /og\.png/);
  assert.doesNotMatch(layout, /codex-preview|SkeletonPreview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(catalog, /Sandstone Linen Overshirt/);
  assert.match(catalog, /Midnight Utility Co-Ord/);
});
