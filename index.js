// ပေးထားသော HTML နှင့် ကိုက်ညီသော Product စာရင်းများ
const products = [
    { name: "SKOBBY-DOO!", category: "Set", price: "15,000 MMK", image: "photo_2026-08-08_10-12-46.jpg", link: "product1.html" },
    { name: "NINJAGO", category: "Set", price: "22,000 MMK", image: "photo_2026-08-08_10-13-03.jpg", link: "product2.html" },
    { name: "Reverse Flash", category: "Mini", price: "18,000 MMK", image: "photo_2026-08-08_10-12-51.jpg", link: "product3.html" },
    { name: "Jocker Imposter Batman", category: "Mini", price: "8,000 MMK", image: "photo_2026-08-08_10-12-57.jpg", link: "product4.html" },
    { name: "NINJAGO", category: "Set", price: "25,000 MMK", image: "photo_2026-08-08_10-13-05.jpg", link: "product5.html" },
    { name: "Jocker", category: "Mini", price: "20,000 MMK", image: "photo_2026-08-08_10-13-00.jpg", link: "product6.html" },
    { name: "DreamZzz", category:"Set", price: "20,000 MMK", image: "photo_2026-08-08_19-43-31.jpg", link: "product7.html"},
    { name: "Display Box", category:"Figure", price: "20,000 MMK", image: "photo_2026-08-08_20-03-45.jpg", link: "product8.html"},
    { name: "Super Hero", category:"Set", price: "20,000 MMK", image: "photo_2026-08-08_20-13-54.jpg", link: "product9.html"},
    { name: "Truck Car", category:"Set", price: "20,000 MMK", image: "image_5fa7cf71.png", link: "product10.html"},
    { name: "Robot", category:"Set", price: "20,000 MMK", image: "Screenshot 2026-08-08 193455.png", link: "product11.html"},
    { name: "DreamZzz", category:"Set", price: "20,000 MMK", image: "photo_2026-08-08_19-43-31.jpg", link: "product12.html"},
    { name: "DreamZzz", category:"Set", price: "20,000 MMK", image: "photo_2026-08-08_19-43-31.jpg", link: "product13.html"},
    { name: "DreamZzz", category:"Set", price: "20,000 MMK", image: "photo_2026-08-08_19-43-31.jpg", link: "product14.html"},
    { name: "DreamZzz", category:"Set", price: "20,000 MMK", image: "photo_2026-08-08_19-43-31.jpg", link: "product15.html"},
    { name: "DreamZzz", category:"Set", price: "20,000 MMK", image: "photo_2026-08-08_19-43-31.jpg", link: "product16.html"},
];

const itemsPerPage = 6; // တစ်မျက်နှာလျှင် ပြမည့် Product အရေအတွက်
let currentPage = 1;

const productGrid = document.querySelector('.product-grid');
const categorySelect = document.getElementById('category');

function displayProducts(filter = "All", page = 1) {
    if (!productGrid) return;
    productGrid.innerHTML = "";

    // Category အလိုက် စစ်ထုတ်ခြင်း
    const filteredProducts = products.filter(p => filter === "All" || p.category === filter);

    // Pagination တွက်ချက်ခြင်း
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredProducts.slice(startIndex, endIndex);

    if (paginatedItems.length === 0) {
        productGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #7f8c8d;'>ဤ Category ထဲတွင် ပစ္စည်းမရှိသေးပါ။</p>";
    } else {
        // Product များကို Screen ပေါ်တင်ခြင်း
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

    // Pagination ခလုတ်များ ဖန်တီးခြင်း
    setupPagination(filteredProducts.length, page, filter);
}

function setupPagination(totalItems, page, filter) {
    let paginationContainer = document.getElementById('paginationContainer');
    
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'paginationContainer';
        paginationContainer.style.textAlign = 'center';
        paginationContainer.style.margin = '2rem 0';
        productGrid.after(paginationContainer);
    }

    paginationContainer.innerHTML = "";
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    if (pageCount <= 1) return; // တစ်မျက်နှာစာပဲ ရှိရင် ခလုတ်မပြပါ

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
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Page ပြောင်းရင် အပေါ်ဆုံးပြန်ရောက်ရန်
        });

        paginationContainer.appendChild(btn);
    }
}

// ပထမအကြိမ် စတင်ပြသခြင်း
displayProducts();

// Category ပြောင်းသည့်အခါ 
if (categorySelect) {
    categorySelect.addEventListener('change', function() {
        currentPage = 1; // Category ပြောင်းရင် Page 1 ကို ပြန်သွားမည်
        displayProducts(this.value, currentPage);
    });
}
window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    const mainContent = document.getElementById("main-content");

    // လိုချင်ရင် ဒီမှာ အချိန်ဆွဲလို့ရပါတယ် (ဥပမာ - ၁.၅ စက္ကန့်)
    setTimeout(() => {
        preloader.style.opacity = "0";
        preloader.style.transition = "opacity 3s ease";

        setTimeout(() => {
            preloader.style.display = "none";
            
            // preloader ပျောက်သွားမှ တကယ့် website content တွေကို ပေါ်လာစေမယ်
            mainContent.style.display = "block";
        }, 500);
        
    }, 3000); // ၁.၅ စက္ကန့်ကြာရင် Preloader ပျောက်ပြီး Website ပေါ်လာမယ်
});
