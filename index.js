const products = [
    { name: "MINI-SET", category: "Mini", price: "6,500 MMK (အသေးစိတ်ကြည့်ရန်နှိပ်ပါ)", image: "photo_2026-08-10_23-08-46.jpg", link: "product1.html" },
    { name: "Luffy", category: "Mini", price: "7,000 MMK (အသေးစိတ်ကြည့်ရန်နှိပ်ပါ)", image: "photo_2026-08-11_20-36-28.jpg", link: "product2.html" },
    { name: "Ghost Sea Shark", category: "Set", price: "80,000 MMK (အသေးစိတ်ကြည့်ရန်နှိပ်ပါ)", image: "image_da7d961e.png", link: "product3.html" },
    { name: "Ninja Go", category: "Mini", price: "5,500 MMK (အသေးစိတ်ကြည့်ရန်နှိပ်ပါ)", image: "photo_2026-08-11_20-50-30.jpg", link: "product4.html" },
    { name: "DreamZzz", category:"Set", price: "39,000 MMK (အသေးစိတ်ကြည့်ရန်နှိပ်ပါ)", image: "photo_2026-08-08_19-43-31.jpg", link: "product7.html"},
    { name: "Display Box", category:"Figure", price: "3,000 MMK (အသေးစိတ်ကြည့်ရန်နှိပ်ပါ)", image: "photo_2026-08-08_20-03-45.jpg", link: "product8.html"},
    { name: "Super Hero", category:"Set", price: "60,000 MMK (အသေးစိတ်ကြည့်ရန်နှိပ်ပါ)", image: "photo_2026-08-08_20-13-54.jpg", link: "product9.html"},
    { name: "Truck Car", category:"Set", price: "57,000 MMK (အသေးစိတ်ကြည့်ရန်နှိပ်ပါ)", image: "image_5fa7cf71.png", link: "product10.html"},
    { name: "Rocket", category:"Set", price: "40,000 MMK (အသေးစိတ်ကြည့်ရန်နှိပ်ပါ)", image: "Screenshot 2026-08-08 193455.png", link: "product11.html"},
    { name: "DC Hero", category:"Mini", price: "4,500-5,000 MMK (အသေးစိတ်ကြည့်ရန်နှိပ်ပါ)", image: "photo_2026-08-09_12-30-14.jpg", link: "product12.html"},
    { name: "Mini Set", category:"Mini", price: "6,000 MMK (အသေးစိတ်ကြည့်ရန်နှိပ်ပါ)", image: "photo_2026-08-09_12-40-14.jpg", link: "product13.html"},
    { name: "NINJA GO", category:"Mini", price: "6,000 MMK (အသေးစိတ်ကြည့်ရန်နှိပ်ပါ)", image: "photo_2026-08-09_16-38-12.jpg", link: "product14.html"},
    { name: "NINJA GO", category:"Set", price: "45,000 MMK (အသေးစိတ်ကြည့်ရန်နှိပ်ပါ)", image: "image_8036c2b9.png", link: "product15.html"},
    { name: "Bela Set", category:"Set", price: "60,000 MMK (အသေးစိတ်ကြည့်ရန်နှိပ်ပါ)", image: "image_1e543a25.png", link: "product16.html"},
];

const itemsPerPage = 6; 
let currentPage = 1;
let currentFilter = "All";

const productGrid = document.querySelector('.product-grid');
const categorySelect = document.getElementById('category');

// Product တစ်ခုခုကို နှိပ်လိုက်ရင် လက်ရှိ Page, Filter နဲ့ Scroll နေရာကို သိမ်းရန်
document.addEventListener("click", function (e) {
    const productLink = e.target.closest(".product-link");
    if (productLink) {
        sessionStorage.setItem("savedPage", currentPage);
        sessionStorage.setItem("savedFilter", currentFilter);
        sessionStorage.setItem("savedScrollY", window.scrollY);
    }
});

function displayProducts(filter = "All", page = 1) {
    if (!productGrid) return;
    productGrid.innerHTML = "";

    currentFilter = filter;
    currentPage = page;

    const filteredProducts = products.filter(p => filter === "All" || p.category === filter);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredProducts.slice(startIndex, endIndex);

    if (paginatedItems.length === 0) {
        productGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #7f8c8d;'>ဤ Category ထဲတွင် ပစ္စည်းမရှိသေးပါ။</p>";
    } else {
        paginatedItems.forEach(p => {
            const cardHTML = `
                <a href="${p.link}" class="product-link">
                    <article class="product-card" data-category="${p.category}">
                        <img src="${p.image}" alt="${p.name}">
                        <h3>${p.name}</h3>
                        <p class="category">Category: ${p.category}</p>
                        <p class="price">Price: ${p.price}</p>
                    </article>
                </a>
            `;
            productGrid.innerHTML += cardHTML;
        });
    }

    setupPagination(filteredProducts.length, page, filter);
}

function setupPagination(totalItems, page, filter) {let paginationContainer = document.getElementById('paginationContainer');
    
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'paginationContainer';
        paginationContainer.style.textAlign = 'center';
        paginationContainer.style.margin = '2rem 0';
        productGrid.after(paginationContainer);
    }

    paginationContainer.innerHTML = "";
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    if (pageCount <= 1) return; 

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.style.margin = '0 5px';
        btn.style.padding = '0.5rem 1rem';
        btn.style.cursor = 'pointer';
        btn.style.border = '1px solid #ccc';
        btn.style.background = i === page ? '#3498db' : '#fff';
        btn.style.color = i === page ? '#fff' : '#000';
        btn.style.borderRadius = '4px';

        btn.addEventListener('click', function() {
            currentPage = i;
            displayProducts(filter, currentPage);
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        });

        paginationContainer.appendChild(btn);
    }
}

// Category ပြောင်းတဲ့အခါ
if (categorySelect) {
    categorySelect.addEventListener('change', function() {
        currentPage = 1; 
        displayProducts(this.value, currentPage);
    });
}

// Page Load ဖြစ်ချိန် (သို့) Back ခလုတ်နှိပ်ပြီး ပြန်လာချိန်
window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    const mainContent = document.getElementById("main-content");

    // သိမ်းထားသော ချက်လက်မှတ်များကို စစ်ဆေးရန်
    const savedPage = sessionStorage.getItem("savedPage");
    const savedFilter = sessionStorage.getItem("savedFilter");
    const savedScrollY = sessionStorage.getItem("savedScrollY");

    if (savedFilter && categorySelect) {
        categorySelect.value = savedFilter;
        currentFilter = savedFilter;
    }

    if (savedPage) {
        currentPage = parseInt(savedPage);
        sessionStorage.removeItem("savedPage");
    }

    displayProducts(currentFilter, currentPage);

    if (savedScrollY) {
        setTimeout(() => {
            window.scrollTo({
                top: parseInt(savedScrollY),
                behavior: "smooth"
            });
        }, 100);
        sessionStorage.removeItem("savedScrollY");
    }

    // Preloader ပုံစံ
    if (!sessionStorage.getItem("hasLoaded")) {
        setTimeout(() => {
            preloader.style.opacity = "0";
            preloader.style.transition = "opacity 3s ease";

            setTimeout(() => {
                preloader.style.display = "none";
                if (mainContent) {
                    mainContent.style.display = "block";
                }
            }, 500);
        }, 3000);

        sessionStorage.setItem("hasLoaded", "true");
    } else {
        if (preloader) preloader.style.display = "none";
        if (mainContent) mainContent.style.display = "block";
    }
});