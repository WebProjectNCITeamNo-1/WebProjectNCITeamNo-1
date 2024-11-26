const shoppingCartDisplay = document.getElementById("shopping-cart");
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
        id: 3, 
        name: "Eire Tower", 
        price: 30, 
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.", 
        image: "https://www.singulart.com/blog/wp-content/uploads/2023/08/image-34-1140x855.png" 
    }
];

// Get the container element
const productList = document.getElementById('product-list');

//Allow DOM to load before actions
document.addEventListener("DOMContentLoaded", function() {
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
            const productId = this.dataset.productId;
            const productPrice = this.dataset.productPrice;
            const productQty = this.dataset.productQty;
            console.log(`Added Product ID: ${productId}, Price: €${productPrice}`);
            if (cartItems.some(item => item.productId === productId)){
                alert("Sorry, You have previously added this item to cart!");
            }
            else{
                cartItems.push({productId, productQty});
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            };
            if (cartProductIds.includes(productId)){
                alert("Sorry, You have previously added this item to cart!");
            }
            else{
                cartProductIds.push(productId);
                localStorage.setItem('cartProductIds', JSON.stringify(cartProductIds));
            };

            
            
            console.log(cartItems);
            console.log(cartProductIds);
        });
    });
    
});

function emptyCart(){
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    cartProductIds = [];
    localStorage.setItem('cartProductIds', JSON.stringify(cartProductIds));
    alert("Your Shopping cart is now empty!");
};


console.log(cartItems);
console.log(cartProductIds);