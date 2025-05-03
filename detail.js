//---------------------[HANDLE CLICK SULLE OPTIONS]-------------------
function handleSelectOption(option, classname) {
    document.querySelectorAll(classname).forEach(opt => {
        opt.classList.remove('selected');
    });

    option.classList.add('selected');
}

const colorOptions = document.querySelectorAll('.color-option');
colorOptions.forEach(option => {
    option.addEventListener('click', () => handleSelectOption(option, '.color-option'))
});

const sizeOptions = document.querySelectorAll('.size-option');
sizeOptions.forEach(option => {
    option.addEventListener('click', () => handleSelectOption(option, '.size-option'))
});


//----------------[CARRELLO]------------------
const SQUARE_APP_ID = "sandbox-sq0idb-MVXKt0GG8PPWtdhpsXUAYA";
const SQUARE_LOCATION_ID = "L00RMZ3RWDTS1";
const SQUARE_ACCESS_TOKEN = "EAAAl2l9bnFRP2Nwo2tErUg_7KicWhMiqjz3njfJiGk4yr9sCnhpmYUHDMNgvIMm";
const cart = [];
let card;
let payments;

async function initializeCard() {
    card = await payments.card();
    await card.attach('#card-container');
    return card;
}

async function tokenize(paymentMethod) {
    const result = await paymentMethod.tokenize();
    if (result.status === 'OK') {
        return result.token;
    } else {
        let errorMessage = `Tokenization failed with status: ${result.status}`;
        if (result.errors) {
            errorMessage += ` and errors: ${JSON.stringify(result.errors)}`;
        }
        throw new Error(errorMessage);
    }
}

// async function createOrder() {
//     const response = await fetch("https://connect.squareupsandbox.com/v2/orders", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`
//       },
//       body: JSON.stringify({
//         order: {
//           location_id: locationId,
//           line_items: [
//             {
//               name: "Nike Air Max",
//               quantity: "1",
//               base_price_money: {
//                 amount: 5000, // 50.00 €
//                 currency: "EUR"
//               }
//             }
//           ]
//         }
//       })
//     });
//     const data = await response.json();
//     return data.order.id;
//   }

async function handlePayment() {
    const paymentStatus = document.getElementById('payment-status');
    const paymentProcessing = document.getElementById('payment-processing');
    const paymentSuccess = document.getElementById('payment-success');

    paymentProcessing.style.display = 'block';
    paymentStatus.innerText = '';
    paymentStatus.style.color = '';

    try {
        const token = await tokenize(card)
        console.log(token);
        //! Dovrebbe procedere cosi il flusso, ma serve un server perche square blocca le chiamate da URL del tipo http://localhost:5500

        // const orderId = await createOrder();

        // const paymentResponse = await fetch("https://connect.squareupsandbox.com/v2/payments", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //       "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`
        //     },
        //     body: JSON.stringify({
        //       source_id: token,
        //       idempotency_key: crypto.randomUUID(),
        //       amount_money: {
        //         amount: 5000,
        //         currency: "EUR"
        //       },
        //       order_id: orderId,
        //       location_id: locationId
        //     })
        //   });

        //   const result = await paymentResponse.json();

        //   if (paymentResponse.ok) {
        //     paymentSuccess.style.display = 'block';
        //   } else {
        //     throw new Error(result.error || "Impossibile completare il pagamento")
        //   }


        paymentSuccess.style.display = 'block';
        cart.splice(0, cart.length);
        updateCartBadge();
        updateCartDisplay();
    } catch (err) {
        console.error(err);
        paymentSuccess.style.display = 'none';
        paymentStatus.innerText = "Errore durante il pagamento: " + err.message;
        paymentStatus.style.color = "red";
    } finally {
        paymentProcessing.style.display = 'none';
    }

    setTimeout(() => {
        togglePaymentModal();
    }, 3000);
}

