(function() {
  // https://dashboard.emailjs.com/admin/account
  emailjs.init({
    publicKey: "uhsJeZ_u6mbs4nY-h",
  });
})();
  // Bootstrap javaScript for disabling form submissions if there are invalid fields
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('order-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Always prevent the default behavior initially

        // Perform Bootstrap and custom validation
        let isValid = true;

        // Bootstrap validation
        if (!form.checkValidity()) {
            isValid = false;
            form.classList.add('was-validated');
        }

        // Custom manual validation for credit card fields
        const ccNumber = document.getElementById('cc-number');
        const ccExpiration = document.getElementById('cc-expiration');
        const ccCVV = document.getElementById('cc-cvv');

        // Validate Credit Card Number
        if (!/^\d{16}$/.test(ccNumber.value)) {
            ccNumber.classList.add('is-invalid');
            ccNumber.nextElementSibling.textContent = 'Credit card number must be 16 digits.';
            isValid = false;
        } else {
            ccNumber.classList.remove('is-invalid');
            ccNumber.classList.add('is-valid');
        }

        // Validate Expiration Date
        const expirationPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const [month, year] = ccExpiration.value.split('/').map(Number);
        const now = new Date();
        const currentYear = parseInt(now.getFullYear().toString().slice(-2), 10);
        const currentMonth = now.getMonth() + 1;

        if (!expirationPattern.test(ccExpiration.value) || year < currentYear || (year === currentYear && month < currentMonth)) {
            ccExpiration.classList.add('is-invalid');
            ccExpiration.nextElementSibling.textContent = 'Enter a valid expiration date (MM/YY) that is not expired.';
            isValid = false;
        } else {
            ccExpiration.classList.remove('is-invalid');
            ccExpiration.classList.add('is-valid');
        }

        // Validate CVV
        if (!/^\d{3}$/.test(ccCVV.value)) {
            ccCVV.classList.add('is-invalid');
            ccCVV.nextElementSibling.textContent = 'CVV must be 3 digits.';
            isValid = false;
        } else {
            ccCVV.classList.remove('is-invalid');
            ccCVV.classList.add('is-valid');
        }

        // If validation passes, proceed with EmailJS
        if (isValid) {
            emailjs.sendForm('service_ubzke86', 'artshop_order_form', this)
                .then(() => {
                    const emailAddress = document.getElementById('email').value;
                    const firstName = document.getElementById('firstName').value;
                    const lastName = document.getElementById('lastName').value;

                    emptyCart2(); // Clear the cart
                    messageAlert(emailAddress, firstName, lastName); // Display success message
                })
                .catch((error) => {
                    alert('Email sending failed. Please try again later.', error);
                });
        }
    });
  });    