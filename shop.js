const params = new URLSearchParams(window.location.search);
const category = params.get("cat");
const section = params.get("section");

const url = "https://fakestoreapi.com/products";

document.querySelectorAll('.filter-title').forEach(title => {
    title.addEventListener('click', () => {
        title.classList.toggle('open');
    });
});

const filterBtn = document.querySelector('.filter-btn');
const filters = document.querySelector('.filters');

filterBtn.addEventListener('click', () => {
    filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
    filterBtn.firstChild.textContent = filters.style.display === 'none' ? 'Mostra filtri' : 'Nascondi filtri';
});


const nav = document.getElementById('shop-header');
const categoryTitle = document.getElementById('categoryTitle');
const navHeight = nav.offsetHeight;
let lastScrollTop = 0;

function getPageTitle() {
    var title;

    const categoryMap = {
        men: "da uomo",
        woman: "da donna",
        kids: "per bambini"
    };

    const sectionMap = {
        shoes: "Sneakers e scarpe",
        wear: "Abbigliamento",
        news: "Novità nike",
        bestSeller: "Best seller",
        outlet: "Sconti"
    };

    const categoryLabel = categoryMap[category];
    const sectionLabel = sectionMap[section];

    if (sectionLabel && categoryLabel) {
        title = `${sectionLabel} ${categoryLabel}`;
    } else if (sectionLabel) {
        title = sectionLabel;
    } else if (categoryLabel) {
        title = `Prodotti ${categoryLabel}`;
    } else {
        title = "Tutti i prodotti";
    }

    categoryTitle.innerText = title;
}

window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > navHeight) {
        nav.classList.add('header-fixed');
        categoryTitle.classList.add('category-small');
    } else {
        nav.classList.remove('header-fixed');
        categoryTitle.classList.remove('category-small');
    }

    lastScrollTop = scrollTop;
});

function renderProducts(products, isMocked) {
    const container = document.getElementById("product-grid");
    container.innerHTML = '';

    products.forEach(prod => {
        const card = document.createElement("div");
        card.className = "product-card";

        const imageContainer = document.createElement("div");
        imageContainer.className = "product-image";
        const imageLink = document.createElement("a");
        imageLink.href = `detail.html?product=${prod.id}`
        const img = document.createElement("img");
        img.src = prod.image;
        img.alt = prod.title;
        if (isMocked) {
            img.style.objectFit = "none";
        }

        imageLink.appendChild(img);
        imageContainer.appendChild(imageLink);

        const infoContainer = document.createElement("div");
        infoContainer.className = "product-info";

        if (prod.rating && prod.rating.count > 100) {
            const tagElem = document.createElement("div");
            tagElem.className = "product-tag";
            tagElem.textContent = "Best seller";
            infoContainer.appendChild(tagElem);
        }

        const nameElem = document.createElement("div");
        nameElem.className = "product-name";
        nameElem.textContent = prod.title;
        infoContainer.appendChild(nameElem);

        const categoryElem = document.createElement("div");
        categoryElem.className = "product-category";
        if (prod.category.includes("men")) {
            categoryElem.textContent = "Prodotto – Uomo";
        } else if (prod.category.includes("women")) {
            categoryElem.textContent = "Prodotto – Donna";
        } else if (prod.category.includes("kids")) {
            categoryElem.textContent = "Prodotto – Bambini";
        } else {
            categoryElem.textContent = "Prodotto";
        }
        infoContainer.appendChild(categoryElem);

        const colorsElem = document.createElement("div");
        colorsElem.className = "product-colors";
        const numColors = Math.floor(Math.random() * 15) + 1;
        colorsElem.textContent = `${numColors} colori`;
        infoContainer.appendChild(colorsElem);

        const priceElem = document.createElement("div");
        priceElem.className = "product-price";
        priceElem.textContent = `${prod.price.toFixed(2)} €`;
        infoContainer.appendChild(priceElem);

        card.appendChild(imageContainer);
        card.appendChild(infoContainer);

        container.appendChild(card);
    });
}

async function getProducts() {
    const categoryMap = {
        men: "men",
        women: "women",
        kids: "kids"
    };

    const sectionMap = {
        news: "news",
        shoes: "shoes",
        wear: "clothing",
        bestSeller: "best-seller",
        outlet: "outlet"
    };

    const expectedCategory = category && section
        ? `${categoryMap[category]}'s ${sectionMap[section]}`
        : null;

    try {
        const res = await fetch(url);
        let products = await res.json();
        var isMocked = false;

        if (expectedCategory) {
            products = products.filter(p => p.category.toLowerCase() === expectedCategory);
        } else if (category) {
            products = products.filter(p => p.category.toLowerCase().includes(categoryMap[category]));
        } else if (section) {
            products = products.filter(p => p.category.toLowerCase().includes(sectionMap[section]));
        }

        if (products.length === 0) {
            isMocked = true;
            var fallbackFile = "./mock-data";
            if (expectedCategory && section) {
                fallbackFile = `${fallbackFile}/${categoryMap[category]}-${sectionMap[section]}.json`;
            } else if (section) {
                fallbackFile = `${fallbackFile}/${section}.json`;
            }
            const fallbackRes = await fetch(fallbackFile);
            if (fallbackRes.ok) {
                products = await fallbackRes.json();
            } else {
                throw new Error("Nessun prodotto disponibile");
            }
        }

        renderProducts(products, isMocked);
    } catch (e) {
        console.error("Errore nel caricamento prodotti:", e);
        const container = document.getElementById("product-grid");
        container.innerHTML = '<div class="error-message">Impossibile caricare i prodotti. Riprova più tardi.</div>';
    }
}


getProducts();
getPageTitle();

