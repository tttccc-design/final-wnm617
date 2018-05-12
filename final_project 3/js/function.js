//Handle response from Stripe
Stripe.setPublishableKey('pk_test_VhMT9gigzN1m18bdyKaQIUTB');
var stripeResponseHandler = function(status, response){
	var $form = $('#payment-form');
	if(response.error){
		$form.find('.payment-error').text(response.error.message);
		$form.find('.submit_button').prop('disabled',false);
	}else{
		var token = response.id;
		alert(token);
	}
}
//Submit form to Stripe
$(function() {
	$('.submit_button').click(function(){
		var $form = $('#payment-form');
		$form.find('.submit_button').prop('disabled',true);
		Stripe.card.createToken($form, stripeResponseHandler);
		return false;
	});

	$('.amount').click(function(){
		$('.amount').css("background-color","#3174C1");
		$(this).css("background-color","#65AAF7");
	});

});