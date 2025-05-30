import { designs } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    // Get references to all necessary DOM elements
    const headerOrderBtn = document.getElementById('header-order-btn');
    const orderPopupOverlay = document.getElementById('order-popup-overlay');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const productNameInput = document.getElementById('product-name');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const designCardsContainer = document.getElementById('design-cards-container');
    const orderForm = document.getElementById('order-form');
    const contactForm = document.getElementById('contact-form');
    const desktopSearchInput = document.getElementById('desktop-search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const sidebarCategoryLinks = document.querySelectorAll('.sidebar-category-link'); 

    const WHATSAPP_NUMBER = '918921746693'; // Your WhatsApp number

    function filterDesigns(query) {
        const lowerCaseQuery = query.toLowerCase();
        return designs.filter(design => {
            const nameMatch = design.name.toLowerCase().includes(lowerCaseQuery);
            const tagsMatch = design.tags && design.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
            return nameMatch || tagsMatch; // Only match name or tags
        });
    }

    function handleSearchInput() {
        const query = this.value;
        const filtered = filterDesigns(query);
        renderDesignCards(filtered);
        sidebarCategoryLinks.forEach(link => link.classList.remove('bg-blue-100', 'text-blue-700'));
    }

    // Add event listeners for live search
    desktopSearchInput.addEventListener('input', handleSearchInput);
    mobileSearchInput.addEventListener('input', handleSearchInput);

    // --- Dynamic Design Card Rendering ---
    function renderDesignCards(filteredDesigns = designs) {
        designCardsContainer.innerHTML = '';
        if (filteredDesigns.length === 0) {
            designCardsContainer.innerHTML = '<p class="text-center text-gray-600 col-span-full">No designs found matching your criteria.</p>';
            return;
        }

        filteredDesigns.forEach(design => {
            if (design.type === 'image') {
                const cardHtml = `
                    <div class="design-card bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div class="canva-embed-container" style="padding-bottom: 75%;">
                            <img src="${design.imageUrl}" alt="${design.name}" class="w-full h-full object-cover">
                        </div>
                        <div class="p-5">
                            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2" data-product-name="${design.name}">${design.name}</h3>
                            <div class="flex flex-col space-y-3">
                                <button class="order-btn w-full bg-gradient-to-r from-green-500 to-teal-600 text-xs sm:text-sm text-white px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-400">
                                    Order
                                </button>
                                ${design.viewLink ? `<a href="${design.viewLink}" target="_blank" class="purchase-btn w-full text-center bg-blue-500 text-white text-xs sm:text-sm px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400">View Link</a>` : ''}
                                ${design.amazonLink ? `<a href="${design.amazonLink}" target="_blank" class="purchase-btn w-full text-center bg-gray-200 text-gray-800 text-xs sm:text-sm px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300">Purchase</a>` : ''}
                                ${design.shopsyLink ? `<a href="${design.shopsyLink}" target="_blank" class="purchase-btn w-full text-center bg-gray-200 text-gray-800 text-xs sm:text-sm px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300">Purchase</a>` : ''}
                            </div>
                        </div>
                    </div>
                `;
                designCardsContainer.insertAdjacentHTML('beforeend', cardHtml);
            }
        });

        document.querySelectorAll('.order-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productName = event.target.closest('.design-card').querySelector('[data-product-name]').dataset.productName;
                openOrderPopup(productName);
            });
        });
    }

    // --- Order Form Popup Functions ---
    function openOrderPopup(productName = '') {
        productNameInput.value = productName;
        orderPopupOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeOrderPopup() {
        orderPopupOverlay.classList.remove('show');
        document.body.style.overflow = '';
        orderForm.reset();
    }

    // --- Event Listeners for Order Form ---
    headerOrderBtn.addEventListener('click', () => {
        openOrderPopup('');
    });

    closePopupBtn.addEventListener('click', closeOrderPopup);

    orderPopupOverlay.addEventListener('click', (event) => {
        if (event.target === orderPopupOverlay) {
            closeOrderPopup();
        }
    });

    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const productName = productNameInput.value;
        const yourName = document.getElementById('your-name').value;
        const yourEmail = document.getElementById('your-email').value;
        const customDetails = document.getElementById('custom-details').value;

        const message = `Order Request for Tweaks:\n\n` +
                        `Product: ${productName || 'General Custom Order'}\n` +
                        `Name: ${yourName}\n` +
                        `Email: ${yourEmail}\n` +
                        `Details: ${customDetails}`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        closeOrderPopup();
    });

    // --- Event Listener for Contact Form ---
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const contactName = document.getElementById('contact-name').value;
        const contactEmail = document.getElementById('contact-email').value;
        const contactMessage = document.getElementById('contact-message').value;

        const message = `Contact Message for Tweaks:\n\n` +
                        `Name: ${contactName}\n` +
                        `Email: ${contactEmail}\n` +
                        `Message: ${contactMessage}`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        contactForm.reset();
    });

    // --- Sidebar / Hamburger Menu Logic ---
    hamburgerBtn.addEventListener('click', () => {
        sidebar.classList.toggle('hidden-mobile');
        sidebar.classList.toggle('show-mobile');
        sidebarOverlay.classList.toggle('hidden');
    });

    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.add('hidden-mobile');
        sidebar.classList.remove('show-mobile');
        sidebarOverlay.classList.add('hidden');
    });

    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                sidebar.classList.add('hidden-mobile');
                sidebar.classList.remove('show-mobile');
                sidebarOverlay.classList.add('hidden');
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('hidden-mobile', 'show-mobile');
            sidebar.classList.add('block');
            sidebarOverlay.classList.add('hidden');
        } else {
            if (!sidebar.classList.contains('show-mobile')) {
                 sidebar.classList.add('hidden-mobile');
                 sidebar.classList.remove('block');
            }
        }
    });

    // --- Category Filtering Event Listeners ---
    sidebarCategoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            if (event.target.getAttribute('href') && event.target.getAttribute('href').startsWith('#')) {
                return;
            }

            event.preventDefault();

            const tag = event.target.dataset.tag;

            desktopSearchInput.value = '';
            mobileSearchInput.value = '';

            sidebarCategoryLinks.forEach(l => l.classList.remove('bg-blue-100', 'text-blue-700'));
            event.target.classList.add('bg-blue-100', 'text-blue-700');

            if (tag === 'all') {
                renderDesignCards(designs);
            } else {
                const filtered = designs.filter(design =>
                    design.tags && design.tags.some(t => t.toLowerCase() === tag.toLowerCase())
                );
                renderDesignCards(filtered);
            }

            if (window.innerWidth < 1024) {
                sidebar.classList.add('hidden-mobile');
                sidebar.classList.remove('show-mobile');
                sidebarOverlay.classList.add('hidden');
            }
        });
    });

    // --- Initial Setup on Page Load ---
    renderDesignCards();
    document.querySelector('.sidebar-category-link[data-tag="all"]').classList.add('bg-blue-100', 'text-blue-700');

    if (window.innerWidth >= 1024) {
        sidebar.classList.remove('hidden-mobile');
        sidebar.classList.add('block');
    }
});