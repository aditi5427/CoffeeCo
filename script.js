// CoffeeCo Interactive Features
document.addEventListener('DOMContentLoaded', function () {

    // Shopping Cart
    let cart = [];
    let cartCount = 0;


    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Enhanced navigation functionality
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            const section = this.getAttribute('data-section');

            // Handle different navigation actions
            switch (section) {
                case 'home':
                    document.querySelector('.firstPart').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'coffee':
                    document.querySelector('.thirdPart').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'bakery':
                    // Filter to show desserts
                    filterProducts('desserts');
                    break;
                case 'shop':
                    showShopModal();
                    break;
                case 'about':
                    showAboutModal();
                    break;
            }
        });
    });

    // Dropdown menu functionality
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const filter = this.getAttribute('data-filter');
            filterProducts(filter);

            // Close dropdown
            this.closest('.dropdown').classList.remove('active');
        });
    });

    // Product filtering function
    function filterProducts(filter) {
        const products = document.querySelectorAll('.drink');
        const categoryItems = document.querySelectorAll('.item');

        // Reset all products
        products.forEach(product => {
            product.style.display = 'block';
        });

        // Reset category items
        categoryItems.forEach(item => {
            item.style.transform = 'scale(1)';
        });

        switch (filter) {
            case 'hot':
                products.forEach(product => {
                    const productName = product.querySelector('#drinkName').textContent.toLowerCase();
                    if (!productName.includes('coffee') || productName.includes('iced') || productName.includes('cold')) {
                        product.style.display = 'none';
                    }
                });
                showNotification('Showing Hot Coffee items');
                break;

            case 'cold':
                products.forEach(product => {
                    const productName = product.querySelector('#drinkName').textContent.toLowerCase();
                    if (!productName.includes('iced') && !productName.includes('cold')) {
                        product.style.display = 'none';
                    }
                });
                showNotification('Showing Cold Coffee items');
                break;

            case 'desserts':
                products.forEach(product => {
                    const productName = product.querySelector('#drinkName').textContent.toLowerCase();
                    if (productName.includes('coffee')) {
                        product.style.display = 'none';
                    }
                });
                showNotification('Showing Dessert items');
                break;

            case 'espresso':
                products.forEach(product => {
                    const productName = product.querySelector('#drinkName').textContent.toLowerCase();
                    if (!productName.includes('lungo') && !productName.includes('espresso')) {
                        product.style.display = 'none';
                    }
                });
                showNotification('Showing Espresso items');
                break;

            default:
                showNotification(`Showing ${filter} items`);
        }

        // Animate visible products
        setTimeout(() => {
            products.forEach((product, index) => {
                if (product.style.display !== 'none') {
                    product.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
                }
            });
        }, 100);
    }

    // Enhanced Search functionality
    const searchInput = document.querySelector('#searchInput');
    const searchBtn = document.querySelector('#searchBtn');
    const searchSuggestions = document.querySelector('#searchSuggestions');

    // Search suggestions data
    const searchData = [
        { name: 'Hot Coffee', icon: 'fas fa-coffee', category: 'coffee' },
        { name: 'Cold Coffee', icon: 'fas fa-coffee', category: 'coffee' },
        { name: 'Iced Coffee', icon: 'fas fa-coffee', category: 'coffee' },
        { name: 'Dalgona Coffee', icon: 'fas fa-coffee', category: 'coffee' },
        { name: 'Lungo Coffee', icon: 'fas fa-coffee', category: 'coffee' },
        { name: 'Filter Coffee', icon: 'fas fa-coffee', category: 'coffee' },
        { name: 'Gulab Jamun', icon: 'fas fa-birthday-cake', category: 'dessert' },
        { name: 'Rasgulla', icon: 'fas fa-birthday-cake', category: 'dessert' },
        { name: 'Rasmalai', icon: 'fas fa-birthday-cake', category: 'dessert' },
        { name: 'Kaju Katli', icon: 'fas fa-birthday-cake', category: 'dessert' },
        { name: 'Coffee Beans', icon: 'fas fa-seedling', category: 'shop' },
        { name: 'Brewing Equipment', icon: 'fas fa-coffee', category: 'shop' }
    ];

    // Search input functionality
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();

        if (searchTerm.length > 0) {
            showSearchSuggestions(searchTerm);
        } else {
            hideSearchSuggestions();
        }

        // Filter products
        filterProductsBySearch(searchTerm);
    });

    // Search button functionality
    searchBtn.addEventListener('click', function () {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filterProductsBySearch(searchTerm);
            hideSearchSuggestions();
        }
    });

    // Show search suggestions
    function showSearchSuggestions(searchTerm) {
        const filteredSuggestions = searchData.filter(item =>
            item.name.toLowerCase().includes(searchTerm)
        );

        if (filteredSuggestions.length > 0) {
            searchSuggestions.innerHTML = filteredSuggestions.map(item => `
                <div class="suggestion-item" data-name="${item.name}" data-category="${item.category}">
                    <i class="${item.icon}"></i>
                    <span>${item.name}</span>
                </div>
            `).join('');

            searchSuggestions.classList.add('active');

            // Add click handlers to suggestions
            searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', function () {
                    const name = this.getAttribute('data-name');
                    const category = this.getAttribute('data-category');
                    searchInput.value = name;
                    filterProductsBySearch(name);
                    hideSearchSuggestions();
                });
            });
        } else {
            hideSearchSuggestions();
        }
    }

    // Hide search suggestions
    function hideSearchSuggestions() {
        searchSuggestions.classList.remove('active');
    }

    // Filter products by search
    function filterProductsBySearch(searchTerm) {
        const products = document.querySelectorAll('.drink');

        products.forEach(product => {
            const productName = product.querySelector('#drinkName').textContent.toLowerCase();
            const productDesc = product.querySelector('#description').textContent.toLowerCase();

            if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                product.style.display = 'block';
                product.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                product.style.display = 'none';
            }
        });

        if (searchTerm) {
            showNotification(`Search results for "${searchTerm}"`);
        }
    }

    // Close suggestions when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('#search')) {
            hideSearchSuggestions();
        }
    });

    // Add to cart functionality
    function addToCart(productName, price) {
        const existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: productName,
                price: price,
                quantity: 1
            });
        }

        cartCount++;
        updateCartDisplay();
        showNotification(`${productName} added to cart!`);
    }

    // Update cart display
    function updateCartDisplay() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.textContent = `🛒 (${cartCount})`;
        }
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(45deg, #8B4513, #D2691E);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // Add cart icon to navbar
    const cartIcon = document.createElement('div');
    cartIcon.className = 'cart-icon';
    cartIcon.textContent = '🛒 (0)';
    cartIcon.style.cssText = `
        cursor: pointer;
        padding: 10px 15px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        transition: all 0.3s ease;
        margin-right: 20px;
    `;

    cartIcon.addEventListener('click', showCartModal);
    document.querySelector('.navbar').insertBefore(cartIcon, document.querySelector('#search'));

    // Order buttons functionality
    document.querySelectorAll('#order').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const drinkCard = this.closest('.drink');
            const productName = drinkCard.querySelector('#drinkName').textContent;
            const price = drinkCard.querySelector('#drinkPrice').textContent;

            addToCart(productName, price);
        });
    });

    // Category items click functionality
    document.querySelectorAll('.item').forEach(item => {
        item.addEventListener('click', function () {
            const category = this.querySelector('#itemName').textContent;
            const products = document.querySelectorAll('.drink');

            // Reset all products
            products.forEach(product => {
                product.style.display = 'block';
            });

            // Filter by category
            if (category === 'Hot Coffee' || category === 'Cold Coffee' || category === 'Cup Coffee') {
                products.forEach(product => {
                    const productName = product.querySelector('#drinkName').textContent;
                    if (!productName.toLowerCase().includes('coffee')) {
                        product.style.display = 'none';
                    }
                });
            } else if (category === 'Dessert') {
                products.forEach(product => {
                    const productName = product.querySelector('#drinkName').textContent;
                    if (productName.toLowerCase().includes('coffee')) {
                        product.style.display = 'none';
                    }
                });
            }

            showNotification(`Showing ${category} items`);
        });
    });

    // Newsletter signup
    const subscribeButton = document.querySelector('#subscribe');
    const emailInput = document.querySelector('#mail');

    subscribeButton.addEventListener('click', function (e) {
        e.preventDefault();
        const email = emailInput.value;

        if (validateEmail(email)) {
            showNotification('Thank you for subscribing! Check your email for 15% off code.');
            emailInput.value = '';
        } else {
            showNotification('Please enter a valid email address.');
        }
    });

    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Cart modal
    function showCartModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;

        if (cart.length === 0) {
            modalContent.innerHTML = `
                <h2 style="color: #8B4513; text-align: center; margin-bottom: 20px;">Your Cart is Empty</h2>
                <p style="text-align: center; color: #666;">Add some delicious coffee to get started!</p>
                <button onclick="this.closest('.modal').remove()" style="
                    display: block;
                    margin: 20px auto;
                    padding: 10px 30px;
                    background: linear-gradient(45deg, #8B4513, #D2691E);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                ">Close</button>
            `;
        } else {
            let total = 0;
            let cartHTML = `
                <h2 style="color: #8B4513; text-align: center; margin-bottom: 20px;">Your Cart</h2>
                <div style="margin-bottom: 20px;">
            `;

            cart.forEach(item => {
                const itemTotal = parseFloat(item.price.replace('Rs. ', '')) * item.quantity;
                total += itemTotal;
                cartHTML += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                        <div>
                            <strong>${item.name}</strong>
                            <br>
                            <small>${item.price} x ${item.quantity}</small>
                        </div>
                        <div>
                            <strong>Rs. ${itemTotal.toFixed(0)}</strong>
                            <button onclick="removeFromCart('${item.name}')" style="
                                margin-left: 10px;
                                background: #ff4444;
                                color: white;
                                border: none;
                                border-radius: 50%;
                                width: 25px;
                                height: 25px;
                                cursor: pointer;
                            ">×</button>
                        </div>
                    </div>
                `;
            });

            cartHTML += `
                </div>
                <div style="border-top: 2px solid #8B4513; padding-top: 15px;">
                    <div style="display: flex; justify-content: space-between; font-size: 1.2em; font-weight: bold;">
                        <span>Total:</span>
                        <span>Rs. ${total.toFixed(0)}</span>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="checkout()" style="
                        background: linear-gradient(45deg, #8B4513, #D2691E);
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 25px;
                        cursor: pointer;
                        margin-right: 10px;
                    ">Checkout</button>
                    <button onclick="this.closest('.modal').remove()" style="
                        background: #666;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 25px;
                        cursor: pointer;
                    ">Close</button>
                </div>
            `;

            modalContent.innerHTML = cartHTML;
        }

        modal.className = 'modal';
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Remove from cart function
    window.removeFromCart = function (productName) {
        cart = cart.filter(item => item.name !== productName);
        cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        updateCartDisplay();
        showCartModal(); // Refresh modal
    };

    // Checkout function
    window.checkout = function () {
        if (cart.length > 0) {
            showNotification('Order placed successfully! Thank you for choosing CoffeeCo!');
            cart = [];
            cartCount = 0;
            updateCartDisplay();
            document.querySelector('.modal').remove();
        }
    };

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .cart-icon:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
        }
        
        .modal {
            animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Mobile menu toggle
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.innerHTML = '☰';
    mobileMenuButton.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 10px;
    `;

    document.querySelector('.navbar').appendChild(mobileMenuButton);

    // Mobile menu functionality
    mobileMenuButton.addEventListener('click', function () {
        const navOptions = document.querySelector('.navOption');
        navOptions.style.display = navOptions.style.display === 'flex' ? 'none' : 'flex';
    });

    // Responsive design
    function handleResize() {
        const navOptions = document.querySelector('.navOption');
        if (window.innerWidth <= 768) {
            mobileMenuButton.style.display = 'block';
            navOptions.style.display = 'none';
            navOptions.style.flexDirection = 'column';
            navOptions.style.position = 'absolute';
            navOptions.style.top = '100%';
            navOptions.style.left = '0';
            navOptions.style.right = '0';
            navOptions.style.background = 'rgba(0, 0, 0, 0.95)';
            navOptions.style.padding = '20px';
        } else {
            mobileMenuButton.style.display = 'none';
            navOptions.style.display = 'flex';
            navOptions.style.flexDirection = 'row';
            navOptions.style.position = 'static';
            navOptions.style.background = 'transparent';
            navOptions.style.padding = '0';
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    // Add loading animation
    window.addEventListener('load', function () {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Shop Modal
    function showShopModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            text-align: center;
        `;

        modalContent.innerHTML = `
            <h2 style="color: #8B4513; margin-bottom: 30px; font-size: 2rem;">Our Shop</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div style="padding: 20px; background: #f8f9fa; border-radius: 15px; cursor: pointer;" onclick="showNotification('Coffee Beans section coming soon!')">
                    <i class="fas fa-coffee" style="font-size: 2rem; color: #8B4513; margin-bottom: 10px;"></i>
                    <h3 style="color: #8B4513;">Coffee Beans</h3>
                    <p style="color: #666;">Premium quality beans</p>
                </div>
                <div style="padding: 20px; background: #f8f9fa; border-radius: 15px; cursor: pointer;" onclick="showNotification('Equipment section coming soon!')">
                    <i class="fas fa-coffee" style="font-size: 2rem; color: #8B4513; margin-bottom: 10px;"></i>
                    <h3 style="color: #8B4513;">Equipment</h3>
                    <p style="color: #666;">Brewing equipment</p>
                </div>
                <div style="padding: 20px; background: #f8f9fa; border-radius: 15px; cursor: pointer;" onclick="showNotification('Merchandise section coming soon!')">
                    <i class="fas fa-tshirt" style="font-size: 2rem; color: #8B4513; margin-bottom: 10px;"></i>
                    <h3 style="color: #8B4513;">Merchandise</h3>
                    <p style="color: #666;">Branded items</p>
                </div>
                <div style="padding: 20px; background: #f8f9fa; border-radius: 15px; cursor: pointer;" onclick="showNotification('Gift Cards section coming soon!')">
                    <i class="fas fa-gift" style="font-size: 2rem; color: #8B4513; margin-bottom: 10px;"></i>
                    <h3 style="color: #8B4513;">Gift Cards</h3>
                    <p style="color: #666;">Perfect gifts</p>
                </div>
            </div>
            <button onclick="this.closest('.modal').remove()" style="
                background: linear-gradient(45deg, #8B4513, #D2691E);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 16px;
            ">Close</button>
        `;

        modal.className = 'modal';
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // About Modal
    function showAboutModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            text-align: center;
        `;

        modalContent.innerHTML = `
            <h2 style="color: #8B4513; margin-bottom: 30px; font-size: 2rem;">About CoffeeCo</h2>
            <div style="text-align: left; line-height: 1.6; color: #666; margin-bottom: 30px;">
                <p style="margin-bottom: 20px;">
                    Welcome to CoffeeCo, where passion meets perfection in every cup. We've been serving the finest coffee 
                    and delicious treats since our founding, creating a warm and inviting atmosphere for coffee lovers everywhere.
                </p>
                <p style="margin-bottom: 20px;">
                    Our commitment to quality starts with sourcing the finest coffee beans from around the world, 
                    carefully roasted to bring out their unique flavors and aromas.
                </p>
                <p style="margin-bottom: 20px;">
                    From our signature blends to our artisanal pastries, every item on our menu is crafted with love 
                    and attention to detail. We believe that great coffee brings people together and creates lasting memories.
                </p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-top: 30px;">
                    <div style="text-align: center;">
                        <i class="fas fa-award" style="font-size: 2rem; color: #8B4513; margin-bottom: 10px;"></i>
                        <h4 style="color: #8B4513;">Quality</h4>
                        <p style="font-size: 14px;">Premium ingredients</p>
                    </div>
                    <div style="text-align: center;">
                        <i class="fas fa-heart" style="font-size: 2rem; color: #8B4513; margin-bottom: 10px;"></i>
                        <h4 style="color: #8B4513;">Passion</h4>
                        <p style="font-size: 14px;">Made with love</p>
                    </div>
                    <div style="text-align: center;">
                        <i class="fas fa-users" style="font-size: 2rem; color: #8B4513; margin-bottom: 10px;"></i>
                        <h4 style="color: #8B4513;">Community</h4>
                        <p style="font-size: 14px;">Bringing people together</p>
                    </div>
                </div>
            </div>
            <button onclick="this.closest('.modal').remove()" style="
                background: linear-gradient(45deg, #8B4513, #D2691E);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 16px;
            ">Close</button>
        `;

        modal.className = 'modal';
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }


    // Favorites functionality
    const favoritesBtn = document.querySelector('.favorites-btn');
    const favoritesCount = document.querySelector('#favoritesCount');

    favoritesBtn.addEventListener('click', function () {
        showFavoritesModal();
    });

    function addToFavorites(productName) {
        if (!favorites.includes(productName)) {
            favorites.push(productName);
            updateFavoritesCount();
            showNotification(`${productName} added to favorites!`);
        } else {
            showNotification(`${productName} is already in favorites!`);
        }
    }

    function removeFromFavorites(productName) {
        favorites = favorites.filter(item => item !== productName);
        updateFavoritesCount();
        showNotification(`${productName} removed from favorites!`);
    }

    function updateFavoritesCount() {
        favoritesCount.textContent = favorites.length;
    }

    function showFavoritesModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            text-align: center;
        `;

        if (favorites.length === 0) {
            modalContent.innerHTML = `
                <h2 style="color: #8B4513; margin-bottom: 20px; font-size: 1.8rem;">Your Favorites</h2>
                <div style="text-align: center; color: #666; margin-bottom: 30px;">
                    <i class="fas fa-heart" style="font-size: 3rem; color: #ddd; margin-bottom: 20px;"></i>
                    <p>No favorites yet! Start adding items you love.</p>
                </div>
                <button onclick="this.closest('.modal').remove()" style="
                    background: linear-gradient(45deg, #8B4513, #D2691E);
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 25px;
                    cursor: pointer;
                ">Close</button>
            `;
        } else {
            modalContent.innerHTML = `
                <h2 style="color: #8B4513; margin-bottom: 20px; font-size: 1.8rem;">Your Favorites</h2>
                <div style="margin-bottom: 20px;">
                    ${favorites.map(item => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 10px; margin-bottom: 10px;">
                            <span style="color: #8B4513; font-weight: bold;">${item}</span>
                            <button onclick="removeFromFavorites('${item}'); this.closest('.modal').remove(); showFavoritesModal();" style="
                                background: #ff4444;
                                color: white;
                                border: none;
                                border-radius: 50%;
                                width: 30px;
                                height: 30px;
                                cursor: pointer;
                            ">×</button>
                        </div>
                    `).join('')}
                </div>
                <button onclick="this.closest('.modal').remove()" style="
                    background: linear-gradient(45deg, #8B4513, #D2691E);
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 25px;
                    cursor: pointer;
                ">Close</button>
            `;
        }

        modal.className = 'modal';
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Notifications functionality
    const notificationsBtn = document.querySelector('.notifications-btn');
    const notificationsCount = document.querySelector('#notificationsCount');

    notificationsBtn.addEventListener('click', function () {
        showNotificationsModal();
    });

    function updateNotificationsCount() {
        const unreadCount = notifications.filter(n => !n.read).length;
        notificationsCount.textContent = unreadCount;
    }

    function showNotificationsModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            text-align: center;
        `;

        modalContent.innerHTML = `
            <h2 style="color: #8B4513; margin-bottom: 20px; font-size: 1.8rem;">Notifications</h2>
            <div style="margin-bottom: 20px;">
                ${notifications.map(notification => `
                    <div style="display: flex; align-items: center; padding: 15px; background: ${notification.read ? '#f8f9fa' : '#fff3cd'}; border-radius: 10px; margin-bottom: 10px; border-left: 4px solid ${notification.read ? '#ddd' : '#D2691E'};">
                        <div style="flex: 1; text-align: left;">
                            <p style="margin: 0; color: #333; font-weight: ${notification.read ? 'normal' : 'bold'};">${notification.message}</p>
                            <small style="color: #666;">${notification.time}</small>
                        </div>
                        ${!notification.read ? '<div style="width: 8px; height: 8px; background: #D2691E; border-radius: 50%; margin-left: 10px;"></div>' : ''}
                    </div>
                `).join('')}
            </div>
            <button onclick="markAllAsRead(); this.closest('.modal').remove();" style="
                background: linear-gradient(45deg, #8B4513, #D2691E);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 25px;
                cursor: pointer;
                margin-right: 10px;
            ">Mark All as Read</button>
            <button onclick="this.closest('.modal').remove()" style="
                background: #666;
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 25px;
                cursor: pointer;
            ">Close</button>
        `;

        modal.className = 'modal';
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    function markAllAsRead() {
        notifications.forEach(notification => {
            notification.read = true;
        });
        updateNotificationsCount();
    }

    // Enhanced order buttons with favorites
    document.querySelectorAll('#order').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const drinkCard = this.closest('.drink');
            const productName = drinkCard.querySelector('#drinkName').textContent;
            const price = drinkCard.querySelector('#drinkPrice').textContent;

            addToCart(productName, price);
        });

        // Add favorite button to each product
        const drinkCard = button.closest('.drink');
        const favoriteBtn = document.createElement('button');
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        favoriteBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
        `;

        favoriteBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const productName = drinkCard.querySelector('#drinkName').textContent;

            if (favorites.includes(productName)) {
                removeFromFavorites(productName);
                this.style.color = '#ddd';
            } else {
                addToFavorites(productName);
                this.style.color = '#ff4444';
            }
        });

        // Check if already in favorites
        const productName = drinkCard.querySelector('#drinkName').textContent;
        if (favorites.includes(productName)) {
            favoriteBtn.style.color = '#ff4444';
        } else {
            favoriteBtn.style.color = '#ddd';
        }

        drinkCard.style.position = 'relative';
        drinkCard.appendChild(favoriteBtn);
    });

    // Initialize counts
    updateFavoritesCount();
    updateNotificationsCount();

    // Make functions globally available
    window.showShopModal = showShopModal;
    window.showAboutModal = showAboutModal;
    window.filterProducts = filterProducts;
    window.addToFavorites = addToFavorites;
    window.removeFromFavorites = removeFromFavorites;
    window.showFavoritesModal = showFavoritesModal;
    window.markAllAsRead = markAllAsRead;

    console.log('CoffeeCo website loaded successfully! ☕');
});
