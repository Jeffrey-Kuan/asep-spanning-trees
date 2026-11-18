# Spanning Trees

A small Ximera course holding TikZ pictures of spanning trees on the eight
four-site states 2222, 2233, 2323, 2332, 3223, 3232, 3322 and 3333. It was
started from the ximera-sandbox repository. The site is published at
https://jeffrey-kuan.github.io/asep-spanning-trees/ . It is built with the npm-based
Ximera toolchain (`tex4npm` and the `@ximera/*` packages), which turns LaTeX
sources into a static website. GitHub Actions does the build; nothing has to be
installed on your own computer.

## What is here

    src/trees.tex              the course ("xourse") file: title and list of activities
    src/preamble.tex           macros and TikZ libraries shared by every activity
    src/tree-2222/main.tex     one tree starting with 2222, drawn in TikZ
    src/intent.cfg             MathJax setup for intent: \xmunits, \xmabs
    src/custom.css             site-specific styling
    static/                    hand-written files, copied into the site as they are
    static/answer-a11y.js      screen reader support for \answer boxes, loaded on every page
    latex/xmintent.sty         the intent commands for the LaTeX side of the build
    package.json               the Ximera packages the build uses
    tex4npm.config.js          where sources live (src) and where output goes (dist)
    .github/workflows/deploy.yml   the build, GitHub Pages, and the optional upload to S3

## Adding an activity

1. Create a folder under `src/` with a `main.tex` in it, for example
   `src/my-topic/main.tex`. Copying `src/tree-2222/main.tex` is the easiest start.
2. Add `\activity{my-topic/main}` to `src/trees.tex`.
3. Push. The Actions tab shows a green check when the site builds, or a red X
   with the LaTeX error if it does not.

## Editing in Overleaf

1. In Overleaf, choose New project > Import from GitHub and pick this repository.
   GitHub sync needs a premium Overleaf plan.
2. Edit, then use Menu > GitHub > Push Overleaf changes to GitHub. Sync is
   manual; each push starts a build.
3. If the repository changed on GitHub since your last sync, pull those changes
   into Overleaf first (Menu > GitHub > Pull GitHub changes into Overleaf).

Overleaf's Recompile button only makes a PDF preview. It does not run the web
build, so the Actions run is the real check.

## Publishing to S3 (optional)

Without any settings the workflow builds and publishes to GitHub Pages only. To publish, add these under
Settings > Secrets and variables > Actions:

- Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- Variables: `S3_BUCKET`, `AWS_REGION`, and optionally `S3_PREFIX`

`S3_PREFIX` puts the site in a folder of the bucket, so the course page is at
`http://BUCKET.s3-website.REGION.amazonaws.com/PREFIX/trees.html`.

The deploy removes files that are no longer part of the site. With a prefix it
only touches that folder. Without a prefix it covers the whole bucket, so do
not point a prefix-less deploy at a bucket that holds anything else.

## MathML intent

`src/intent.cfg` makes `\xmunits{cm}` and `\xmabs{x}` (inside math) carry the
MathML `intent` attribute on the web page, so NVDA or JAWS with MathCAT reads
them as a unit and as an absolute value. It also turns on MathJax's assistive
MathML for every formula on the site. The build inserts the file into
`ximera.cfg`; delete `src/intent.cfg` to switch all of this off.

The commands are only defined for the web page. The PDF pass of the build
reports them as undefined and carries on.

## Workarounds in this repository

These work around problems in the published 2.0.0 packages and can be removed
once fixed versions are released.

- `package.json` pins `@modulus-learning/agent` to 0.9.1. `@ximera/core` 2.0.0
  imports a `ModulusAgent` class that later agent versions replaced, so the
  build fails without the pin.
- `package.json` pins `math-expressions` to 2.0.0-alpha96, the version the
  answer checker was written against. The newer 3.0.0 alpha is a rewrite, and
  with it correct answers were marked wrong.
- The workflow patches `tex4npm` after install. Without the patch, photos
  (PNG or JPG) show as broken on the copy of each activity that sits inside a
  course folder, because the image link points one folder too high.
- The workflow patches `@ximera/answer` after install. Without the patch,
  `\answer` inside display math is not turned into an input box and shows up
  on the page as a red `\answer`.

Known limitation: `tex4npm` 2.0.0 recompiles every file on every build, so
build time grows with the size of the course.
