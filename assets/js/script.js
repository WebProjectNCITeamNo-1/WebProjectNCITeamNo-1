const shoppingCartDisplay = document.getElementById("shopping-cart");
const emptyCartButton = document.getElementById("totals-box");
const orderForm = document.getElementById("order-form");
const shipping = document.getElementById("shipping");
const total = document.getElementById("total");
const grandTotal = document.getElementById("grand-total");
let orderDetails = document.getElementById("order-details");
let orderNumber = document.getElementById("order-number");
const accordionCheckout = document.getElementById("accordionCheckout");
const emails = document.getElementById('email');
const firstNames = document.getElementById('firstName');
const lastNames = document.getElementById('lastName');
const generateOrderNumber = Math.floor(Math.random() * 33333333) + 1;




//localstorage ensures it is accessible on different pages
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let cartProductIds = JSON.parse(localStorage.getItem('cartProductIds')) || [];


//Product array
let allProducts = [];
const csvProducts = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSPincwalJfope49qT7BjSqoJauyMnjolV8PcEJf20XIj-LHCE4DZfkNMtV5rPslS0zNs-C6o-gjabr/pub?output=csv";


//fetch products from google sheet
function fetchProducts(x = null) {
    return fetch(csvProducts)
        .then(response => response.text())
        .then(csvText => {
            // Parse CSV with PapaParse
            const results = Papa.parse(csvText, {
                header: true, // Use the first row as headers
                skipEmptyLines: true, // Ignore empty rows
                dynamicTyping: true // Automatically convert numeric values
            });

            if (results.errors.length) {
                console.error("Error parsing CSV:", results.errors);
                return [];
            }

            // Map and ensure all required fields are present
            const allProducts = results.data.map(product => {
                product.price = product.price || 0;
                product.description = product.description || "No description available.";
                product.image = product.image || "https://via.placeholder.com/150";
                product.category = product.category || "Uncategorized"; // Ensure category field exists
                return product;
            });

            // Filter by category if "x" is provided
            if (x) {
                const filteredProducts = allProducts.filter(
                    product => product.category.toLowerCase() === x.toLowerCase()
                );
                return filteredProducts;
            }

            // Return all products if no filter is provided
            return allProducts;
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            return [];
        });
}




//Allow DOM to load before actions
document.addEventListener("DOMContentLoaded", async function() {
    const bodyId = document.body.id;
    const productList = document.getElementById('product-list');
    const shoppingCart = document.getElementById('shopping-cart-list');

    //Fetch the products from the csv based on special product category
    if(bodyId==='index-page'){
        products = await fetchProducts("special");
    }
    if(bodyId==='products-page'){
        products = await fetchProducts();
    }

    if(bodyId==='index-page' || bodyId==='products-page'){
        
        // Looping through the allproducts array and creating each cards
        products.forEach(product => {
            // Create the card outer div
            const card = document.createElement('div');
            card.classList.add('card', 'm-3');
            card.style.width = '18rem';

            // Populate the div/card's inner content
            card.innerHTML = `
                <img src="${product.image}" class="card-img-top" style="height: 160px;" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-price">Price: €${product.price.toFixed(2)}</p>
                    <button type="button" class="btn btn-dark add-to-cart-btn" 
                        data-product-price="${product.price}"
                        data-product-name="${product.name}"
                        data-product-qty="1" 
                        data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            `;

            // Append the card to the product list
            productList.appendChild(card);

        });

        //Add event listeners to all the "Add to Cart" button elements
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.productId);
                const productName = this.dataset.productName    ;
                const productPrice = parseFloat(this.dataset.productPrice);
                const productQty = parseFloat(this.dataset.productQty);
                console.log(`Added Product ID: ${productId}, Price: €${productPrice}`);
                if (cartItems.some(item => item.productId === productId)){
                    alert("Sorry, You have previously added this item to cart!");
                }
                else{
                    cartItems.push({productId, productName, productPrice, productQty});
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    alert("Item added to cart successfuly!");
                };
                if (cartProductIds.includes(productId)){
                }
                else{
                    cartProductIds.push(productId);
                    localStorage.setItem('cartProductIds', JSON.stringify(cartProductIds));
                };
            });
        });

    }
    if(bodyId==='cart-page'){

        if(cartItems.length > 0){
            accordionCheckout.style.display ="block";
            // Looping through the allproducts array and creating each cards
            cartItems.forEach(item => {
                // Create the card outer div
                const basket = document.createElement('div');

                // Populate the div/card's inner content

                basket.innerHTML = `
                    <div>
                        <div class="row">
                            <div class="col"><i class="fas fa-tag"></i> ${item.productName}</div>
                            <div class="col-2 px-0">${item.productPrice}.00</div>
                            <div class="col">
                                <input id="qty-${item.productId}" value="${item.productQty}" type="number" min="1" max="99" style="width: 40px;">
                                <a onclick="priceUpdate(${item.productId})"><span class="text-primary cursor">Update</span></a>
                            </div>
                            <div id="subtotal-${item.productId}" class="col-2 subt-total px-0">${item.productPrice*item.productQty}.00</div>
                        </div>
                        
                    </div>
                `;
                shoppingCart.appendChild(basket);
            });
        }else{
            emptyCartButton.style.display = "none";
            shoppingCart.innerHTML = "Your Cart is Currently Empty!";
            accordionCheckout.style.display ="none";
        }
        totals();

    }
    //convert array to easily readable string
    if (orderDetails) {
        orderDetails.value = cartItems
            .map(item => `ID: ${item.productId}, Name: ${item.productName}, Price: €${item.productPrice}, Quantity: ${item.productQty}`)
            .join('\n');
            
            orderNumber.value = generateOrderNumber;
    }


});

