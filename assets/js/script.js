const shoppingCartDisplay = document.getElementById("shopping-cart");
const emptyCartButton = document.getElementById("totals-box");
const orderForm = document.getElementById("order-form");
const shipping = document.getElementById("shipping");
const total = document.getElementById("total");
const grandTotal = document.getElementById("grand-total");
let orderDetails = document.getElementById("order-details");


//localstorage ensures it is accessible on different pages
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let cartProductIds = JSON.parse(localStorage.getItem('cartProductIds')) || [];


//Product array
const allProducts = [
    { 
        id: 1, 
        name: "Monalissa", 
        price: 25, 
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.", 
        image: "https://api-www.louvre.fr/sites/default/files/2020-12/leonard-de-vinci-la-joconde-portrait-de-monna-lisa-detail.jpg" 
    },
    { 
        id: 2, 
        name: "Eifle Tower", 
        price: 40, 
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.", 
        image: "https://media.architecturaldigest.com/photos/5ef5f6b4e5c8c1d259c3b00b/16:9/w_1600,c_limit/GettyImages-803432314.jpg" 
    },
    { 
        id: 3, 
        name: "Eire Tower", 
        price: 30, 
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.", 
        image: "https://www.wmf-inc.com/assets/galleries/Projects/Bicentennial-Tower/_AUTOx300_fit_center-center_100/Tower.jpg" 
    },
    { 
        id: 4, 
        name: "Famous Art", 
        price: 30, 
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.", 
        image: "https://www.singulart.com/blog/wp-content/uploads/2023/08/image-34-1140x855.png" 
    }
];

// Get the container element
const productList = document.getElementById('product-list');
const shoppingCart = document.getElementById('shopping-cart-list');

//Allow DOM to load before actions
document.addEventListener("DOMContentLoaded", function() {
    const bodyId = document.body.id;
    const currentPath = window.location.pathname;
    if(bodyId==='index-page'){
        // Looping through the allproducts array and creating each cards
        allProducts.forEach(product => {
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
                    <a href="#" class="btn btn-primary">View</a>
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

                
                
                console.log(cartItems);
                console.log(cartProductIds);
            });
        });

    }
    else if(bodyId==='cart-page'){
        if(cartItems.length > 0){
            // Looping through the allproducts array and creating each cards
            cartItems.forEach(item => {
                // Create the card outer div
                const basket = document.createElement('div');
                basket.classList.add('card', 'm-3');
                basket.style.width = '36rem';

                // Populate the div/card's inner content

                basket.innerHTML = `
                    <div class="card-body">
                        <div class="row bg-warning">
                            <div class="col">${item.productId}</div>
                            <div class="col">${item.productName}</div>
                            <div class="col">${item.productPrice}.00</div>
                            <div class="col">
                                <input id="qty-${item.productId}" value="${item.productQty}" type="number" min="1" max="99" style="width: 40px;">
                                <a onclick="priceUpdate(${item.productId})"><span>Update</span></a>
                            </div>
                            <div id="subtotal-${item.productId}" class="col subt-total">${item.productPrice*item.productQty}.00</div>
                        </div>
                        
                    </div>
                `;
                shoppingCart.appendChild(basket);
            });
        }else{
            emptyCartButton.style.display = "none";
            shoppingCart.innerHTML = "Your Cart is Currently Empty!";
        }
        totals();

    }


    
});

function emptyCart(){
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    cartProductIds = [];
    localStorage.setItem('cartProductIds', JSON.stringify(cartProductIds));
    alert("Your Shopping cart is now empty!");
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

console.log(cartItems);
console.log(cartProductIds);

//convert array to easily readable string
orderDetails.value = cartItems
    .map(item => `ID: ${item.productId}, Name: ${item.productName}, Price: €${item.productPrice}, Quantity: ${item.productQty}`)
    .join('\n');


// Bootstrap javaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
  