// Global Variables
let products = [];
let cart = JSON.parse(localStorage.getItem('spoiler-cart')) || [];
let currentCategory = 'all';
let isMobileMenuOpen = false;
let isCartOpen = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    loadProducts();
    updateCartCount();
    setupEventListeners();
    setupScrollAnimations();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Load products from JSON file or create sample data
async function loadProducts() {
    try {
        const response = await fetch('./data/produtos.json');
        if (response.ok) {
            const data = await response.json();
            // Convert old product structure to new structure
            products = data.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: mapCategory(product.category),
                image: product.image || 'placeholder.jpg'
            }));
        } else {
            throw new Error('Failed to load products');
        }
    } catch (error) {
        console.log('Using sample products data');
        // Create sample products for demo
        products = createSampleProducts();
    }
    
    displayProducts();
    hideLoading();
}

// Map old categories to new categories
function mapCategory(oldCategory) {
    const categoryMap = {
        'bovino': 'cutting-boards',
        'suino': 'accessories',
        'aves': 'sets',
        'especiais': 'custom'
    };
    return categoryMap[oldCategory] || 'cutting-boards';
}

// Create sample products for demo
function createSampleProducts() {
    return [
        {
            id: 1,
            name: "Tábua de Corte Premium",
            description: "Tábua artesanal de madeira nobre, perfeita para churrasco",
            price: 129.90,
            category: "cutting-boards",
            image: "tabua-premium.jpg"
        },
        {
            id: 2,
            name: "Kit Churrasco Completo",
            description: "Kit com tábua, facas e utensílios para churrasco",
            price: 249.90,
            category: "sets",
            image: "kit-completo.jpg"
        },
        {
            id: 3,
            name: "Espeto Artesanal",
            description: "Espeto de inox com cabo de madeira personalizado",
            price: 89.90,
            category: "accessories",
            image: "espeto-artesanal.jpg"
        },
        {
            id: 4,
            name: "Tábua Personalizada",
            description: "Tábua com gravação personalizada do seu nome ou logo",
            price: 189.90,
            category: "custom",
            image: "tabua-personalizada.jpg"
        },
        {
            id: 5,
            name: "Tábua Média",
            description: "Tábua de tamanho médio ideal para família",
            price: 89.90,
            category: "cutting-boards",
            image: "tabua-media.jpg"
        },
        {
            id: 6,
            name: "Conjunto de Facas",
            description: "Set de facas profissionais para churrasco",
            price: 199.90,
            category: "accessories",
            image: "conjunto-facas.jpg"
        }
    ];
}

// Display products
function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    const filteredProducts = currentCategory === 'all' 
        ? products 
        : products.filter(product => product.category === currentCategory);
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-12 text-center">
                <p>Nenhum produto encontrado nesta categoria.</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i data-lucide="${getProductIcon(product.category)}"></i>
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">R$ ${formatPrice(product.price)}</span>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        <i data-lucide="shopping-cart"></i>
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Get product icon based on category
function getProductIcon(category) {
    const icons = {
        'cutting-boards': 'grid-3x3',
        'accessories': 'utensils',
        'sets': 'package',
        'custom': 'palette'
    };
    return icons[category] || 'grid-3x3';
}

// Get category display name
function getCategoryName(category) {
    const categories = {
        'cutting-boards': 'Tábuas de Corte',
        'accessories': 'Acessórios',
        'sets': 'Kits Completos',
        'custom': 'Personalizada'
    };
    return categories[category] || category;
}

// Format price
function formatPrice(price) {
    return price.toFixed(2).replace('.', ',');
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showToast('Produto não encontrado', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            category: product.category
        });
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showToast(`${product.name} adicionado ao carrinho!`, 'success');
}

// Remove product from cart
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        updateCartDisplay();
        showToast('Item removido do carrinho', 'success');
    }
}

// Update product quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('spoiler-cart', JSON.stringify(cart));
}

