const order = {
    storeId: '',
    shippingMethod: '',
    orderType: {
        type: '',
        typeName: '',
    },
    currency: '',
    customer: {
        name: '',
        phone: '',
        cpf: '',
    },
    address: {
        street: '',
        number: '',
        comp: '',
        neighborhood: '',
        zipcode: '',
    },
    shipping: {
        type: '',
        price: '',
        table: '',
    },
    products: [
    ],
    orderTotal: {
        total: '',
        finalPrice: '',
        paymentMethod: '',
        change: '',
        coupon: '',
        couponDesc: ''
    }
};

/**
 * Order basic sets and gets
 *
 * (...)
 *
 * @since 1.8
 *
 */
function createOrder(orderData) {

    if( sessionStorage.getItem('mydOrder') == '' || sessionStorage.getItem('mydOrder') == null ) { 

        console.log('order started.');
        sessionStorage.setItem('mydOrder', JSON.stringify(orderData));
    }
}

/**
 * Save order
 * 
 * Save order in sesstionStorage.
 * 
 * @param obj orderData
 */
function saveOrder(orderData) {

    sessionStorage.setItem('mydOrder', JSON.stringify(orderData));
}

/**
 * Add to order
 * 
 * Add products to order. other methods is called in this function.
 */
function addToOrder() {

    // check store time
    if(checkStoreTime() == false) {
        return;
    }

    // get formated product
    let productToCart = getProduct.call(this);

    // get current order
    let currentOrder = getOrder();

    // add product to order
    currentOrder.products = currentOrder.products.concat(productToCart);

    // calculate order total
    currentOrder.orderTotal.total = calculateOrderTotal(currentOrder);
    
    // save new order
    saveOrder(currentOrder);

    // update cart items HTML
    addTemplateToCart(currentOrder);

    // update template price
    updateCountTotal(currentOrder)

    // hide popup
    document.getElementById('popup-' + this.id).style.display = 'none';

    // uncheck options
    document.querySelectorAll('input[type="checkbox"]').forEach(item => item.checked = false);

    // show bar notification
    noticiationBar('sucess', document.getElementById('myd-template-add-cart').innerText);
}

/**
 * Caclculate order total
 * 
 * Calculate order total from order obj.
 * 
 * @param object currentOrder
 */
function calculateOrderTotal(order) {

    // map and get products total
    let productTotals = order.products.map(items => items.productPriceTotal);

    // sum all extra prices
    productTotals = productTotals.reduce(sumPrices, 0);

    return productTotals;
}

/**
 * Add product to order
 * 
 * Use to get procut data and add to order.
 */
function getProduct() {

    let productToCart = [];

    // product data
    let id = this.id;
    let name = this.dataset.name;
    let price = this.dataset.price;
    let qty = document.querySelector('#popup-' + id + ' .fmd-item-qty').value
    let note = document.querySelector('#popup-' + id + ' .fdm-text-product-note').value
    let image = this.dataset.image;

    // selected extras
    let selectedExtras = document.querySelectorAll('#popup-' + id + ' .option_prod_exta:checked')

    // product item obj
    let productItem = {
        productName: name,
        productPrice: price,
        productImage: image,
        productPriceTotal: '',
        productQty: qty,
        productNote: note,
        extras: '',
    };
    
    // get product extras
    productItem.extras = getProductExtra(selectedExtras);

    // add product price total to obj
    productItem.productPriceTotal = calculateProductPrice(productItem);

    // add product item to product array
    productToCart.push(productItem);
    return productToCart;
}

/**
 * Get product extra
 * 
 * Get and build obj with product extras.
 * 
 * @param object selectedExtras
 */
function getProductExtra(selectedExtras) {

    if( selectedExtras.length > 0 ) {

        let extraItems = [];
        selectedExtras.forEach( item => {

            let extra = {
                extraType: item.dataset.type,
                extraOptions: [],
            };
            
            if(!extraItems.map(item => item.extraType).includes(item.dataset.type)) {
                extraItems.push(extra);
            }
        });

        getProductExtraOptions(selectedExtras, extraItems);
        return extraItems;
    }
}