function emptyCart(){
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    cartProductIds = [];
    localStorage.setItem('cartProductIds', JSON.stringify(cartProductIds));
    alert("Your Shopping cart is now empty!");
    accordionCheckout.style.display ="none";
};
function emptyCart2(){
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    cartProductIds = [];
    localStorage.setItem('cartProductIds', JSON.stringify(cartProductIds));
};

function priceUpdate(productId){
    const inputField = document.getElementById(`qty-${productId}`);
    let newQty = inputField.value;

    const index = cartItems.findIndex(item => item.productId === productId);
    if (index !== -1) {
        // Update the quantity of the located product
        cartItems[index].productQty = newQty;

        // update localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Update the subtotal
        const subtotalField = document.querySelector(`#subtotal-${productId}`);
        const updatedSubtotal = cartItems[index].productPrice * newQty;
        subtotalField.textContent = updatedSubtotal.toFixed(2);

        totals();
        refresh();
        alert(`Updated Product ID: ${productId}, New Quantity: ${newQty}`);

    } else {
        alert(`Product with ID ${productId} not found in the cart.`);
    }

}

//calculate total, shipping, and grandtotal
function totals(){
    let totalBuffer = 0;
    shipping.textContent = 10;
    for(i=0; i<cartItems.length; i++){
        totalBuffer += cartItems[i].productPrice*cartItems[i].productQty;
    }
    total.textContent = totalBuffer;
    grandTotal.textContent = parseFloat(shipping.textContent) + parseFloat(total.textContent);

}




//Order confirmation message
function messageAlert(emailAddress, firstName, lastName) {
    const message = document.getElementById('message');
    const formBox = document.getElementById('checkout-main');
    const date = new Date();
    
    message.innerHTML = `<div class="container mt-5 card">
                            <div class="p-0 card-header text-center bg-light">
                                <h2>Hey ${firstName} ${lastName}! Thank You for your order.</h2>            

                                <p class="text-muted">A confirmation email has been sent to <strong>${emailAddress}</strong></p>
                            </div>
                            <div class="card-body">
                                <h4>Order Info</h4>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <p><strong>Order Number:</strong> #${generateOrderNumber}</p>
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Order Date & Time:</strong> ${date}</p>
                                    </div>
                                </div>
                            </div>
                        </div>`;
    formBox.style.display = 'none';
}
