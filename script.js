// script.js
// Makes the TastyBite food menu interactive.
// The customer can add food to an order, see the order summary,
// and clear the order.

// this array holds everything the customer has added so far
let order = [];

// grab the elements we need from the page
const addButtons = document.querySelectorAll(".add-btn");
const itemCountEl = document.getElementById("itemCount");
const totalPriceEl = document.getElementById("totalPrice");
const orderListEl = document.getElementById("orderList");
const clearOrderBtn = document.getElementById("clearOrderBtn");
const notification = document.getElementById("notification");
const clockEl = document.getElementById("clock");
const cartIcon = document.getElementById("cartIcon");
const cartCountEl = document.getElementById("cartCount");
const orderSummary = document.getElementById("orderSummary");
const siteHeader = document.querySelector("header");

// ---- Core: Add to Order button ----
addButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const name = btn.getAttribute("data-name");
    const price = parseFloat(btn.getAttribute("data-price"));

    addToOrder(name, price);
    showNotification(); // Feature: "Item Added Successfully" notice
  });
});

// adds an item to the order, or increases its quantity if it is already there
function addToOrder(name, price) {
  const existingItem = order.find(function (item) {
    return item.name === name;
  });

  if (existingItem) {
    existingItem.qty++;
  } else {
    order.push({ name: name, price: price, qty: 1 });
  }

  renderOrder();
}

// Feature: increase quantity button
function increaseQty(name) {
  const item = order.find(function (i) {
    return i.name === name;
  });

  if (item) {
    item.qty++;
    renderOrder();
  }
}

// Feature: decrease quantity button (removes item once it hits 0)
function decreaseQty(name) {
  const item = order.find(function (i) {
    return i.name === name;
  });

  if (item) {
    item.qty--;
    if (item.qty <= 0) {
      removeItem(name);
    } else {
      renderOrder();
    }
  }
}

// Feature: remove one item completely from the order
function removeItem(name) {
  order = order.filter(function (i) {
    return i.name !== name;
  });
  renderOrder();
}

// draws the order list on the page and updates the count and total
// (this also covers the "show item names" and "show quantity per item" features)
function renderOrder() {
  orderListEl.innerHTML = "";

  let totalItems = 0;
  let totalPrice = 0;

  order.forEach(function (item) {
    totalItems += item.qty;
    totalPrice += item.qty * item.price;

    const li = document.createElement("li");
    li.className = "order-item";
    li.innerHTML =
      '<div class="order-item-info">' +
        '<span class="order-item-name">' + item.name + '</span>' +
        '<span class="order-item-qty">' + item.qty + ' x ' + item.price + ' birr</span>' +
      '</div>' +
      '<div class="order-item-actions">' +
        '<button class="qty-btn" onclick="decreaseQty(\'' + item.name + '\')">-</button>' +
        '<span class="qty-value">' + item.qty + '</span>' +
        '<button class="qty-btn" onclick="increaseQty(\'' + item.name + '\')">+</button>' +
        '<button class="remove-btn" onclick="removeItem(\'' + item.name + '\')">Remove</button>' +
      '</div>';

    orderListEl.appendChild(li);
  });

  itemCountEl.textContent = totalItems;
  totalPriceEl.textContent = totalPrice;
  cartCountEl.textContent = totalItems; // keep the cart badge in sync too
}

// ---- Core: Clear Order button ----
clearOrderBtn.addEventListener("click", function () {
  order = [];
  renderOrder();
});

// Feature: show "Item Added Successfully" for a short moment
function showNotification() {
  notification.classList.add("show");
  setTimeout(function () {
    notification.classList.remove("show");
  }, 1500);
}

// Feature: show the current date and time, and keep it updating
function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleDateString() + " " + now.toLocaleTimeString();
}
updateClock();
setInterval(updateClock, 1000);

// Feature: clicking the cart icon shows/hides the Order Summary
cartIcon.addEventListener("click", function () {
  orderSummary.classList.toggle("hidden");

  // if we just opened it, scroll it into view
  if (!orderSummary.classList.contains("hidden")) {
    orderSummary.scrollIntoView({ behavior: "smooth" });
  }
});

// Feature: header becomes fixed and changes color after scrolling down
window.addEventListener("scroll", function () {
  if (window.scrollY > 80) {
    siteHeader.classList.add("sticky");
    document.body.classList.add("header-fixed");
  } else {
    siteHeader.classList.remove("sticky");
    document.body.classList.remove("header-fixed");
  }
});
