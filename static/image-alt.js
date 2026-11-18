// Attach alt text from \xmalt to its picture for screen readers.
//
// The Ximera build writes each picture as
//   <div class="image-environment" role="img" aria-labelledby="image-alt-N">
// but no element on the page carries the id image-alt-N, so the picture has no
// accessible name. The alt text itself sits in the "Show Alt Text" block
// (<details>) that \xmalt produces, either inside that div or, for a figure
// with a caption, after it inside the same figure. This script copies that
// text into aria-label on the div. Pictures without \xmalt are left alone.

function altTextFor(box) {
  let details = box.querySelector('details');
  if (!details) {
    for (let el = box.nextElementSibling; el; el = el.nextElementSibling) {
      if (el.matches('.image-environment')) break;
      if (el.matches('details')) { details = el; break; }
    }
  }
  if (!details) return '';
  const copy = details.cloneNode(true);
  copy.querySelectorAll('summary').forEach((s) => s.remove());
  return copy.textContent.replace(/\s+/g, ' ').trim();
}

function labelPictures() {
  document.querySelectorAll('.image-environment[aria-labelledby]').forEach((box) => {
    const id = box.getAttribute('aria-labelledby');
    if (id && document.getElementById(id)) return;
    const text = altTextFor(box);
    if (!text) return;
    box.setAttribute('aria-label', text);
    box.removeAttribute('aria-labelledby');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', labelPictures);
} else {
  labelPictures();
}
