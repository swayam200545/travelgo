// ===== TRAVELGO INTERACTIVE CHECKOUT & PRODUCT SCRIPT =====

const products = {
  lite: {
    name: "TravelGo Lite",
    price: 2499,
    image: "images/travelgo-lite.png",
    description: "Compact 20L slim profile for everyday office & college commute.",
    capacity: "20 Liters",
    laptop: 'Up to 14"',
    weight: "1.1 kg",
    badge: "Lightweight Daily Commute"
  },
  pro: {
    name: "TravelGo Pro",
    price: 3999,
    image: "images/travelgo-pro.png",
    description: "Versatile 28L tech backpack with TSA lock & USB-C charging.",
    capacity: "28 Liters",
    laptop: 'Up to 16"',
    weight: "1.4 kg",
    badge: "Most Popular Choice"
  },
  max: {
    name: "TravelGo Max",
    price: 5499,
    image: "images/travelgo-max.png",
    description: "Expandable 35L weekend & long haul travel bag with shoe pocket.",
    capacity: "35 Liters",
    laptop: 'Up to 16"',
    weight: "1.8 kg",
    badge: "Maximum Travel Capacity"
  }
};

let selectedKey = "pro"; // Default selected model
let quantity = 1;
let currentDiscountPercent = 0; // Discount percentage applied via coupon
let selectedPaymentMode = "UPI / QR Code"; // Default payment mode

// DOM Elements: Main Customizer
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
const variantButtons = document.querySelectorAll(".variant");
const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productDesc = document.getElementById("productDesc");
const productPrice = document.getElementById("productPrice");
const productVisualBadge = document.getElementById("productVisualBadge");
const specCap = document.getElementById("specCap");
const specLaptop = document.getElementById("specLaptop");
const specWeight = document.getElementById("specWeight");
const quantityEl = document.getElementById("quantity");
const totalPrice = document.getElementById("totalPrice");

// DOM Elements: Checkout Section
const checkoutRadioInputs = document.querySelectorAll('input[name="checkoutProduct"]');
const checkoutProductCards = {
  lite: document.getElementById("cardOptionLite"),
  pro: document.getElementById("cardOptionPro"),
  max: document.getElementById("cardOptionMax")
};
const summaryProductImg = document.getElementById("summaryProductImg");
const summaryProductName = document.getElementById("summaryProductName");
const summaryProductDesc = document.getElementById("summaryProductDesc");
const summaryQty = document.getElementById("summaryQty");
const summaryBagPrice = document.getElementById("summaryBagPrice");
const discountRow = document.getElementById("discountRow");
const summaryDiscount = document.getElementById("summaryDiscount");
const summaryFinalTotal = document.getElementById("summaryFinalTotal");
const btnPayAmount = document.getElementById("btnPayAmount");

// DOM Elements: Coupon & Payment Mode
const couponCodeInput = document.getElementById("couponCode");
const applyCouponBtn = document.getElementById("applyCouponBtn");
const couponMsg = document.getElementById("couponMsg");
const paymentTabs = document.querySelectorAll(".payment-tab");
const paymentPanels = document.querySelectorAll(".payment-panel");
const checkoutForm = document.getElementById("checkoutForm");

// DOM Elements: Order Confirmation Modal
const orderModal = document.getElementById("orderModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalOrderId = document.getElementById("modalOrderId");
const modalPayMode = document.getElementById("modalPayMode");
const modalProductTitle = document.getElementById("modalProductTitle");
const modalQty = document.getElementById("modalQty");
const modalTotalPaid = document.getElementById("modalTotalPaid");
const modalAddress = document.getElementById("modalAddress");
const mobileStickyInfo = document.querySelector(".mobile-sticky-bar .sticky-info");

// Format Currency in Indian Rupees
function formatPrice(amount) {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const isOpen = navMenu.classList.toggle("open");
  menuBtn.classList.toggle("open", isOpen);
  menuBtn.setAttribute("aria-expanded", isOpen);
}

if (menuBtn) menuBtn.addEventListener("click", toggleMobileMenu);

navMenu?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    if (navMenu.classList.contains("open")) toggleMobileMenu();
  });
});

