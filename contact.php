<?php
// Step 1: Replace this with your receiving email address
$to = "your@email.com";

// Step 2: Get form values
$name = htmlspecialchars($_POST['name'] ?? '');
$email = htmlspecialchars($_POST['email'] ?? '');
$message = htmlspecialchars($_POST['message'] ?? '');
$agree = $_POST['agree'] ?? null;
$recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

// Step 3: reCAPTCHA verification
$recaptchaSecret = 'YOUR_RECAPTCHA_SECRET_KEY'; // Replace with your secret key
$verifyResponse = file_get_contents(
    "https://www.google.com/recaptcha/api/siteverify?secret=$recaptchaSecret&response=$recaptchaResponse"
);
$responseData = json_decode($verifyResponse, true);

// Step 4: Check validation
if (!$responseData['success']) {
    echo "<script>
        Swal.fire({
            icon: 'error',
            title: 'reCAPTCHA Failed',
            text: 'Please confirm you are not a robot.'
        }).then(() => { window.history.back(); });
    </script>";
    exit;
}

if (empty($name) || empty($email) || empty($message) || !$agree) {
    echo "<script>
        Swal.fire({
            icon: 'error',
            title: 'Missing Information',
            text: 'Please fill out all required fields and agree to the terms.'
        }).then(() => { window.history.back(); });
    </script>";
    exit;
}

// Step 5: Prepare the email
$subject = "New Contact Form Submission";
$body = "
You received a new message from your website:

Name: $name
Email: $email

Message:
$message
";

$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

// Step 6: Send email
if (mail($to, $subject, $body, $headers)) {
    echo "<script>
        Swal.fire({
            icon: 'success',
            title: 'Message Sent',
            text: 'Thank you for contacting us!'
        }).then(() => { window.location.href = 'thank-you.html'; });
    </script>";
} else {
    echo "<script>
        Swal.fire({
            icon: 'error',
            title: 'Sending Failed',
            text: 'Something went wrong. Please try again later.'
        }).then(() => { window.history.back(); });
    </script>";
}
?>
