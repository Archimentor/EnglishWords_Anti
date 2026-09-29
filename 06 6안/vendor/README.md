# Build-only Markdown dependency

`marked.mjs` is the unmodified ESM distribution of **Marked 18.0.14**, downloaded from the official npm package. MIT license: `LICENSE`.

The npm archive's SHA-512 integrity was checked before extraction:

`sha512-mBHK6FBHuBAlhgRe88w9F0O1AbwwXJUcQibUbC/QcdTbVGAD7aWza+xt3N6oT/jCZx3/OMeS+8rnuiHZcQ9s7A==`

Used only by the Node content builder, never loaded by the learning app. `reader-build.mjs` overrides raw HTML, image and link rendering; imported manuscripts cannot execute HTML or load tracking images. Rich Markdown is compiled to local static bundles for GitHub Pages.

Documentation: https://marked.js.org/using_pro
