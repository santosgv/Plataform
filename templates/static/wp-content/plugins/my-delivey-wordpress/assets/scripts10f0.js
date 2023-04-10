jQuery(document).ready( function($) {

	$('.fdm-count-products').text($('.my-delivery-cart-items').length);

	$('.myd-product-item__button').click( function() {

		var id = $(this).attr('id');
		$('#popup-' + id).css('display','flex');
	});

	$('.fdm-popup-close-btn').click( function() {
		$('.fdm-popup-product-init, .fdm-popup-init, .fdm-popup-content-edit, .fdm-popup-content').hide();
	});

	$('.fdm-click-plus').click( function() {

		var calc = parseInt($('.fmd-item-qty').val()) + 1;

		if(calc > 0) {
			$('.fmd-item-qty').val(calc);
		}
	});

	$('.fdm-click-minus').click( function() {

		var calc = parseInt($('.fmd-item-qty').val()) - 1;

		if(calc > 0) {
			$('.fmd-item-qty').val(calc);
		}
	});

	$('.myd-tel-8').mask('0000-0000');
	$('.myd-tel-9').mask('00000-0000');
	$('.myd-tel-8-ddd').mask('(00)0000-0000');
	$('.myd-tel-9-ddd').mask('(00)00000-0000');
	$('.myd-tel-us').mask('(000)000-0000');
	$('.myd-tel-ven').mask('(0000)000-0000');
	$('#input-payment-change').mask('000.000.000.000.000,00', {reverse: true});

	function scrollToAnchor(aid){
	    var aTag = $("#"+ aid);
	    $('html,body').animate({scrollTop: aTag.offset().top - 80},'slow');
	}

	$('.fdm-select-category').change( function() {

		scrollToAnchor( 'fdm-' + $('.fdm-select-category option:selected').val() );

	});

	$('.fdm-orders-loop').on('click', ".fdm-orders-items", function() {

		$('.fdm-orders-items').removeClass('fdm-active');
		$(this).addClass('fdm-active');
		$('.fdm-btn-order-action').attr('data-manage-order-id', $(this).attr('id'));
		$('.fdm-orders-full-items').hide();

		if ($(window).width() <= 768) {

			$('.fdm-orders-full-details').show();
		}

		$('.fdm-orders-full-items.' + $(this).attr('id')).show();
	});
	
	///limit extras
	$('.option_prod_exta').on('change', function() {

		var limit = $(this).attr('data-limit');

		if( limit != '' ) {

			var currentClass = $(this).prop('classList');
			var checks = $("input." + currentClass[0] + "." + currentClass[1] + ":checked");

			if(checks.length > limit) {
				this.checked = false;
			}
		}
	});

    $(".fdm-input-filter").on("keyup", function() {
    	var value = $(this).val().toLowerCase();
	    
	    $(".fdm-orders-items").filter(function() {
	    	$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
	    });
  	});

    $('.fdm-btn-order-action-back').on('click', function(){

    	$('.fdm-orders-full-details').hide();
    });

    ///image ligthbox
    $('.myd-product-item__img, .myd-product-popup__img').on( 'click', function(){

    	var link = $(this).css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1');

    	$('.fdm-lightbox-image-link img').attr('src', link);
    	$('.fdm-lightbox-image').css('display', 'flex');
    });

    $('.fdm-lightbox-image-close').on('click', function(){

    	$('.fdm-lightbox-image').hide();
    })


    $("#input-delivery-zipcode").keypress(function (e) {

	    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
	        
	        return false;
	    }
	});

});