/**
 * Get product extra options
 * 
 * Use to get and set extra options in parent extra type.
 * 
 * @param object selectedExtras extraItems
 */
function getProductExtraOptions(selectedExtras, extraItems) {

    selectedExtras.forEach( item => {

        let key = extraItems.map(item => item.extraType).indexOf(item.dataset.type);
        let extraOption = {
            extraOptionName: item.dataset.name,
            extraOptionPrice: item.dataset.price,
        };

        extraItems[key].extraOptions.push(extraOption);
    });

    return extraItems;
}

/**
 * Calculate product price
 * 
 * Calculate product total
 * 
 * @param object productItem
 */
function calculateProductPrice(productItem) {

    if(productItem.extras != undefined) {

        // map ang get extra prices
        let extra = productItem.extras.map(items => items.extraOptions.map(item => item.extraOptionPrice) );

        // reduce prices to simples array
        extra = extra.flat();

        // sum all extra prices
        extra = extra.reduce(sumPrices, 0);

        // sum extra prices to product price
        extra += parseInt(productItem.productPrice.replace(/[.,]/g, ''));

        // multip price per product qty
        extra = extra * parseInt(productItem.productQty.replace(/[.,]/g, ''));

        return `${extra}`;
    }

    // multip price per product qty
    singlePrice = parseInt(productItem.productPrice.replace(/[.,]/g, '')) * parseInt(productItem.productQty.replace(/[.,]/g, ''));

    return `${singlePrice}`;
    
}

/**
 * Format price
 * 
 * Use to format price with user options.
 * 
 * @param string|int price
 * @param int numberDecimal
 * @param string decimalSeparator
 */
function formatPrice( price, numberDecimal, decimalSeparator ) {

    if( price == 0 ) {
        return 0;
    }

    number = `${price}`;
    let decimal = number.slice(- + numberDecimal);
    let resto = number.slice(0, - + numberDecimal);

    let middle = parseInt(numberDecimal) + 3;

    let millar = number.slice(0, - + middle);
    if( millar != '' ) { 
        let middle2 = number.slice(- + middle, - + numberDecimal);
        return millar + '.' + middle2 + decimalSeparator + decimal;
    }
    
    return resto + decimalSeparator + decimal;
}

/**
 * Sum prices
 * 
 * Sum array prices
 * 
 * @param array 
 */
function sumPrices(accumulator, currentValue) {

    return parseInt(accumulator) + parseInt(currentValue.replace(/[.,]/g, ''));

}

/**
 * Add items to cart
 * 
 * Add item from array to cart with HTML template.
 * 
 * @param obj orderData
 */
function addTemplateToCart(orderData) {

    let template = document.getElementById('myd-template-product-item').innerText;
    let cart = document.querySelector('.myd-cart__products');
    let cartConfirm = document.querySelector('.myd-cart__confirm-items');

    //remove current items
    document.querySelectorAll('.myd-cart__products-item').forEach(item => item.remove());

    orderData.products.forEach( (item, index) => {
        
        // replace produts info
        let templateItem = template.replace(/`{qty}`/g, item.productQty);
        templateItem = templateItem.replace(/`{name}`/g, item.productName);
        templateItem = templateItem.replace(/`{image}`/g, item.productImage);
        templateItem = templateItem.replace(/`{currency}`/g, orderData.currency);
        templateItem = templateItem.replace(/`{price}`/g, formatPrice(item.productPriceTotal, 2, ','));

        // if have extras
        if( item.extras != undefined ) {
            templateItem = templateItem.replace(/`{extras}`/g, addTemplateExtras(item.extras).join(''));
        }
        else {
            templateItem = templateItem.replace(/`{extras}`/g, '');
        }

        templateItem = templateItem.replace(/`{index}`/g, index);

        // add template item to cart
        cart.insertAdjacentHTML('beforeend', templateItem);
        cartConfirm.insertAdjacentHTML('beforeend', templateItem);
        delete templateItem;
    });
}

