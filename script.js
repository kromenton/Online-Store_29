document.addEventListener('DOMContentLoaded', () => {
    const categories = document.getElementById('categories');
    const products = document.getElementById('products');
    const productInfo = document.getElementById('product-info');
    const orderForm = document.getElementById('order-form');
    const middle = document.querySelector('.middle');
    const left = document.querySelector('.left');
    const right = document.querySelector('.right');
    const ordersButton = document.getElementById('my-orders-button');
    const ordersDiv = document.getElementById('orders');
    const ordersList = document.getElementById('orders-list');

    categories.addEventListener('click', event => {
        if (event.target.tagName === 'LI') {
            const category = event.target.getAttribute('data-category');
            showProducts(category);
            middle.style.display = 'block'; // Отображение секции .middle
            ordersDiv.style.display = 'none'; // Скрытие списка заказов
            left.style.display = 'block'; // Отображение секции .left
            right.style.display = 'block'; // Отображение секции .right
        }
    });

    products.addEventListener('click', event => {
        if (event.target.tagName === 'LI') {
            const productName = event.target.getAttribute('data-name');
            const productPrice = event.target.getAttribute('data-price');
            const productDescription = event.target.getAttribute('data-description');
            showProductInfo(productName, productPrice, productDescription);
        }
    });

    orderForm.addEventListener('submit', event => {
        event.preventDefault();
        const orderDetails = {
            fullname: document.getElementById('fullname').value,
            city: document.getElementById('city').value,
            deliveryAddress: document.getElementById('delivery-address').value,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            quantity: document.getElementById('quantity').value,
            comment: document.getElementById('comment').value,
            productName: productInfo.querySelector('h2').textContent,
            productPrice: parseFloat(productInfo.querySelector('p:nth-of-type(1)').textContent.replace('Price: ', '')),
            date: new Date().toLocaleString()
        };

        if (validateOrderDetails(orderDetails)) {
            saveOrder(orderDetails);
            showOrderDetails(orderDetails);
            orderForm.style.display = 'none';
            middle.style.display = 'none';
        } else {
            alert('Please fill in all required fields.');
        }
    });

    ordersButton.addEventListener('click', () => {
        showOrders();
    });

    function showProducts(category) {
        const productsList = getProductsByCategory(category);
        products.innerHTML = '';
        productsList.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.name}`;
            li.setAttribute('data-name', product.name);
            li.setAttribute('data-price', product.price);
            li.setAttribute('data-description', product.description);
            products.appendChild(li);
        });
    }

    function showProductInfo(name, price, description) {
        productInfo.innerHTML = `<h2>${name}</h2>
                                 <p>Price: ${price}</p>
                                 <p>Description: ${description}</p>
                                 <button id="buy-button">Buy</button>`;
        document.getElementById('buy-button').addEventListener('click', () => {
            orderForm.style.display = 'block';
        });
    }

    function showOrderDetails(orderDetails) {
        const productName = orderDetails.productName;
        const productPrice = orderDetails.productPrice;
        const quantity = parseInt(orderDetails.quantity);
        const totalPrice = productPrice * quantity;

        productInfo.innerHTML = `<h2>Order Details</h2>
                                 <p>Product: ${productName}</p>
                                 <p>Price per unit: ${productPrice}</p>
                                 <p>Total Price: ${totalPrice}</p>
                                 <p>Quantity: ${quantity}</p>
                                 <p>Full Name: ${orderDetails.fullname}</p>
                                 <p>City: ${orderDetails.city}</p>
                                 <p>Delivery Address: ${orderDetails.deliveryAddress}</p>
                                 <p>Payment Method: ${orderDetails.paymentMethod}</p>
                                 <p>Comment: ${orderDetails.comment}</p>`;

        // Очистка полей формы
        document.getElementById('fullname').value = '';
        document.getElementById('city').value = '';
        document.getElementById('delivery-address').value = '';
        document.querySelector('input[name="payment"]:checked').checked = false;
        document.getElementById('quantity').value = '';
        document.getElementById('comment').value = '';
    }

    function validateOrderDetails(details) {
        return details.fullname && details.city && details.deliveryAddress && details.paymentMethod && details.quantity > 0;
    }

    function getProductsByCategory(category) {
        const products = [
            { name: 'Phone', price: 100, category: 'electronics', description: 'Modern smartphone.' },
            { name: 'Computer', price: 500, category: 'electronics', description: 'Powerful computer.' },
            { name: 'Headphones', price: 50, category: 'electronics', description: 'Quality headphones.' },
            { name: 'T-shirt', price: 20, category: 'clothing', description: 'Classic t-shirt.' },
            { name: 'Jeans', price: 30, category: 'clothing', description: 'Stylish jeans.' },
            { name: 'Jacket', price: 70, category: 'clothing', description: 'Warm jacket.' },
            { name: 'Book', price: 15, category: 'books', description: 'Exciting book.' },
            { name: 'Magazine', price: 5, category: 'books', description: 'Popular magazine.' },
            { name: 'Audiobook', price: 25, category: 'books', description: 'Captivating audiobook.' }
        ];

        return products.filter(product => product.category === category).slice(0, 3);
    }

    function saveOrder(orderDetails) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderDetails);
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    function showOrders() {
        left.style.display = 'none';
        middle.style.display = 'none';
        right.style.display = 'none';
        ordersDiv.style.display = 'block';

        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        ordersList.innerHTML = '';

        orders.forEach((order, index) => {
            const li = document.createElement('li');
            li.textContent = `Date: ${order.date}, Total Price: ${order.productPrice * order.quantity}`;
            li.addEventListener('click', () => {
                showOrderDetails(order);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                deleteOrder(index);
                showOrders();
            });

            li.appendChild(deleteButton);
            ordersList.appendChild(li);
        });
    }

    function deleteOrder(index) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.splice(index, 1);
        localStorage.setItem('orders', JSON.stringify(orders));
    }
});
