// Cart page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
    setupCheckoutForm();
});

// Display cart items on cart page
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartContainer = document.getElementById('empty-cart');
    const cartSummaryContainer = document.getElementById('cart-summary');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        emptyCartContainer.style.display = 'block';
        cartSummaryContainer.style.display = 'none';
        cartItemsContainer.innerHTML = '';
        return;
    }
    
    emptyCartContainer.style.display = 'none';
    cartSummaryContainer.style.display = 'block';
    
    cartItemsContainer.innerHTML = `
        <div class="col-12">
            <h4 class="mb-4">Itens do Carrinho</h4>
            ${cart.map(item => `
                <div class="cart-item p-4 mb-3">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <div class="cart-item-image">
                                <i class="fas fa-drumstick-bite"></i>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <h5 class="mb-1">${item.name}</h5>
                            <p class="text-muted mb-0">Preço unitário: R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div class="col-md-3">
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="mx-3 fw-bold">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <p class="mb-0 fw-bold text-danger">
                                R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}
                            </p>
                        </div>
                        <div class="col-md-1">
                            <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15; // Free shipping for orders over R$ 100
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`;
    document.getElementById('total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Setup checkout form
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    if (!checkoutForm) return;
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const customerName = document.getElementById('customer-name').value.trim();
        const customerPhone = document.getElementById('customer-phone').value.trim();
        const customerAddress = document.getElementById('customer-address').value.trim();
        
        // Validate form
        if (!customerName || !customerPhone || !customerAddress) {
            showError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Create order summary
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 100 ? 0 : 15;
        const total = subtotal + shipping;
        
        // Create WhatsApp message
        let whatsappMessage = `*🔥 NOVO PEDIDO - SPOILER CHURRASCO 🔥*\n\n`;
        whatsappMessage += `*👤 DADOS DO CLIENTE*\n`;
        whatsappMessage += `*Nome:* ${customerName}\n`;
        whatsappMessage += `*Telefone:* ${customerPhone}\n`;
        whatsappMessage += `*Endereço:* ${customerAddress}\n\n`;
        
        whatsappMessage += `*🛒 ITENS DO PEDIDO*\n`;
        cart.forEach((item, index) => {
            whatsappMessage += `${index + 1}. *${item.name}*\n`;
            whatsappMessage += `   Quantidade: ${item.quantity}\n`;
            whatsappMessage += `   Preço unitário: R$ ${item.price.toFixed(2).replace('.', ',')}\n`;
            whatsappMessage += `   Subtotal: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n\n`;
        });
        
        whatsappMessage += `*💰 RESUMO FINANCEIRO*\n`;
        whatsappMessage += `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
        whatsappMessage += `Frete: ${shipping === 0 ? 'Grátis' : 'R$ ' + shipping.toFixed(2).replace('.', ',')}\n`;
        whatsappMessage += `*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
        
        whatsappMessage += `_Pedido realizado através do site_`;
        
        // Encode message for WhatsApp URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/5511999999999?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Clear cart and show success message
        cart = [];
        saveCart();
        updateCartCount();
        displayCartItems();
        
        showSuccess('Pedido enviado! Você será redirecionado para o WhatsApp.');
        
        // Reset form
        checkoutForm.reset();
    });
}

// Phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{0,2})/, '($1');
                } else if (value.length <= 7) {
                    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    });
});

// CEP lookup (Brazilian postal code)
function lookupCEP(cep) {
    // Remove non-digits
    cep = cep.replace(/\D/g, '');
    
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    // Auto-fill address fields if they exist
                    const addressField = document.getElementById('customer-address');
                    if (addressField && !addressField.value) {
                        addressField.value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                    }
                }
            })
            .catch(error => {
                console.log('CEP lookup failed:', error);
            });
    }
}

// Add CEP input if needed
document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('customer-cep');
    if (cepInput) {
        cepInput.addEventListener('blur', function() {
            lookupCEP(this.value);
        });
        
        // Format CEP input
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 8) {
                value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2');
            }
            e.target.value = value;
        });
    }
});