/**
 * Add items to cart
 * 
 * Add item from array to cart with HTML template.
 * 
 * @param obj productExtras
 */
function addTemplateExtras(productExtras) {

    let templateExtra = document.getElementById('myd-template-product-item-extra').innerText;
    let templateExtraName = document.getElementById('myd-template-product-item-extra-name').innerText;
    let items = [];
    let extras = [];

    productExtras.forEach( itemExtra => {

        // replace produts info
        let templateItemExtra = templateExtra.replace(/`{extraType}`/g, itemExtra.extraType);

        // get extra options for extra type
        extras = itemExtra.extraOptions.map(items => templateExtraName.replace(/`{extraItemName}`/g, items.extraOptionName));

        // reduce array
        extras = extras.flat();

        // add estra options to template
        templateItemExtra = templateItemExtra.replace(/`{extraName}`/g, extras.join(''));

        // add extra template to array for print
        items.push(templateItemExtra);
        delete templateItemExtra;
    });

    return items;
}

/**
 * Remove item
 * 
 * Remove order/cart item.
 * 
 * @param int index
 */
function removeItem(index) {

    // get current order
    let currentOrder = getOrder();

    // add product to order
    currentOrder.products.splice(index,1);

    // calculate order total
    currentOrder.orderTotal.total = calculateOrderTotal(currentOrder);
    
    // save new order
    saveOrder(currentOrder);

    // update cart items HTML
    addTemplateToCart(currentOrder);

    // update template price
    updateCountTotal(currentOrder);

    // show bar notification
    noticiationBar('error', document.getElementById('myd-template-removed-from-cart').innerText);
}

/**
 * Notification bar
 * 
 * Show notification bar
 * 
 * @param string type, message
 */
function noticiationBar(type, message) {

    let template = document.getElementById('myd-popup-notification');
    template.querySelector('.myd-popup-notification__message').innerHTML = message;
    if(type == 'sucess') {

        template.style.background = '#35a575';
    }
    if(type == 'error') {

        template.style.background = '#cb2027';
    }
    
    template.style.opacity = '1';
    template.style.visibility = 'visible';
    
    setTimeout(function(){ 

        template.style.opacity = '0';
        template.style.visibility = 'hidden';
    }, 3000);
}

/**
 * Update cart count an total
 * 
 * Update cart and count total on template.
 * 
 * @param obj orderData
 */
function updateCountTotal(orderData) {

    if(orderData.orderTotal.total == '' || orderData.orderTotal.total == 0) {

        document.getElementById('myd-float__price').innerText = orderData.currency;
        document.getElementById('myd-float__qty').innerText = '0';
    }
    else {

        document.getElementById('myd-float__price').innerText = orderData.currency + ' ' + formatPrice(orderData.orderTotal.total, 2, ',');
        document.getElementById('myd-float__qty').innerText = orderData.products.length;
    }
}

/**
 * Validate inputs checkout
 * 
 * Check if all required inputs its not empy
 * 
 * @param obj orderData
 */
function validateInputs() {

    let iputs = document.querySelectorAll('.myd-cart__checkout input, .myd-cart__checkout select');
    for (let i = 0; i < iputs.length; i++) {
        
        if(iputs[i].hasAttribute('required') && iputs[i].value == '') {

            noticiationBar('error', document.getElementById('myd-template-fiel-required').innerText);
            iputs[i].focus();
            return false;
        }
    }
    delete iputs;
}

/**
 * Check Store time
 * 
 * Check store open and close time.
 * 
 * @param obj orderData
 */
