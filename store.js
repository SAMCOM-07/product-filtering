const closeCart = document.querySelector('.closeCart');
const openCart = document.querySelector('.cartLogo i');
const cartOverlay = document.querySelector('.cartOverlay');
const cartList = document.querySelector('.cartList');
const productContainer = document.querySelector('.productContainer');
const cartQuantity = document.querySelector('.cartQuantity');
const clearAllBtn = document.querySelector('.clearAllBtn');
const totalPrice = document.querySelector('.totalPrice span');



// EVENTLISTENER FOR OPENING CART
closeCart.addEventListener('click', () => {
  cartOverlay.style.opacity = 0;
  document.body.style.overflowX = 'hidden';
  document.body.style.overflowY = 'scroll';
  cartOverlay.style.animation = 'flyUp 1s ease-in-out forwards';
});

// EVENTLISTENER FOR CLOSING CART
openCart.addEventListener('click', () => {
  cartOverlay.style.opacity = 1;
  cartOverlay.style.animation = 'flyDown 1s ease-in-out forwards';
  cartOverlay.style.zIndex = '1000';
  document.body.style.overflow = 'hidden';
});

// Fetching products from JSON file
// Function to fetch products
const getProducts = async () => {
  try {
    const res = await fetch('./data.json');
    const data = await res.json();
    productList = data;
  }

  catch (error) {
    console.error('Error fetching products:', error);
  }
  displayProduct();
  getData();
  displayCart();
  emptyCart();

}
getProducts();

let productList = [];

// adding products to page
const displayProduct = () => {
  productList.forEach(product => {
    const { id, name, price, img, rating } = product;
    const eachProduct = document.createElement('div');
    eachProduct.classList.add('eachProduct');
    eachProduct.id = id;
    eachProduct.innerHTML =  `<img src=${img} alt="product image" />
                              <h3>${name}</h3>
                              <p class="price">$${price}</p>
                              <img src= ${rating} width="80px" />
                              <button class="addToCartBtn">Add to Cart</button>`;
    productContainer.appendChild(eachProduct);
  })
}

// SAVING TO LACAL STORAGE
const saveData = () => {
  localStorage.setItem('myCart', JSON.stringify(carts));
}

// GETTING SAVED DATA
const getData = () => {
  if (localStorage.getItem('myCart')) {
    carts = JSON.parse(localStorage.getItem('myCart'));
  }
}

// EMPTY CART
const emptyCart = () => {
  if (cartList.innerHTML == '') {
    const empty = document.createElement('p');
    empty.classList = 'empty';
    empty.innerHTML = `<p>Cart is Empty !</p>
                      <p>Go and Shop !!!</p>`;
    cartList.appendChild(empty);
    totalPrice.innerHTML = `$${0}`;

  }
}

// Event Listener to get product ID
productContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('addToCartBtn')) {
    const newId = e.target.parentElement.id;
    addToCart(newId);
  }
});

// ADDING TO CART
let carts = [];

const addToCart = (newId) => {
  const cartItemPosition = carts.findIndex(value => value.id == newId)
  if (carts.length === 0 || cartItemPosition === -1) {
    carts.push({
      id: newId,
      quantity: 1
    });
  }
  else{
    carts[cartItemPosition].quantity++;
  }
  // alert('Product Added ✅');
  displayCart(newId);
  total();
  saveData();
}

// CLEAR ALL IN CART
clearAllBtn.addEventListener('click', () => {
  cartList.innerHTML = '';
  carts.length = 0;
  cartQuantity.textContent = 0;
  
  saveData();
  displayCart();
  emptyCart();
})

// DISPLAY CONTENTS IN CART

const displayCart = () => {
  cartList.innerHTML = '';
  let totalQuantity = 0;
  carts.forEach(cart => {
    let cartQuantity = cart.quantity;
    totalQuantity = totalQuantity + cartQuantity;
    const product = productList.find(value => value.id == cart.id)
    let { name, id, price, img } = product;
    const eachList = document.createElement('div');
    eachList.className = 'eachList';
    eachList.id = id;
    eachList.innerHTML = `<img src=${img} alt="" />
                          <span class="name">${name}</span>
                            <span class="price">$${(price * cartQuantity).toFixed(2)}</span>
                            <div class="productQuantity">
                              <span class="decrease"><</span>
                              <span class="quantity">${cartQuantity}</span>
                              <span class="increase">></span>
                            </div>
                            <span><i class="bxr bx-trash removeProduct">`;
    cartList.appendChild(eachList);
  })
  cartQuantity.textContent = totalQuantity;
};

// Toal Cost
const total = () => {
  let totalCost = 0;
  carts.forEach(cart => {
    const product = productList.find(value => value.id == cart.id);
    totalCost += product.price * cart.quantity;
  });
  totalPrice.textContent = `$${totalCost.toFixed(2)}`;
  
  saveData();
  displayCart();
}

// Increment and Decrement and deletion of cart products
cartList.addEventListener('click', (e) => {
  const id = e.target.parentElement.parentElement.id;
  const cartsPosition = carts.findIndex(value => value.id == id);
  if (e.target.classList.contains('increase')) {
    carts[cartsPosition].quantity++;
    // console.log(read);
  }
  else if (e.target.classList.contains('decrease')) {
    const valueChange = carts[cartsPosition].quantity - 1;
    if (valueChange >= 1) {
      carts[cartsPosition].quantity = valueChange;
    }
  }
  else if (e.target.classList.contains('removeProduct')) {
    carts.splice(cartsPosition, 1);
  }
  total();
  saveData();
  displayCart();
  emptyCart();
});

// Filtering product by Search input

const searchInput = document.querySelector('#search');

searchInput.addEventListener('input', () => {
  inputValue = searchInput.value.toLowerCase();
  filterProduct(inputValue);
});

const filterProduct = (inputValue) => {
  const allHead = document.querySelectorAll('.eachProduct h3');
  allHead.forEach(head => {
    headContent = head.textContent.toLowerCase();
    if (headContent.includes(inputValue)) {
      head.parentElement.style.display = 'flex';
    }
    else {
      head.parentElement.style.display = 'none';
    }
  })

}

// Filtering product by buttons
const filterBtns = document.querySelectorAll('.filterBtns button');

filterBtns.forEach(button => {
  button.addEventListener('click', () => {
    buttonContent = button.className.toLowerCase();
    const allHead = document.querySelectorAll('.eachProduct h3');
    allHead.forEach(head => {
      headContent = head.textContent.toLowerCase();
      if (button.classList.contains('pad') ||
          button.classList.contains('laptop') || 
          button.classList.contains('speaker') ||
          button.classList.contains('keyboard')) {
        headContent.includes(buttonContent) ? head.parentElement.style.display = 'flex' : head.parentElement.style.display = 'none';
      }
      else if (button.classList.contains('allProduct')) {
        productContainer.innerHTML = '';
        displayProduct();
      }
      searchInput.value = '';
    });
  });
});