async function doCheckApi(url) {

	let order_id = document.querySelector('.fdm-orders-items');
	order_id = order_id != null ? order_id.id : 0

	try {
		const apiResponse = await fetch(url + '?oid=' + order_id);

		if (apiResponse.ok) {
			const data = await apiResponse.json();

			if( data.status != 'atualizado' ) {
				updateOrders();
			}
		}

		else {
			console.log('GET API error');
		}
			
	} catch (error) {
		console.log(error.message);
	}
}

async function updateOrders () {

	const reloadOrders = await fetch( order_ajax_object.ajax_url, {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
	    	'Content-Type': 'application/x-www-form-urlencoded',
	    	'Cache-Control': 'no-cache',
    	},
		body: 'action=update_orders&nonce=' + order_ajax_object.nonce ,
	});

	const reloadResponse = await reloadOrders.json();
	const orderItems = document.querySelectorAll('.fdm-orders-items, .fdm-orders-full-items');
	const orderActionAttr = document.querySelectorAll('.fdm-btn-order-action');
	const orderPrint = document.querySelectorAll('.order-print');

	orderItems.forEach( (element) => element.remove() );
	orderActionAttr.forEach( (btn) => btn.setAttribute('data-manage-order-id', '') );
	orderPrint.forEach( (element) => element.remove() );

	const notificationSong = new Audio('/wp-content/plugins/my-delivey-wordpress/assets/notifications/trim_phone.mp3');
	notificationSong.play();

	document.querySelector('.fdm-orders-loop').insertAdjacentHTML('afterbegin', reloadResponse.loop);
	document.querySelector('.fdm-orders-full').insertAdjacentHTML('afterbegin', reloadResponse.full);
	document.querySelector('#hide-prints').insertAdjacentHTML('afterbegin', reloadResponse.print);

	if ( screen.width <= 980 ) {

		document.querySelectorAll('.fdm-orders-full-details').display = 'none';
	}
}