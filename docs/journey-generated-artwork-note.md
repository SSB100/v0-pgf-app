# Journey generated artwork replacement

Modules 11–27 use original generated raster artwork rather than the simple vector placeholders introduced in the earlier visual pass. Modules 1–10 remain unchanged.

The generated artwork is packed into one optimized 5×4 WebP sprite and stored as three base64 text chunks because the connected repository writer accepts UTF-8 file content rather than direct binary uploads. The Journey hero component reconstructs the sprite once in the browser, caches the promise for the session, and uses CSS background positioning to show the correct 16:9 tile for each module. If loading the generated artwork fails, the previous local SVG remains available as a fallback.

The tile order is fixed in Journey order for modules 11–27. Every generated tile has module-specific accessible alternative text.