async function initializeSquarePayment() {
    if (!window.Square) {
        document.getElementById('payment-status').innerText = "Square non è disponibile.";
        return;
    }

    payments = window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById("checkout-button");

    if (!cartItems || !cartTotal || !checkoutButton) return;

    cartItems.innerHTML = "";
    cartTotal.innerHTML = "";
    checkoutButton.classList.remove("hidden");

    if (cart.length === 0) {
        checkoutButton.classList.add("hidden");
        const emptyCartDescription = document.createElement("p");
        emptyCartDescription.classList.add("empty-cart");
        emptyCartDescription.textContent = "Il tuo carrello è vuoto";

        cartItems.appendChild(emptyCartDescription);

        const emptyCartPrice = document.createElement("p");
        emptyCartPrice.textContent = '';

        cartTotal.appendChild(emptyCartPrice);
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        const itemName = document.createElement("span");
        itemName.classList.add("item-name");
        itemName.textContent = item.name;

        itemElement.appendChild(itemName);

        const itemPrice = document.createElement("span");
        itemPrice.classList.add("item-price");
        itemPrice.textContent = item.price.toFixed(2);

        itemElement.appendChild(itemPrice);

        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-item");
        removeButton.dataset.index = index;
        removeButton.textContent = "Rimuovi";

        itemElement.appendChild(removeButton);

        cartItems.appendChild(itemElement);
        total += item.price;
    });

    const removeButtons = cartItems.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
        });
    });

    const totalDiv = document.createElement("div");
    totalDiv.className = "total";

    const labelSpan = document.createElement("span");
    labelSpan.textContent = "Totale";

    const valueSpan = document.createElement("span");
    valueSpan.textContent = `€${total.toFixed(2)}`;

    totalDiv.appendChild(labelSpan);
    totalDiv.appendChild(valueSpan);

    cartTotal.appendChild(totalDiv);
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCartBadge();
        updateCartDisplay();
    }
}

function showNotification(message) {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function updatePaymentSummary() {
    const summaryElement = document.getElementById('payment-summary');
    summaryElement.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('summary-item');

        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;

        const priceSpan = document.createElement('span');
        priceSpan.textContent = `€${item.price.toFixed(2)}`;

        itemElement.appendChild(nameSpan);
        itemElement.appendChild(priceSpan);
        summaryElement.appendChild(itemElement);

        total += item.price;
    });

    const totalElement = document.createElement('div');
    totalElement.classList.add('summary-total');

    const totalLabel = document.createElement('span');
    totalLabel.textContent = 'Totale';

    const totalValue = document.createElement('span');
    totalValue.textContent = `€${total.toFixed(2)}`;

    totalElement.appendChild(totalLabel);
    totalElement.appendChild(totalValue);
    summaryElement.appendChild(totalElement);
}

function updatePaymentStatus() {
    const paymentFormContainer = document.getElementById('payment-form-container');
    const cardContainer = paymentFormContainer.querySelector('#card-container');
    const status = paymentFormContainer.querySelector('#payment-status');
    const success = paymentFormContainer.querySelector('#payment-success');

    cardContainer.innerHTML = "";
    status.innerHTML = "";
    success.style.display = "none"
}


async function openPaymentModal() {
    if (cart.length === 0) {
        alert('Il tuo carrello è vuoto');
        return;
    }

    const modal = document.getElementById('payment-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    updatePaymentSummary();
    updatePaymentStatus();
    await initializeCard();
}

function updateCartBadge() {
    const cartButton = document.querySelector('.cart-button');
    if (!cartButton) return;

    let badge = cartButton.querySelector('.cart-badge');

    if (cart.length > 0) {
        if (!badge) {
            badge = document.createElement('span');
            badge.classList.add('cart-badge');
            cartButton.appendChild(badge);
        }
        badge.textContent = cart.length;
    } else if (badge) {
        badge.remove();
    }
}

function toggleCartModal() {
    if (!cartModal) return;

    if (cartModal.style.display === 'flex') {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    } else {
        updateCartDisplay();
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function togglePaymentModal() {
    if (!paymentModal) return;

    if (paymentModal.style.display === 'flex') {
        toggleCartModal();
        paymentModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    } else {
        updatePaymentSummary();
        paymentModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function addToCart(name, price) {
    cart.push({
        name: name,
        price: price
    });

    updateCartBadge();
    showNotification(`${name} aggiunto al carrello`);
}

function handleAddToCart() {
    const product = document.querySelector(".product-title");
    const price = document.querySelector(".product-price");
    if (product && price) {
        const productName = product.textContent;
        const productPrice = parseFloat(price.textContent);
        addToCart(productName, productPrice);
    }
}

function handleOpenCart(e) {
    e.preventDefault();
    toggleCartModal();
}

const addToCartButton = document.querySelector('.add-to-cart');
addToCartButton.addEventListener("click", handleAddToCart);

const cartButton = document.querySelector('.cart-button');
cartButton.addEventListener('click', handleOpenCart);

const cartModal = document.getElementById("cart-modal");
cartModal.querySelector('.close-modal').addEventListener('click', toggleCartModal);
cartModal.querySelector('#continue-shopping').addEventListener('click', toggleCartModal);
cartModal.querySelector('#checkout-button').addEventListener('click', openPaymentModal);

const paymentModal = document.getElementById("payment-modal");
paymentModal.querySelector('.close-modal').addEventListener('click', togglePaymentModal);
paymentModal.querySelector('#cancel-payment').addEventListener('click', togglePaymentModal);
paymentModal.querySelector('#pay-button').addEventListener('click', handlePayment);

initializeSquarePayment();

