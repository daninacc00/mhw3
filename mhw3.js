// --------------- [SEARCH BAR]---------------------------

function onOpenSearch(event) {
    const container = event.currentTarget;
    container.classList.add("search-open");

    document.body.style.overflow = 'hidden';
    document.addEventListener("click", onCloseSearchOutside);
}

function onCloseSearch(event) {
    event.stopPropagation();
    let container = document.querySelector("#search-bar-container");
    container.classList.remove("search-open");

  document.body.style.overflow = 'auto';
    document.removeEventListener("click", onCloseSearchOutside);
}

function onCloseSearchOutside(event) {
    let container = document.querySelector("#search-bar-container");
    if (!container.contains(event.target)) {
        onCloseSearch(event);
    }
}


let searchBarContainer = document.querySelector("#search-bar-container");
searchBarContainer.addEventListener("click", onOpenSearch);

let closeSearch = document.querySelector(".close-search-btn");
closeSearch.addEventListener("click", onCloseSearch);




// ---------------- [SLIDER] ------------------------

const sliderImages = [
    { src: 'assets/images/scarpa1.png', alt: 'Air Max', name: "Air Max", href: "air-max-scarpe-a6d8hzy7ok", isFreeShipping: true},
    { src: 'assets/images/scarpa2.png', alt: 'Y2K', name: "Y2K", href: "retro-running-scarpe-8kemkzy7ok"},
    { src: 'assets/images/scarpa3.png', alt: 'Air Force 1', name: "Air Force 1", href: "air-force-1-lifestyle-scarpe-13jrmz5sj3yzy7ok", isFreeShipping: true},
    { src: 'assets/images/scarpa4.png', alt: 'Field General', name: "Field General", href: "nike-field-general-scarpe-3blg9zy7ok"},
    { src: 'assets/images/scarpa5.png', alt: 'Air Jordan', name: "Air Jordan", href: "jordan-scarpe-37eefzy7ok"},
    { src: 'assets/images/scarpa6.png', alt: 'Pegasus', name: "Pegasus", href: "pegasus-running-37v7jz5e1x6z8nexhznik1"},
    { src: 'assets/images/scarpa7.png', alt: 'Metcon', name: "Metcon", href: "metcon-3yxqs"},
    { src: 'assets/images/scarpa8.png', alt: 'Mercurial', name: "Mercurial", href: "mercurial-calcio-scarpe-1gdj0z4f1bzy7ok", isFreeShipping: true}
  ];
  
  let currentIndex = 0;
  const itemsPerPage = 3;
  const step = 1;
  
  const container = document.getElementById("slider-container");
  
  
  const prevButton = document.querySelector(".slider-controls .slider-btn.prev");
  prevButton.innerHTML = "&#10094;"; 
  
  const nextButton = document.querySelector(".slider-controls .slider-btn.next");
  nextButton.innerHTML = "&#10095;"; 
  

  const sliderWrapper = document.createElement("div");
  sliderWrapper.classList.add("slider-wrapper");
  
  const sliderTrack = document.createElement("div");
  sliderTrack.classList.add("slider-track");
  
  sliderImages.forEach((imgData) => {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
  
    const img = document.createElement("img");
    img.src = imgData.src;
    img.alt = imgData.alt;
    img.classList.add("slider-image");

    const overlayContainer = document.createElement("div");
    overlayContainer.classList.add("slider-image-overlay");
  
    const link = document.createElement("a");
    link.href = `https://www.nike.com/it/w/${imgData.href}`;
    link.textContent = imgData.name;
    link.classList.add("button");

    overlayContainer.appendChild(link);

    if(imgData.isFreeShipping){
        const chip = document.createElement("div");
        chip.textContent = "Spedizione gratuita";
        chip.classList.add("chip");
        chip.setAttribute("data-tooltip", "Idoneo per spedizione gratuita oltre le 200€");  

        overlayContainer.appendChild(chip);
    }
  
    imageContainer.appendChild(img);
    imageContainer.appendChild(overlayContainer);
    sliderTrack.appendChild(imageContainer);
  });
  
  sliderWrapper.appendChild(sliderTrack);
  container.appendChild(sliderWrapper);
  
  function updateSlider() {
    const imageWidth = 100 / itemsPerPage;
    const translateX = -(currentIndex * imageWidth);
    sliderTrack.style.transform = `translateX(${translateX}%)`;

    if (currentIndex === 0) {
        prevButton.classList.add("disabled");
      } else {
        prevButton.classList.remove("disabled");
      }
    
      if (currentIndex + step > sliderImages.length - itemsPerPage) {
        nextButton.classList.add("disabled");
      } else {
        nextButton.classList.remove("disabled");
      }
  }
  
  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= step;
      updateSlider();
    }
  });
  
  nextButton.addEventListener("click", () => {
    if (currentIndex + step <= sliderImages.length - itemsPerPage) {
      currentIndex += step;
      updateSlider();
    }
  });
  
  updateSlider();