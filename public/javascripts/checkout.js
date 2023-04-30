/*
Stripe.setPublishableKey('pk_test_51N1mzfGxUFhFsMJUPwhXjpYXLUuBzBOGgdC6KBmwma3Y7VEKc0soX6xbZh3x0Fpigf6Ue5kCG30D3RnXAosHldY400m7u5mRFv');

var $form = $('#checkout-form');

$form.sunmit(function (event) { //event from jquery
    $form.find('button').prop('disabled', true);

    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
    }, stripeResponseHandler);
    return false;
});

var stripeResponseHandler = function (status, response) {

    if (response.error) { // Problem!
        // Show the errors on the form:
        $('#payment-errors').text(response.error.message);
        $('#payment-errors').removeClass('d-none');
        $form.find('button').prop('disabled' , false);

    } else { // Token was created!
        // Get the token ID:
        var token = response.id;

        // Insert the token ID into the form so it gets submitted to the server
        var form = document.getElementById('payment-form');
        var hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'stripeToken');
        hiddenInput.setAttribute('value', token);
        form.appendChild(hiddenInput);

        // Submit the form
        form.submit();
    }
};*/



/*
var stripe = Stripe('pk_test_51N1mzfGxUFhFsMJUPwhXjpYXLUuBzBOGgdC6KBmwma3Y7VEKc0soX6xbZh3x0Fpigf6Ue5kCG30D3RnXAosHldY400m7u5mRFv');
var elements = stripe.elements({
    clientSecret: 'CLIENT_SECRET',
});

const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

const form = document.getElementById('checkout-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
    });

    if (error) {
        // handle errors
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = error.message;
    } else {
        // handle payment method
        const paymentMethodId = paymentMethod.id;
        console.log(paymentMethodId);
        // send the payment method to your server to create a payment intent or charge
    }
});
// handle errors
const errorElement = document.getElementById('card-errors');
if (error) {
    errorElement.textContent = error.message;
} else {
    errorElement.textContent = '';
}
*/





Stripe.setPublishableKey('pk_test_51N1mzfGxUFhFsMJUPwhXjpYXLUuBzBOGgdC6KBmwma3Y7VEKc0soX6xbZh3x0Fpigf6Ue5kCG30D3RnXAosHldY400m7u5mRFv');


var $form = $('#checkout-form');

$form.submit(function (event) {
    $form.find('button').prop('disabled', true);
    $('#payment-errors').addClass('d-none')

    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val()
    }, stripeResponseHandler);
    return false;

});



function stripeResponseHandler(status, response) {


    if (response.error) { // Problem!

        // Show the errors on the form
        $('#payment-errors').text(response.error.message);
        $('#payment-errors').removeClass('d-none')
        $form.find('button').prop('disabled', false); // Re-enable submission

    } else { // Token was created!

        // Get the token ID:
        var token = response.id;
        console.log(token); 
        // Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));

        // Submit the form:
        $form.get(0).submit();

    }
}