function checkStoreTime() {

    let start = document.getElementById('myd-template-start-time').innerText;
    let close = document.getElementById('myd-template-close-time').innerText;
    let currentTime = new Date().toLocaleTimeString();

    start = Date.parse('01/01/2011 ' + start + ':00');
    close = Date.parse('01/01/2011 ' + close + ':00');
    currentTime = Date.parse('01/01/2011 ' + currentTime);

    if(currentTime < start || currentTime > close) {

        noticiationBar('error', document.getElementById('myd-template-message-store-closed').innerText);
        return false;
    }
}

/**
 * Update order in checkout
 * 
 * Update order in checkout after click to confirm page.
 * 
 * @param obj newData
 */
function updateOrderChekout(newData) {

    let currentOrder = getOrder();

    currentOrder.customer.name = newData.name;
    currentOrder.customer.phone = newData.phone;
    currentOrder.orderTotal.paymentMethod = newData.payment;
    currentOrder.orderTotal.change = newData.change;
    currentOrder.orderTotal.coupon = newData.coupon;
    currentOrder.orderType.type = newData.orderType;
    currentOrder.orderType.typeName = newData.orderTypeName;

    currentOrder.address.street = newData.address;
    currentOrder.address.number = newData.number;
    currentOrder.address.comp = newData.apartment;
    currentOrder.address.neighborhood = newData.neig;
    currentOrder.address.zipcode = newData.zipcode;
    currentOrder.shipping.table = newData.table;
    currentOrder.shipping.price = newData.shippingPrice;
    currentOrder.orderTotal.finalPrice = parseInt(currentOrder.orderTotal.total) + parseInt(currentOrder.shipping.price);

    saveOrder(currentOrder);
}

/**
 * Validate shipping area (Zipcode)
 * 
 * Validate shipping area with zipcode.
 * 
 * @param obj newData
 */
function validateZipcodeShipping(orderType) {
    
    if( orderType != 'delivery') {
        return;
    }
    
    let currentOrder = getOrder();
    let type = currentOrder.shippingMethod;
    
    if(type == 'per_zipcode' || type == 'unique-zipcode') {

        let zipcodeList = document.getElementById('myd-cart__zipcode-obj').innerText;
        let zipcodeValue = parseInt(document.getElementById('input-delivery-zipcode').value);
        let zipcode = JSON.parse(zipcodeList);

        let val = [];
        zipcode.map( item => {
            
            if(zipcodeValue >= item.from && zipcodeValue <= item.to) {
                console.log('existent zipcode area');
                val.push(item.price);
            }
        });

        if( val.length <= 0) {
            noticiationBar('error', document.getElementById('myd-template-shipping-area-error').innerText);
            return false;
        }
    }
}

/**
 * Calculate Coupn
 * 
 * Calculate coupon discount.
 * 
 * @param obj newData
 */
