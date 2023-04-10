jQuery( document ).ready( function( $ ) {

	/****reload orders list******/
	$('.fdm-btn-order-action').on('click', function() {

		$(document).ajaxStart(function() {
			$('.fdm-load-ajax').css('display','flex');
		});

		var id = $(this).attr('data-manage-order-id');
		var order_action = $(this).attr('data-manage-order-action');

		if( id == '' ) {
			return;
		}

		if( order_action == 'print' ) {
			var width = $(this).attr('data-print-size');
			var font_size = $(this).attr('data-print-font');
			var printer = 'print-' + id;
			var style = '@page { size:' + width + ' 200mm; margin: 0; } .order-print { font-size:' + font_size + 'px; } .order-header{ text-align: center }';

			printJS({
			  	printable: printer,
			    type: 'html',
			    style: style,
			});
			return;
		}

		$.ajax({
			method: "post",
			url: ajax_object.ajax_url,
			data: { action: 'reload_orders', id: id, order_action: order_action }
		}).done(function(response) {
			var obj = JSON.parse(response);

			$('.fdm-orders-items, .fdm-orders-full-items').remove();
			$('.fdm-orders-loop').append(obj.loop);
			$('.fdm-orders-full').append(obj.full);
			$('.fdm-btn-order-action').attr('data-manage-order-id', '');

			if ($(window).width() <= 768) {

				$('.fdm-orders-full-details').hide();
			}
		});

		$(document).ajaxStop(function() {
			$('.fdm-load-ajax').hide();
		});
	});
});