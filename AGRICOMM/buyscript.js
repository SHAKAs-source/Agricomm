//Crop items dataset
const cropsData = [
	{
		id: 1,
		name: "Fresh Matooke",
		category: "Bananas",
		price: 25000,
		unit: "Bunch",
		farmer: "Kato Farmers",
		location: "Mukono",
		image: "images/matooke.jpeg"
	},
	{
		id: 2,
		name: "Yellow Maize",
		category: "Grains & Beans",
		price: 1800,
		unit: "Kg",
		farmer: "Mityana Grain Co-op",
		location: "Mityana",
		image: "images/maize.jpg"
	},
	{
		id: 3,
		name: "Fresh Tomatoes",
		category: "Vegetables",
		price: 4000,
		unit: "Heap",
		farmer: "Nalubega Farms",
		location: "Wakiso",
		image: "images/tomatoes.jpg"
	},
	{
		id: 4,
		name: "Red Beans",
		category: "Grains & Beans",
		price: 3500,
		unit: "Kg",
		farmer: "Ankole Produce Ltd",
		location: "Mbarara",
		image: "images/beans.jpg"
	},
	{
		id: 5,
		name: "Fresh Cassava",
		category: "Roots & Tubers",
		price: 1500,
		unit: "Heap",
		farmer: "Lira Roots Association",
		location: "Lira",
		image: "images/cassava.jpg"
	},
	{
		id: 6,
		name: "Irish Potatoes",
		category: "Roots & Tubers",
		price: 2800,
		unit: "Kg",
		farmer: "Kigezi Growers",
		location: "Kabale",
		image: "images/irish_potatoes.jpg"
	},
	{
		id: 7,
		name: "Red Onions",
		category: "Vegetables",
		price: 3000,
		unit: "Kg",
		farmer: "Busoga Farmers Union",
		location: "Jinja",
		image: "images/onions.jpg"
	},
	{
		id: 8,
		name: "Sweet Mangoes",
		category: "Fruits",
		price: 5000,
		unit: "Basket",
		farmer: "Luweero Orchards",
		location: "Luweero",
		image: "images/mangoes.jpg"
	}
];

//State variables
let selectedCategory = "All";
let shoppingCart = [];

//Initial render on page load
window.onload = function() {
	renderCropGrid(cropsData);
};

//Render Cards to Page
function renderCropGrid(dataArray) {
	const gridContainer = document.getElementById("cropsGrid");
	gridContainer.innerHTML = "";

	if (dataArray.length === 0) {
		gridContainer.innerHTML = `<div class="no-results"><h3>No crops found</h3><p>Try adjusting your search filters or price range.</p></div>`;
		return;
	}

	dataArray.forEach(crop => {
		const cardHTML = `
			<div class="crop-card">
				<div class="crop-image-container">
					<img src="${crop.image}" alt="${crop.name}" class="crop-image">
					<span class="badge-location"> 📍 ${crop.location}</span>
				</div>
				<div class="crop-details">
					<div class="crop-name">${crop.name}</div>
					<div class="farmer-info">By ${crop.farmer}</div>
					<div class="crop-price">
						UGX ${crop.price.toLocaleString()} <span class="unit-text">/ ${crop.unit}</span>
					</div>
					<button class="btn btn-green" style="width: 100%; margin-top: 5px;" onclick="addToCart(${crop.id})">Add to Basket</button>
				</div>
			</div>
		`;
		gridContainer.innerHTML += cardHTML;
	});
}

//Price label update
function updatePriceLabel() {
	const priceVal = document.getElementById("priceRange").value;
	document.getElementById("priceValueText").innerText = "UGX " + parseInt(priceVal).toLocaleString();
}

//Category Selection
function selectCategory(categoryName, element) {
	selectedCategory = categoryName;
	
	//Toggle UI active class
	const items = document.querySelectorAll(".category-item");
	items.forEach(item => item.classList.remove("active"));
	element.classList.add("active");

	applyAllFilters();
}

//Filter and Sort Logic
function applyAllFilters() {
	const searchKeyword = document.getElementById("searchInput").value.toLowerCase();
	const maxPrice = parseInt(document.getElementById("priceRange").value);
	const sortOption = document.getElementById("sortSelect").value;

	let filtered = cropsData.filter(crop => {
		const matchesSearch = crop.name.toLowerCase().includes(searchKeyword) || crop.location.toLowerCase().includes(searchKeyword);
		const matchesCategory = (selectedCategory === "All") || (crop.category === selectedCategory);
		const matchesPrice = crop.price <= maxPrice;

		return matchesSearch && matchesCategory && matchesPrice;
	});

	//Sorting
	if (sortOption === "lowToHigh") {
		filtered.sort((a, b) => a.price - b.price);
	} else if (sortOption === "highToLow") {
		filtered.sort((a, b) => b.price - a.price);
	}

	renderCropGrid(filtered);
}

//Cart Drawer Handlers
function toggleCart() {
	const overlay = document.getElementById("cartOverlay");
	if (overlay.style.display === "flex") {
		overlay.style.display = "none";
	} else {
		overlay.style.display = "flex";
	}
}

function addToCart(cropId) {
	const selectedCrop = cropsData.find(c => c.id === cropId);
	const existingItem = shoppingCart.find(item => item.id === cropId);

	if (existingItem) {
		existingItem.quantity += 1;
	} else {
		shoppingCart.push({ ...selectedCrop, quantity: 1 });
	}

	updateCartUI();
	showToast(selectedCrop.name + " added to basket!");
}

function changeQuantity(cropId, delta) {
	const existingItem = shoppingCart.find(item => item.id === cropId);
	if (existingItem) {
		existingItem.quantity += delta;
		if (existingItem.quantity <= 0) {
			shoppingCart = shoppingCart.filter(item => item.id !== cropId);
		}
	}
	updateCartUI();
}

function updateCartUI() {
	const container = document.getElementById("cartItemsContainer");
	const badge = document.getElementById("cartCountBadge");
	const totalText = document.getElementById("cartTotalText");

	container.innerHTML = "";

	let totalItems = 0;
	let totalPrice = 0;
	
	if (shoppingCart.length === 0) {
		container.innerHTML = `<p style="text-align: center; color: #888; margin-top: 30px;">Your basket is currently empty.</p>`;
	} else {
		shoppingCart.forEach(item => {
			totalItems += item.quantity;
			totalPrice += item.price * item.quantity;

			const itemHtml = `
				<div class="cart-item">
					<div>
						<div class="cart-item-title">${item.name}</div>
						<div class="cart-item-price">UGX ${(item.price * item.quantity).toLocaleString()}</div>
						<div class="qty-controls">
							<button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
							<span style="font-size: 13px;">${item.quantity} ${item.unit}</span>
							<button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
						</div>
					</div>
				</div>
			`;
			container.innerHTML += itemHtml;
		});
	}

	badge.innerText = totalItems;
	totalText.innerText = "UGX " + totalPrice.toLocaleString();
}

function showToast(message) {
	const toast = document.getElementById("toast");
	toast.innerText = message;
	toast.style.display = "block";
	setTimeout(() => {
		toast.style.display = "none";
	}, 2500);
}

function checkoutAlert() {
	if (shoppingCart.length === 0) {
		alert("Your basket is empty!");
	} else {
		alert("Thank you for your order! AgriComm will process your produce purchase.");
		shoppingCart = [];
		updateCartUI();
		toggleCart();
	}
}