// Update cart count in navigation
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCountElement.style.display = 'block';
    } else {
        cartCountElement.style.display = 'none';
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartItems || !cartEmpty || !cartSummary) return;
    
    if (cart.length === 0) {
        cartItems.style.display = 'none';
        cartSummary.style.display = 'none';
        cartEmpty.style.display = 'flex';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartItems.style.display = 'block';
    cartSummary.style.display = 'block';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <i data-lucide="${getProductIcon(item.category)}"></i>
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">R$ ${formatPrice(item.price)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                        <i data-lucide="minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                        <i data-lucide="plus"></i>
                    </button>
                </div>
            </div>
            <button class="btn btn-sm" onclick="removeFromCart(${item.id})" style="background: none; color: var(--text-secondary); padding: 0.5rem;">
                <i data-lucide="trash-2"></i>
            </button>
        </div>
    `).join('');
    
    // Update cart summary
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;
    
    document.getElementById('cart-subtotal').textContent = `R$ ${formatPrice(subtotal)}`;
    document.getElementById('cart-shipping').textContent = shipping === 0 ? 'Grátis' : `R$ ${formatPrice(shipping)}`;
    document.getElementById('cart-total').textContent = `R$ ${formatPrice(total)}`;
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Filter products by category
function filterProducts(category) {
    currentCategory = category;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    displayProducts();
}

// Set category from category cards
function setCategory(category) {
    currentCategory = category;
    scrollToSection('products');
    
    // Update filter buttons after scroll
    setTimeout(() => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.onclick.toString().includes(category)) {
                btn.classList.add('active');
            }
        });
        displayProducts();
    }, 100);
}

// Scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;
    
    isMobileMenuOpen = !isMobileMenuOpen;
    
    if (isMobileMenuOpen) {
        mobileMenu.classList.add('open');
    } else {
        mobileMenu.classList.remove('open');
    }
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (!cartSidebar) return;
    
    isCartOpen = !isCartOpen;
    
    if (isCartOpen) {
        cartSidebar.classList.add('open');
        updateCartDisplay();
    } else {
        cartSidebar.classList.remove('open');
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showToast('Seu carrinho está vazio', 'error');
        return;
    }
    
    // Create WhatsApp message
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;
    
    let message = `*🔥 NOVO PEDIDO - SPOILER DO CHURRASCO 🔥*\n\n`;
    message += `*🛒 ITENS DO PEDIDO*\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        message += `   Quantidade: ${item.quantity}\n`;
        message += `   Preço unitário: R$ ${formatPrice(item.price)}\n`;
        message += `   Subtotal: R$ ${formatPrice(item.price * item.quantity)}\n\n`;
    });
    
    message += `*💰 RESUMO FINANCEIRO*\n`;
    message += `Subtotal: R$ ${formatPrice(subtotal)}\n`;
    message += `Frete: ${shipping === 0 ? 'Grátis' : 'R$ ' + formatPrice(shipping)}\n`;
    message += `*TOTAL: R$ ${formatPrice(total)}*\n\n`;
    message += `_Pedido realizado através do site_`;
    
    // Open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/5511999999999?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    
    // Clear cart and show success message
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
    
    showToast('Pedido enviado! Você será redirecionado para o WhatsApp.', 'success');
    
    // Close cart
    toggleCart();
}

// Setup event listeners
function setupEventListeners() {
    // Custom form submission
    const customForm = document.getElementById('custom-form');
    if (customForm) {
        customForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCustomFormSubmission(this);
        });
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission(this);
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubmission(this);
        });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartBtn = document.querySelector('.cart-btn');
        
        if (isCartOpen && cartSidebar && !cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
            toggleCart();
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (isMobileMenuOpen && mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });
}

// Handle custom form submission
function handleCustomFormSubmission(form) {
    const formData = new FormData(form);
    
    let message = `*🎨 SOLICITAÇÃO DE PERSONALIZAÇÃO*\n\n`;
    message += `*Tipo de Produto:* ${formData.get('product-type')}\n`;
    message += `*Dimensões:* ${formData.get('dimensions') || 'Não especificado'}\n`;
    message += `*Gravação:* ${formData.get('engraving') || 'Não especificado'}\n`;
    message += `*Nome:* ${formData.get('name')}\n`;
    message += `*WhatsApp:* ${formData.get('phone')}\n\n`;
    message += `_Solicitação enviada através do site_`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/5511999999999?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    
    form.reset();
    showToast('Solicitação enviada! Entraremos em contato em breve.', 'success');
}

// Handle contact form submission
function handleContactFormSubmission(form) {
    const formData = new FormData(form);
    
    let message = `*📞 NOVA MENSAGEM DE CONTATO*\n\n`;
    message += `*Nome:* ${formData.get('name')}\n`;
    message += `*E-mail:* ${formData.get('email')}\n`;
    message += `*Telefone:* ${formData.get('phone') || 'Não informado'}\n`;
    message += `*Assunto:* ${formData.get('subject')}\n\n`;
    message += `*Mensagem:*\n${formData.get('message')}\n\n`;
    message += `_Mensagem enviada através do site_`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/5511999999999?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    
    form.reset();
    showToast('Mensagem enviada! Entraremos em contato em breve.', 'success');
}

// Handle newsletter submission
function handleNewsletterSubmission(form) {
    const email = form.querySelector('input[type="email"]').value;
    
    let message = `*📧 NOVA INSCRIÇÃO NA NEWSLETTER*\n\n`;
    message += `*E-mail:* ${email}\n\n`;
    message += `_Inscrição realizada através do site_`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/5511999999999?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    
    form.reset();
    showToast('Inscrição realizada! Obrigado por se cadastrar.', 'success');
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Hide loading indicator
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast styles if not already present
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: var(--shadow-lg);
                z-index: 9999;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            }
            .toast-success {
                background: #10B981;
                color: white;
            }
            .toast-error {
                background: #EF4444;
                color: white;
            }
            .toast-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Initialize Lucide icons for the toast
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Customization modal functions (placeholder for future implementation)
function openCustomizationModal(productId) {
    console.log('Opening customization modal for product:', productId);
    // TODO: Implement customization modal
}

function closeCustomizationModal() {
    const modal = document.getElementById('customization-modal');
    if (modal) {
        modal.classList.remove('open');
    }
}

// Export functions for global access
window.scrollToSection = scrollToSection;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleCart = toggleCart;
window.filterProducts = filterProducts;
window.setCategory = setCategory;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.checkout = checkout;
window.openCustomizationModal = openCustomizationModal;
window.closeCustomizationModal = closeCustomizationModal;