/*
classes applied on individual slides:

  in1      - slide has at least one pixel in view
  in25      - slide is 25% or more in view
  in50      - slide is 50% or more in view
  in75      - slide is 75% or more in view

  active    - the active slide (most in view)
  inactive  - all other slides

custom properties applied to body:

  --slide    - active slide (0-n)
  --progress  - progress through whole presentation (0-1)

custom properties applied to individual slides:

  --inview    - proportion of slide in view (0-1)

JavaScript "active" event raised on slide item when fully in view.

  event detail property is an object:
    .slideElement - active slide's DOM node
    .slideNumber  - active slide number (0-n)

todo:
this is a mess and could do with a refactor!

*/
const
  slides = document.querySelector('.slides'),
  slideItem = slides && Array.from(slides.children),
  animClass = {
    in1: 0,
    in25: 0.25,
    in50: 0.50,
    in75: 0.75
  };

let currentSlide;

if (slides) {

  // ensure slide has an ID
  slideItem.forEach((c, i) => {
    c.id = c.id || `s${ i+1 }`;
  });

  // scroll handler
  slides.addEventListener('scroll', slideMove, { passive: true });
  slides.addEventListener('resize', slideMove, { passive: true });

  // active slide listener
  // slides.addEventListener('active', e => console.log(e.detail));

  // move to correct slide
  if (location.hash) {
    slideShow( location.hash.slice(1) );
  }

  // move to correct slide after
  window.addEventListener('popstate', e => {

    if (e?.state?.hash) {
      slideShow( e.state.hash );
    }

  });

  // apply initial values
  slideMove();

}

// slides are being moved
function slideMove() {

  const
    scrollHeight = slides.scrollHeight,
    slideHeight = slides.clientHeight,
    slideTop = slides.scrollTop,
    activeSlide = Math.floor(slideTop / slideHeight);

  // set --active to current side
  document.body.style.setProperty('--slide', activeSlide);

  // set --progress from 0 (at top) to 1 (at end) of whole presentation
  document.body.style.setProperty('--progress', slideTop / (scrollHeight - slideHeight));

  slideItem.forEach((c, i) => {

    // set --inview from 0 (fully out) to 1 (fully in) on each slide
    const inview = Math.max(0, 1 - Math.abs(slideTop - i * slideHeight) / slideHeight);
    c.style.setProperty('--inview', inview);

    // apply classes and raise custom events
    for (const cName in animClass) {
      if (inview > animClass[cName]) {
        c.classList.add(cName);
      }
      else {
        c.classList.remove(cName);
      }
    }

    // set active and inactive
    if (activeSlide !== currentSlide) {

      if (i === activeSlide) {
        c.classList.remove('inactive');
        c.classList.add('active');
      }
      else {
        c.classList.remove('active');
        c.classList.add('inactive');
      }

    }

  });

  // new active slide event
  if (activeSlide !== currentSlide) {

    currentSlide = activeSlide;

    // set target and history
    const hash = slideItem[currentSlide].id || '';

    if (hash && window.location.hash !== '#' + hash) {
      history.pushState({ hash }, '', '#' + hash);
    }

    // slide active event
    const
      slideElement = slideItem[currentSlide],
      inviewEvent = new CustomEvent('active', {
        bubbles: true,
        detail: { slideElement, slideNumber: currentSlide }
      });

    slideElement.dispatchEvent(inviewEvent);
  }

}


// show a specific slide
function slideShow(id) {

  const sId = document.getElementById( id );
  if (sId) {
    slides.scrollTop = sId.offsetTop;
  }

}
