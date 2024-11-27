const shoppingCartDisplay = document.getElementById("shopping-cart");

//Product array
const allProducts = [
    { 
        id: 1, 
        name: "Monalissa", 
        price: 25, 
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.", 
        image: "https://placehold.co/600x400" 
    },
    { 
        id: 2, 
        name: "Eifle Tower", 
        price: 40, 
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.", 
        image: "https://placehold.co/600x400" 
    },
    { 
        id: 3, 
        name: "Eire Tower", 
        price: 30, 
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.", 
        image: "https://placehold.co/600x400" 
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
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <p class="card-price">Price: $${product.price.toFixed(2)}</p>
                <a href="#" class="btn btn-primary">View</a>
                <button type="button" class="btn btn-dark add-to-cart-btn" 
                    data-product-price="${product.price}" 
                    data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `;

        // Append the card to the product list
        productList.appendChild(card);
    });


});


