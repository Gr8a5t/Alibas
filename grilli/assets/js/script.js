'use strict';



/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

// Only run slider logic if slider elements exist (not on menu.html etc.)
if (heroSlider && heroSliderItems.length && heroSliderPrevBtn && heroSliderNextBtn) {

  let currentSlidePos = 0;
  let lastActiveSliderItem = heroSliderItems[0];

  const updateSliderPos = function () {
    lastActiveSliderItem.classList.remove("active");
    heroSliderItems[currentSlidePos].classList.add("active");
    lastActiveSliderItem = heroSliderItems[currentSlidePos];
  }

  const slideNext = function () {
    if (currentSlidePos >= heroSliderItems.length - 1) {
      currentSlidePos = 0;
    } else {
      currentSlidePos++;
    }
    updateSliderPos();
  }

  heroSliderNextBtn.addEventListener("click", slideNext);

  const slidePrev = function () {
    if (currentSlidePos <= 0) {
      currentSlidePos = heroSliderItems.length - 1;
    } else {
      currentSlidePos--;
    }
    updateSliderPos();
  }

  heroSliderPrevBtn.addEventListener("click", slidePrev);

  /**
   * auto slide
   */

  let autoSlideInterval;

  const autoSlide = function () {
    autoSlideInterval = setInterval(function () {
      slideNext();
    }, 7000);
  }

  addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
    clearInterval(autoSlideInterval);
  });

  addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

  window.addEventListener("load", autoSlide);

}



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});


/**
 * MENU MODAL
 */

const menuModal = document.querySelector("[data-menu-modal]");
const menuModalOverlay = document.querySelector("[data-menu-modal-overlay]");
const menuModalCloseBtn = document.querySelector("[data-menu-modal-close]");
const menuModalImg = document.querySelector("[data-menu-modal-img]");
const menuModalTitle = document.querySelector("[data-menu-modal-title]");
const menuModalPrice = document.querySelector("[data-menu-modal-price]");
const menuModalDesc = document.querySelector("[data-menu-modal-desc]");
const addToCartBtn = document.querySelector("[data-add-to-cart-btn]");
const menuCards = document.querySelectorAll(".menu-card");

const closeMenuModal = function () {
  if (menuModal) {
    menuModal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

if (menuModal) {
  addEventOnElements([menuModalOverlay, menuModalCloseBtn], "click", closeMenuModal);
}

if (menuCards && menuModal) {
  addEventOnElements(menuCards, "click", function (event) {
    // prevent default anchor behavior if clicked on title
    if (event.target.tagName === 'A') {
      event.preventDefault();
    }

    const img = this.querySelector("img");
    const title = this.querySelector(".card-title");
    const price = this.querySelector(".title-2");
    const desc = this.querySelector(".card-text");

    if (img) {
      menuModalImg.src = img.src;
      menuModalImg.alt = img.alt || "Menu Item";
    }
    if (title) menuModalTitle.textContent = title.textContent.trim();
    if (price) menuModalPrice.textContent = price.textContent.trim();
    if (desc) menuModalDesc.textContent = desc.textContent.trim();

    menuModal.classList.add("active");
    document.body.style.overflow = "hidden"; // prevent background scroll
  });
}

if (addToCartBtn) {
  addToCartBtn.addEventListener("click", function() {
    closeMenuModal();
    // Retrieve title for alert
    const itemName = menuModalTitle ? menuModalTitle.textContent : "Item";
    alert(itemName + " added to cart!");
  });
}