jQuery(document).ready(function( $ ) {
	$("#input-delivery-zipcode").blur(function() {
		var cep = $(this).val().replace(/\D/g, '');
		if (cep != "") {
			var validacep = /^[0-9]{8}$/;
			if(validacep.test(cep)) {
				$("#address").val("...");
				$.getJSON("//viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

				if (!("erro" in dados)) {
					if( dados.logradouro != '' ) {
						$("#input-delivery-street-name").val(dados.logradouro);
						$("#input-delivery-street-name").css('background', '#efefef');
						$("#input-delivery-address-number").focus();
					}
					
					else {
						$("#input-delivery-street-name").val('');
					}

					if( dados.logradouro != '' ) {
						$("#input-delivery-neighborhood").val(dados.bairro)
					}
				}
			});
			}
			else {
				limpa_formulario_cep();
			}
		}
	});
});