// Used when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {

    if(document.querySelector('.myd-product-list') == undefined) {
        return;
    }

    // update cart and price total
    updateCountTotal(getOrder());

    // open cart
    const cartFloat = document.querySelector('.myd-float');
    cartFloat.addEventListener('click', openCart );
     
    // hide checkout when click in close button
    const cartClose = document.querySelector('.myd-cart__nav-close');
    cartClose.addEventListener('click', closeCart );

    // change tab when click in back button
    const cartBack = document.querySelector('.myd-cart__nav-back');
    cartBack.addEventListener('click', backTab );

    // Open/Close product details (confirm tab)
    const productsConfirmTab = document.querySelector('.myd-cart__confirm-products-title');
    productsConfirmTab.addEventListener('click', () => { 
        document.querySelector('.myd-cart__confirm-items').classList.toggle('myd-content-active');
    });

    const confirmDelivery = document.getElementById('confirm-delivery-title');
    confirmDelivery.addEventListener('click', () => { 
        document.querySelector('.myd-cart__confirm-delivery-wrapper').classList.toggle('confirm-delivery-wrapper--active');
    });

    // Options checkout type
    const options = document.querySelectorAll('.myd-cart__checkout-option');
    if(options.length == 1 || options.length == 2) {
        options[0].classList.add('myd-cart__checkout-option--active');
        setOptionTab(options[0]);
    }
    
    options.forEach(changeOptionTab);

    // Button "next" in cart
    const btnCheckoutNext = document.querySelector('.myd-cart__button');
    btnCheckoutNext.addEventListener( 'click', nextTab );

    // Button add to card
    const btnAddToCart = document.querySelectorAll('.fdm-add-to-cart-popup');
    btnAddToCart.forEach( item => {
        item.addEventListener('click', addToOrder)
    });

    // Action clicked to remove product cart/order
    let cart = document.querySelector('.myd-cart__products');
    cart.addEventListener('click', e => {
        if(e.target.parentElement.matches('.myd-cart__products-action')) {
            removeItem(e.target.parentElement.dataset.productIndex);
        }
    });

    // EXAMPLE
    console.log(checkOrderProductsEmpty());

    // show change input
    const paymentSelect = document.getElementById('input-payment');
    paymentSelect.addEventListener('change', showChange);
});

// change option tab/content
function changeOptionTab (item) {

    item.addEventListener('click', () => {

        let zipcode = document.getElementById('input-delivery-zipcode');
        let street = document.getElementById('input-delivery-street-name');
        let number = document.getElementById('input-delivery-address-number');
        let neig = document.getElementById('input-delivery-neighborhood');
        let table = document.getElementById('input-in-store-table');
        
        if(item.dataset.type == 'delivery') {

            street.setAttribute('required', 'required');
            table.removeAttribute('required', 'required');

            if(number != undefined) {
                number.setAttribute('required', 'required');
            }

            if(neig != undefined) {
                neig.setAttribute('required', 'required');
            }

            if(zipcode != undefined) {
                zipcode.setAttribute('required', 'required');
            }
        }

        if(item.dataset.type == 'take-away') {

            street.removeAttribute('required', 'required');
            table.removeAttribute('required', 'required');

            if(zipcode != undefined) {
                zipcode.removeAttribute('required', 'required');
            }

            if(number != undefined) {
                number.removeAttribute('required', 'required');
            }

            if(neig != undefined) {
                neig.removeAttribute('required', 'required');
            }
        }

        if(item.dataset.type == 'order-in-store') {

            street.removeAttribute('required', 'required');
            table.setAttribute('required', 'required');

            if(zipcode != undefined) {
                zipcode.removeAttribute('required', 'required');
            }

            if(number != undefined) {
                number.removeAttribute('required', 'required');
            }
            
            if(neig != undefined) {
                neig.removeAttribute('required', 'required');
            }
        }

        document.querySelector('.myd-cart__checkout-option--active').classList.remove('myd-cart__checkout-option--active');
        item.classList.add('myd-cart__checkout-option--active');

        const fieldsActive = document.querySelectorAll('.myd-cart__checkout-field-group--active');
        fieldsActive.forEach( (item) => {
            item.classList.remove('myd-cart__checkout-field-group--active');
        } );

        const fieldsToActive = document.querySelectorAll( item.dataset.content );
        fieldsToActive.forEach( (item) => {
            item.classList.add('myd-cart__checkout-field-group--active');
        } );
    } );
}