function calculateCoupon() {

    let couponValue = document.getElementById('input-coupon').value;
    const currentOrder = getOrder();

    if(couponValue == '') {

        currentOrder.orderTotal.couponDesc = '';
        currentOrder.orderTotal.coupon = '';
        saveOrder(currentOrder);
        return;
    }

    let couponList = document.getElementById('myd-cart__coupons-obj').innerText;
    let coupon = JSON.parse(couponList);
    let price = '';
    let orderType = currentOrder.orderType.type;

    let selectedIndex = '';
    coupon.map( (item, index) => {

        if(item.name == couponValue) {
            selectedIndex = index;
        }
    });

    if(selectedIndex.length == 0) {

        noticiationBar('error', document.getElementById('myd-template-invalid-coupon').innerText);
        currentOrder.orderTotal.couponDesc = '';
        currentOrder.orderTotal.coupon = '';
        saveOrder(currentOrder);
        return;
    }

    if(selectedIndex != undefined) {
        
        if(coupon[selectedIndex].type == 'discount-total') {

            if(coupon[selectedIndex].format == 'amount') {

                price = parseInt(currentOrder.orderTotal.finalPrice) - parseInt(coupon[selectedIndex].value.replace(/[.,]/g, ''));
                currentOrder.orderTotal.finalPrice = price;
                currentOrder.orderTotal.couponDesc = '-' + formatPrice(coupon[selectedIndex].value.replace(/[.,]/g, ''), 2, ',') + ' total'
                saveOrder(currentOrder);
                return;
            }
            if(coupon[selectedIndex].format == 'percent') {

                price = parseInt(currentOrder.orderTotal.finalPrice) - parseInt(currentOrder.orderTotal.finalPrice) * parseInt(coupon[selectedIndex].value) / 100;
                currentOrder.orderTotal.finalPrice = price;
                currentOrder.orderTotal.couponDesc = '-' + parseInt(coupon[selectedIndex].value) + '% delivery'
                saveOrder(currentOrder);
                return;
            }
        }

        if(coupon[selectedIndex].type == 'discount-delivery' && orderType == 'delivery') {

            if(coupon[selectedIndex].format == 'amount') {

                price = parseInt(currentOrder.shipping.price) - parseInt(coupon[selectedIndex].value.replace(/[.,]/g, ''));
                currentOrder.shipping.price = price;
                currentOrder.orderTotal.finalPrice = parseInt(currentOrder.orderTotal.total) + parseInt(currentOrder.shipping.price);
                currentOrder.orderTotal.couponDesc = '-' + formatPrice(coupon[selectedIndex].value.replace(/[.,]/g, ''), 2, ',') + ' total'
                saveOrder(currentOrder);
                return;
            }
            if(coupon[selectedIndex].format == 'percent') {
                
                price = parseInt(currentOrder.shipping.price) - parseInt(currentOrder.shipping.price) * parseInt(coupon[selectedIndex].value) / 100;
                currentOrder.shipping.price = price;
                currentOrder.orderTotal.finalPrice = parseInt(currentOrder.orderTotal.total) + parseInt(currentOrder.shipping.price);
                currentOrder.orderTotal.couponDesc = '-' + parseInt(coupon[selectedIndex].value) + '% delivery'
                saveOrder(currentOrder);
                return;
            }
            
        }
    }
}

/**
 * Calculate shipping
 * 
 * Calculate shipping if delivery is selected.
 * 
 * @param obj newData
 */
function calculateShipping() {

    let currentOrder = getOrder();
    let type = currentOrder.shippingMethod;

    if(type == 'per_neighborhood' || type == 'unique-neighborhood') {

        neig = document.getElementById('input-delivery-neighborhood');
        return neig.options[neig.selectedIndex].dataset.price.replace(/[.,]/g, '');
    }

    if(type == 'per_zipcode' || type == 'unique-zipcode') {

        let zipcodeList = document.getElementById('myd-cart__zipcode-obj').innerText;
        let zipcodeValue = parseInt(document.getElementById('input-delivery-zipcode').value);
        let zipcode = JSON.parse(zipcodeList);

        let val = [];
        zipcode.map( item => {
            
            if(zipcodeValue >= item.from && zipcodeValue <= item.to) {
                console.log('delivery price founded');
                val.push(item.price);
                return;
            }
        });

        return val[0].replace(/[.,]/g, '');
    }
}

/**
 * Process checkout fields
 * 
 * Process check fields after click to go confirm page.
 * 
 * @param obj newData
 */