// Sync Variant Selection Across Both Customizer & Checkout Section
function selectVariant(key) {
  if (!products[key]) return;
  selectedKey = key;

  // 1. Update Main Product Customizer UI
  variantButtons.forEach(btn => {
    const active = btn.dataset.variant === key;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-checked", active);
  });

  // 2. Update Checkout Section Option Cards
  Object.keys(checkoutProductCards).forEach(k => {
    if (checkoutProductCards[k]) {
      const active = k === key;
      checkoutProductCards[k].classList.toggle("active", active);
      const radioInput = checkoutProductCards[k].querySelector('input[type="radio"]');
      if (radioInput) radioInput.checked = active;
    }
  });

  updateProductDetails();
  updateCalculatedTotals();
}

// Update Details & Images
function updateProductDetails() {
  const p = products[selectedKey];

  // Smooth image swap transition
  if (productImage) {
    productImage.style.opacity = "0";
    productImage.style.transform = "scale(0.95)";
    setTimeout(() => {
      productImage.src = p.image;
      productImage.alt = p.name;
      productImage.style.opacity = "1";
      productImage.style.transform = "scale(1)";
    }, 150);
  }

  if (productName) productName.textContent = p.name;
  if (productDesc) productDesc.textContent = p.description;
  if (productVisualBadge) productVisualBadge.textContent = p.badge;
  if (specCap) specCap.textContent = p.capacity;
  if (specLaptop) specLaptop.textContent = p.laptop;
  if (specWeight) specWeight.textContent = p.weight;

  // Update Checkout Summary Box Item Preview
  if (summaryProductImg) summaryProductImg.src = p.image;
  if (summaryProductName) summaryProductName.textContent = p.name;
  if (summaryProductDesc) summaryProductDesc.textContent = p.description;

  // Update Mobile Sticky Bar
  if (mobileStickyInfo) {
    mobileStickyInfo.innerHTML = `<span>${p.name}</span><strong>${formatPrice(p.price)}</strong>`;
  }
}

// Calculate Base, Discount & Final Payable Amounts
function updateCalculatedTotals() {
  const p = products[selectedKey];
  const baseSubtotal = p.price * quantity;
  const discountAmount = (baseSubtotal * currentDiscountPercent) / 100;
  const finalTotal = baseSubtotal - discountAmount;

  // Main Section Updates
  if (productPrice) productPrice.textContent = formatPrice(p.price);
  if (quantityEl) quantityEl.textContent = quantity;
  if (totalPrice) totalPrice.textContent = formatPrice(baseSubtotal);

  // Checkout Section Summary Updates
  if (summaryQty) summaryQty.textContent = quantity;
  if (summaryBagPrice) summaryBagPrice.textContent = formatPrice(baseSubtotal);

  if (currentDiscountPercent > 0) {
    if (discountRow) discountRow.style.display = "flex";
    if (summaryDiscount) summaryDiscount.textContent = `- ${formatPrice(discountAmount)}`;
  } else {
    if (discountRow) discountRow.style.display = "none";
  }

  if (summaryFinalTotal) summaryFinalTotal.textContent = formatPrice(finalTotal);
  if (btnPayAmount) btnPayAmount.textContent = formatPrice(finalTotal);
}

// Quantity Adjusters
function increaseQuantity() {
  quantity++;
  updateCalculatedTotals();
}

function decreaseQuantity() {
  if (quantity > 1) {
    quantity--;
    updateCalculatedTotals();
  }
}

document.getElementById("plusBtn")?.addEventListener("click", increaseQuantity);
document.getElementById("minusBtn")?.addEventListener("click", decreaseQuantity);

// Event Listeners: Main Variant Buttons
variantButtons.forEach(btn => {
  btn.addEventListener("click", () => selectVariant(btn.dataset.variant));
});

// Event Listeners: Checkout Option Cards
checkoutRadioInputs.forEach(radio => {
  radio.addEventListener("change", (e) => {
    selectVariant(e.target.value);
  });
});

// Coupon Code Logic
if (applyCouponBtn) {
  applyCouponBtn.addEventListener("click", () => {
    const code = couponCodeInput.value.trim().toUpperCase();
    if (code === "TRAVEL15") {
      currentDiscountPercent = 15;
      couponMsg.className = "coupon-msg success-text";
      couponMsg.textContent = "✓ Promo Code TRAVEL15 Applied! (15% OFF)";
    } else if (code === "") {
      currentDiscountPercent = 0;
      couponMsg.className = "coupon-msg error-text";
      couponMsg.textContent = "Please enter a valid coupon code.";
    } else {
      currentDiscountPercent = 0;
      couponMsg.className = "coupon-msg error-text";
      couponMsg.textContent = "Invalid coupon code. Try TRAVEL15 for 15% OFF.";
    }
    updateCalculatedTotals();
  });
}