// set option tab/content
function setOptionTab(option) {

    let zipcode = document.getElementById('input-delivery-zipcode');
    let street = document.getElementById('input-delivery-street-name');
    let number = document.getElementById('input-delivery-address-number');
    let comp = document.getElementById('input-delivery-comp');
    let neig = document.getElementById('input-delivery-neighborhood');
    let table = document.getElementById('input-in-store-table');

    if (option.dataset.type == 'delivery') {

        street.setAttribute('required', 'required');
        table.removeAttribute('required', 'required');

        if (number != undefined) {
            number.setAttribute('required', 'required');
        }

        if (neig != undefined) {
            neig.setAttribute('required', 'required');
        }

        if (zipcode != undefined) {
            zipcode.setAttribute('required', 'required');
        }
    }

    if (option.dataset.type == 'take-away') {

        street.removeAttribute('required', 'required');
        table.removeAttribute('required', 'required');

        if (zipcode != undefined) {
            zipcode.removeAttribute('required', 'required');
        }

        if (number != undefined) {
            number.removeAttribute('required', 'required');
        }

        if (neig != undefined) {
            neig.removeAttribute('required', 'required');
        }
    }

    if (option.dataset.type == 'order-in-store') {

        street.removeAttribute('required', 'required');
        table.setAttribute('required', 'required');

        if (zipcode != undefined) {
            zipcode.removeAttribute('required', 'required');
        }

        if (number != undefined) {
            number.removeAttribute('required', 'required');
        }

        if (neig != undefined) {
            neig.removeAttribute('required', 'required');
        }
    }

    const fieldsActive = document.querySelectorAll('.myd-cart__checkout-field-group--active');
    fieldsActive.forEach(item => {
        item.classList.remove('myd-cart__checkout-field-group--active');
    });

    const fieldsToActive = document.querySelectorAll(option.dataset.content);
    fieldsToActive.forEach(item => {
        item.classList.add('myd-cart__checkout-field-group--active');
    });
}

/**
 * Open cart
 * 
 * Open cart template.
 */
function openCart() {

    // reset active tab
    document.querySelector('.myd-cart__nav--active').classList.remove('myd-cart__nav--active');
    document.querySelector('.myd-cart__content--active').classList.remove('myd-cart__content--active');

    // set default tab
    document.querySelector('.myd-cart__nav-bag').classList.add('myd-cart__nav--active');

    // check id order exist
    if( checkOrderProductsEmpty() ) {

        // update cart items HTML
        addTemplateToCart(getOrder());

        // add class to show cart items content
        document.querySelector('.myd-cart__products').classList.add('myd-cart__content--active');
    }
    else {

        // set empty content
        document.querySelector('.myd-cart__products-empty').classList.add('myd-cart__content--active');
    }

    // open cart
    const checkOutOpen = document.querySelector('.myd-checkout');
    checkOutOpen.classList.toggle('myd-checkout--open');
    document.body.classList.toggle('myd-cart-open');
}

/**
 * Close cart
 * 
 * Close cart template.
 */
function closeCart() {

    const checkOutClose = document.querySelector('.myd-checkout');
    checkOutClose.classList.toggle('myd-checkout--open');
    document.body.classList.toggle('myd-cart-open');
}

/**
 * Back tab
 * 
 * Back tab template in cart.
 */
function backTab() {

    let currentTab = document.querySelector('.myd-cart__nav--active');

    if(currentTab.dataset.back != 'none') {

        // remove active tab
        currentTab.classList.remove('myd-cart__nav--active');
        document.querySelector('.' + currentTab.dataset.tabContent).classList.remove('myd-cart__content--active');

        // set active back tab
        let back = document.querySelector('.' + currentTab.dataset.back)
        back.classList.add('myd-cart__nav--active');
        document.querySelector('.' + back.dataset.tabContent).classList.add('myd-cart__content--active');
    }
}

/**
 * Back tab
 * 
 * Back tab template in cart.
 */
function nextTab() {

    if( checkOrderProductsEmpty() ) {

        // check store time
        if(checkStoreTime() == false) {
            return;
        }

        let currentTab = document.querySelector('.myd-cart__nav--active');

        if (currentTab.dataset.next == 'myd-cart__nav-confirm') {

            if (validateInputs() == false) {
                return;
            }

            let orderType = document.querySelector('.myd-cart__checkout-option.myd-cart__checkout-option--active').firstElementChild;

            if (validateZipcodeShipping(orderType.dataset.type) == false) {
                return;
            }

            processCheckout(orderType.dataset.type, orderType.innerText);
            calculateCoupon();
            processConfirmPage();
        }

        if(currentTab.dataset.next != 'none' && currentTab.dataset.next != 'myd-cart__finished') {

            // remove active tab
            currentTab.classList.remove('myd-cart__nav--active');
            document.querySelector('.' + currentTab.dataset.tabContent).classList.remove('myd-cart__content--active');

            // set active tab
            let next = document.querySelector('.' + currentTab.dataset.next)
            next.classList.add('myd-cart__nav--active');
            document.querySelector('.' + next.dataset.tabContent).classList.add('myd-cart__content--active');
        }

        if(currentTab.dataset.next == 'myd-cart__finished') {

            finishOrder(currentTab);
        }
    }
    else {

        // show bar notification
        noticiationBar('error', document.getElementById('myd-template-cart-empty').innerText);
    }
}

/**
 * Show cash/change
 * 
 * Show cash/change input
 */
function showChange() {

    let change = document.getElementById('input-payment-change');
    let label = document.getElementById('label-payment-change');

    if(this.options[this.selectedIndex].dataset.type == 'cash') {

        change.style.display = 'block';
        change.style.visibility = 'visible';
        change.setAttribute('required', 'required');
        label.style.display = 'block';
        label.style.visibility = 'visible';
    }
    else {

        change.style.display = 'none';
        change.style.visibility = 'hidden';
        change.removeAttribute('required', 'required');
        label.style.display = 'none';
        label.style.visibility = 'hidden';
    }
}