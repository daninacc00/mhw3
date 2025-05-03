// ----------------[HEADER & HERO SECTION]--------------------------

const nav = document.getElementById('mainNav');
const hero = document.getElementById('heroSection');
const categoryTitle = document.getElementById('categoryTitle');
const navHeight = nav.offsetHeight;
let lastScrollTop = 0;

window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > navHeight) {
        nav.classList.add('nav-fixed');
        categoryTitle.classList.add('category-small');
        hero.classList.add('content-padding');
    } else {
        nav.classList.remove('nav-fixed');
        categoryTitle.classList.remove('category-small');
        hero.classList.remove('content-padding');
    }

    lastScrollTop = scrollTop;
});


const menuItems = document.querySelectorAll('.menu li a');
menuItems.forEach(item => {
    item.addEventListener('mouseover', function () {
        this.style.borderBottom = '2px solid #111';
    });

    item.addEventListener('mouseout', function () {
        this.style.borderBottom = 'none';
    });
});

// ----------------[HERO BANNER]-----------------------

const bannerSlider = document.querySelector('.banner-slider');
let slidePosition = 0;

function toggleSlide() {
    slidePosition = slidePosition === 0 ? -50 : 0;
    bannerSlider.style.transform = `translateX(${slidePosition}%)`;
}

setInterval(toggleSlide, 5000);

// --------------------[CAROUSEL]---------------------------------

const carousel = document.getElementById('productCarousel');
const prevButton = document.querySelector('.slider-controls .slider-btn.prev');
const nextButton = document.querySelector('.slider-controls .slider-btn.next');
const itemWidth = document.querySelector('.carousel-item').offsetWidth + 20; // width + gap
let currentPosition = 0;
const totalItems = document.querySelectorAll('.carousel-item').length;
const visibleItems = 3; // Number of items visible at once
const maxPosition = Math.max(0, totalItems - visibleItems);

prevButton.addEventListener('click', function () {
    if (currentPosition > 0) {
        currentPosition--;
        updateCarouselPosition();
    }
});

nextButton.addEventListener('click', function () {
    if (currentPosition < maxPosition) {
        currentPosition++;
        updateCarouselPosition();
    }
});

function updateCarouselPosition() {
    carousel.style.transform = `translateX(-${currentPosition * itemWidth}px)`;
}


