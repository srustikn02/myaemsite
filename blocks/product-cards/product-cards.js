import { createOptimizedPicture } from '../../scripts/aem.js';
import { fetchPlaceholders } from '../../scripts/placeholders.js';

function getLanguagePrefix() {
  const segs = window.location.pathname.split('/').filter(Boolean);
  return (segs.length > 0 && segs[0].length === 2) ? `/${segs[0]}` : 'default';
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders(getLanguagePrefix());
  const addToCartText = placeholders.addToCart || 'Add to Cart';
  const currency = placeholders.currencySymbol || '$';

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];

    // col 0 - image
    const imgWrap = document.createElement('div');
    imgWrap.className = 'product-cards-image';
    const pic = cols[0]?.querySelector('picture');
    if (pic) {
      const img = pic.querySelector('img');
      if (img) {
        imgWrap.append(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '400' }]));
      }
    }
    li.append(imgWrap);

    // col 1..4 - body
    const body = document.createElement('div');
    body.className = 'product-cards-body';

    const name = cols[1]?.textContent.trim();
    if (name) {
      const h3 = document.createElement('h3');
      h3.textContent = name;
      body.append(h3);
    }

    const desc = cols[2]?.textContent.trim();
    if (desc) {
      const p = document.createElement('p');
      p.className = 'product-cards-description';
      p.textContent = desc;
      body.append(p);
    }

    const price = cols[3]?.textContent.trim();
    if (price) {
      const p = document.createElement('p');
      p.className = 'product-cards-price';
      p.textContent = `${currency}${price}`;
      body.append(p);
    }

    const cta = cols[4]?.querySelector('a');
    const wrapper = document.createElement('p');
    wrapper.className = 'button-wrapper';
    if (cta) {
      cta.className = 'button primary';
      cta.textContent = addToCartText;
      wrapper.append(cta);
    } else {
      const btn = document.createElement('button');
      btn.className = 'button primary';
      btn.textContent = addToCartText;
      wrapper.append(btn);
    }
    body.append(wrapper);

    li.append(body);
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