// Mock Payment Method Tabs
paymentTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const mode = tab.dataset.mode;
    paymentTabs.forEach(t => t.classList.toggle("active", t === tab));
    paymentPanels.forEach(p => p.classList.toggle("active", p.id === `panel-${mode}`));

    // Store human-readable mode title
    const modeTitles = {
      upi: "UPI / QR Code (GPay / PhonePe / Paytm)",
      card: "Credit / Debit Card",
      netbanking: "Net Banking",
      cod: "Cash on Delivery (COD)"
    };
    selectedPaymentMode = modeTitles[mode] || "Online Payment";
  });
});

// Checkout Form Validation & Submission
function setCheckoutError(id, msg) {
  const el = document.getElementById(id);
  const errEl = document.getElementById(id + "Error");
  if (el) el.classList.toggle("invalid", msg !== "");
  if (errEl) errEl.textContent = msg;
}

function validateCheckoutForm() {
  const name = document.getElementById("cName").value.trim();
  const phone = document.getElementById("cPhone").value.replace(/[\s-]/g, "");
  const email = document.getElementById("cEmail").value.trim();
  const address = document.getElementById("cAddress").value.trim();
  const city = document.getElementById("cCity").value.trim();
  const pincode = document.getElementById("cPincode").value.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phonePattern = /^(\+91|91|0)?[6-9]\d{9}$/;
  const pincodePattern = /^\d{6}$/;
  let valid = true;

  const checks = [
    ["cName", name === "" ? "Please enter your full name." : name.length < 3 ? "Name must be at least 3 characters." : ""],
    ["cPhone", phone === "" ? "Please enter your mobile number." : !phonePattern.test(phone) ? "Enter a valid 10-digit Indian mobile number." : ""],
    ["cEmail", email === "" ? "Please enter your email address." : !emailPattern.test(email) ? "Enter a valid email (e.g. user@example.com)." : ""],
    ["cAddress", address === "" ? "Please enter your delivery address." : address.length < 8 ? "Address must be detailed." : ""],
    ["cCity", city === "" ? "Please enter your city." : ""],
    ["cPincode", pincode === "" ? "Please enter 6-digit Pincode." : !pincodePattern.test(pincode) ? "Enter a valid 6-digit pincode." : ""]
  ];

  checks.forEach(([id, errMsg]) => {
    setCheckoutError(id, errMsg);
    if (errMsg !== "") valid = false;
  });

  return valid;
}

// Clear field errors as user types
["cName", "cPhone", "cEmail", "cAddress", "cCity", "cPincode"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", () => setCheckoutError(id, ""));
});

// Handle Checkout Form Submission (Mock Payment Workflow)
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateCheckoutForm()) {
      const firstInvalid = checkoutForm.querySelector(".invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const submitBtn = checkoutForm.querySelector(".checkout-submit-btn");
    const originalText = submitBtn.innerHTML;

    // Show processing spinner button state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>⏳ Processing Payment Securely...</span>`;

    setTimeout(() => {
      // Restore button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // Populate Modal Confirmation Data
      const p = products[selectedKey];
      const baseSubtotal = p.price * quantity;
      const discountAmount = (baseSubtotal * currentDiscountPercent) / 100;
      const finalTotal = baseSubtotal - discountAmount;

      const randomOrderId = "#TGO-" + Math.floor(10000 + Math.random() * 90000);
      const userCity = document.getElementById("cCity").value.trim();

      if (modalOrderId) modalOrderId.textContent = randomOrderId;
      if (modalPayMode) modalPayMode.textContent = selectedPaymentMode;
      if (modalProductTitle) modalProductTitle.textContent = p.name;
      if (modalQty) modalQty.textContent = quantity;
      if (modalTotalPaid) modalTotalPaid.textContent = formatPrice(finalTotal);
      if (modalAddress) modalAddress.textContent = `${userCity}, India`;

      // Show Order Confirmation Modal
      if (orderModal) orderModal.hidden = false;
    }, 1200);
  });
}

// Close Modal Handler
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    if (orderModal) orderModal.hidden = true;
    checkoutForm.reset();
    selectVariant(selectedKey);
  });
}

// Close modal when clicking outside card
orderModal?.addEventListener("click", (e) => {
  if (e.target === orderModal) {
    orderModal.hidden = true;
    checkoutForm.reset();
    selectVariant(selectedKey);
  }
});

// Initialize Default Selection
selectVariant("pro");