function processCheckout(orderType, orderTypeName) {

    // new data for update in order
    let newData = {
        name: document.getElementById('input-customer-name').value,
        phone: document.getElementById('input-customer-phone').value,
        payment: document.getElementById('input-payment').value,
        change: document.getElementById('input-payment-change').value,
        coupon: document.getElementById('input-coupon').value,
        orderType: orderType,
        orderTypeName: orderTypeName,
        address: '',
        number: '',
        apartment: '',
        neig: '',
        zipcode: '',
        table: '',
        shippingPrice: 0
    };

    // populate new data object
    if (orderType == 'delivery') {

        // show delivery info tab confirm
        document.getElementById('confirm-delivery').classList.remove('myd-hide-element');

        newData.address = document.getElementById('input-delivery-street-name').value;
        
        let number = document.getElementById('input-delivery-address-number');
        if(number != undefined) {
            newData.number = number.value;
        }

        newData.apartment = document.getElementById('input-delivery-comp').value;
        
        let neig = document.getElementById('input-delivery-neighborhood');
        if(neig != undefined) {
            newData.neig = neig.value;
        }
        
        let zipcode = document.getElementById('input-delivery-zipcode');
        if(zipcode != undefined) {
            newData.zipcode = zipcode.value;
        }

        newData.table = '';

        // calculate shipping
        newData.shippingPrice = calculateShipping();
        updateOrderChekout(newData);
    }

    // populate new data object
    if (orderType == 'take-away') {

        // hide delivery info tab confirm
        document.getElementById('confirm-delivery').classList.add('myd-hide-element');

        newData.address = '';
        newData.number = '';
        newData.apartment = '';
        newData.neig = '';
        newData.zipcode = '';
        newData.table = '';

        updateOrderChekout(newData);
    }

    // populate new data object
    if (orderType == 'order-in-store') {

        // hide delivery info tab confirm
        document.getElementById('confirm-delivery').classList.add('myd-hide-element');

        newData.address = '';
        newData.number = '';
        newData.apartment = '';
        newData.neig = '';
        newData.zipcode = '';
        newData.table = document.getElementById('input-in-store-table').value;

        updateOrderChekout(newData);
    }
}

/**
 * Populate confirm page
 * 
 * Populate confirm page.
 * 
 * @param obj newData
 */
function processConfirmPage() {

    let order = getOrder();

    let deliveryBlock = document.getElementById('confirm-delivery');
    let orderTable = document.getElementById('row-confirm-table');

    let number = document.getElementById('input-delivery-address-number');
    let zipcode = document.getElementById('input-delivery-zipcode');
    let neig = document.getElementById('input-delivery-neighborhood');

    if(number == undefined || number == null) {
        document.getElementById('confirm-delivery-zipcode').classList.add('myd-hide-element');
        document.getElementById('confirm-delivery-zipcode-label').classList.add('myd-hide-element');
    }

    if(zipcode == undefined) {
        document.getElementById('confirm-delivery-number').classList.add('myd-hide-element');
        document.getElementById('confirm-delivery-number-label').classList.add('myd-hide-element');
    }

    if(neig == undefined) {
        document.getElementById('confirm-delivery-neighborhood').classList.add('myd-hide-element');
        document.getElementById('confirm-delivery-neighborhood-label').classList.add('myd-hide-element');
    }

    if(order.orderTotal.couponDesc != undefined || order.orderTotal.couponDesc.length != 0) {

        document.getElementById('confirm-resume-coupon-price').innerText = order.orderTotal.couponDesc;
    }

    document.getElementById('confirm-order-type-name').innerText = order.orderType.typeName;
    document.getElementById('confirm-resume-customer').innerText = order.customer.name;
    document.getElementById('confirm-resume-customer-phone').innerText = order.customer.phone;
    document.getElementById('confirm-payment-method').innerText = order.orderTotal.paymentMethod;
    document.getElementById('confirm-payment-change-for').innerText = order.orderTotal.change;
    document.getElementById('confirm-resume-subtotal-price').innerText = order.currency + ' ' + formatPrice(order.orderTotal.total, 2, ',');
    document.getElementById('confirm-resume-delivery-price').innerText = order.currency + ' ' + formatPrice(order.shipping.price, 2, ',');
    document.getElementById('confirm-resume-total-price').innerText = order.currency + ' ' + formatPrice(order.orderTotal.finalPrice, 2, ',');

    if(order.orderTotal.paymentMethod != 'Cash') {

        document.getElementById('row-confirm-change').classList.add('myd-hide-element');
    }

    if (order.orderType.type == 'delivery') {
    
        deliveryBlock.classList.remove('myd-hide-element');
        orderTable.classList.add('myd-hide-element');

        document.getElementById('confirm-delivery-street').innerText = order.address.street;
        document.getElementById('confirm-delivery-number').innerText = order.address.number;
        document.getElementById('confirm-delivery-apartment').innerText = order.address.comp;
        document.getElementById('confirm-delivery-neighborhood').innerText = order.address.neighborhood;
        document.getElementById('confirm-delivery-zipcode').innerText = order.address.zipcode;
    }

    if (order.orderType.type == 'take-away') {

        deliveryBlock.classList.add('myd-hide-element');
        orderTable.classList.add('myd-hide-element');
    }

    if (order.orderType.type == 'order-in-store') {

        deliveryBlock.classList.add('myd-hide-element');
        orderTable.classList.remove('myd-hide-element');

        document.getElementById('confirm-order-table-number').innerText = order.shipping.table;
    }
}

/**
 * Ajax to create order
 * 
 * Call ajax to create order
 */
function finishOrder(currentTab) {

    let orderLoading = document.getElementById('myd-template-order-loading').innerText;
    document.querySelector('.myd-cart__button-text').innerHTML = orderLoading;

    let data = JSON.stringify(getOrder());

    const createOrder = fetch( ajax_object.ajax_url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
        },
        body: 'action=myd_create_order&data=' + data + '&sec=' + ajax_object.order_nonce,
    }).then( response => {
        if(response.ok) {

            console.log('Request sucess');
            response.json().then(data => {

                const orderId = document.getElementById('finished-order-number');
                const whatsLink = document.querySelector('.myd-cart__finished-whatsapp > a');
                const trackOrder = document.querySelector('.myd-cart__finished-track-order > a');
                orderId.innerText = data.order_id;
                whatsLink.href = data.link;
                trackOrder.href = data.trackLink;

                // clear current order
                clearOrder();

                // remove active tab
                currentTab.classList.remove('myd-cart__nav--active');
                document.querySelector('.' + currentTab.dataset.tabContent).classList.remove('myd-cart__content--active');

                // set active tab
                let next = document.querySelector('.' + currentTab.dataset.next)
                next.classList.add('myd-cart__content--active');
                document.querySelector('.myd-cart__button').style.display = 'none';
            });
        }
        else {

            console.log('Network response was not ok.');
        }
    })
    .catch(function(error) {
        
        console.log('Problem with your fetch request: ' + error.message);
    });
}

// Clear order
function clearOrder() {
    
    sessionStorage.setItem('mydOrder', '');
}

// Get order saved
function getOrder() {

    let orderData = sessionStorage.getItem('mydOrder');

    if( orderData == '' ) {
        console.log('order empty.');
        return false;
    }

    return JSON.parse(orderData);
}

// check if order products empy
function checkOrderProductsEmpty () {

    const order = getOrder();
    if( order.products.length == 0 ) {

        return false;
    }
    
    return true;
}

// Set store with id, currency and shipping method
function setStore() {

    let orderData = getOrder();

    // Check if orderData is empty
    if( orderData ) {

        setStoreId(orderData);
        setCurrency(orderData);
        setShippingMethod(orderData);

        // save order JSON
        saveOrder(orderData);
    }
}

/**
 * Get items methods
 *
 * (...)
 *
 * @since 1.8
 */

// Set store id if not exist in order
function setStoreId(orderData) {

    if( orderData.storeId == '' ) {

        let store = document.getElementById('myd-order-data-store-id').value;
        
        if( store == 'multi-store' ) {
            // define multi store function
        }
        else {
            orderData.storeId = document.getElementById('myd-order-data-store-id').value;
        }
    }
}

// Set store currency not exist in order 
function setCurrency(orderData) {

    if( orderData.currency == '' ) {

        orderData.currency = document.getElementById('myd-order-data-currency').value;
    }
}

// Set store shipping method not exist in order
function setShippingMethod(orderData) {

    if( orderData.shippingMethod == '' ) {

        orderData.shippingMethod = document.getElementById('myd-order-data-shipping').value;
    }
}