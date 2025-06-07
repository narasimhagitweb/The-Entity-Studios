<?php
// ========== CONTACT FORM PROCESSING SCRIPT ==========

// STEP 1: Set your recipient email address
$to = "your@email.com"; // 🔧 Replace this

// STEP 2: Retrieve and sanitize form data
$name      = htmlspecialchars($_POST['firstName'] ?? '');
$lastName  = htmlspecialchars($_POST['lastName'] ?? '');
$email     = htmlspecialchars($_POST['email'] ?? '');
$phone     = htmlspecialchars($_POST['phone'] ?? '');
$message   = htmlspecialchars($_POST['message'] ?? '');
$agree     = isset($_POST['termsCheck']);
$recaptcha = $_POST['g-recaptcha-response'] ?? '';

// STEP 3: Verify reCAPTCHA
$recaptchaSecret = 'YOUR_RECAPTCHA_SECRET_KEY'; // 🔧 Replace
$verifyResponse = file_get_contents(
    "https://www.google.com/recaptcha/api/siteverify?secret=$recaptchaSecret&response=$recaptcha"
);
$responseData = json_decode($verifyResponse, true);

// STEP 4: reCAPTCHA failure
if (!$responseData['success']) {
    echo "<script>
        alert('reCAPTCHA Failed. Please confirm you are not a robot.');
        window.history.back();
    </script>";
    exit;
}

// STEP 5: Required field validation
if (empty($name) || empty($email) || empty($message) || empty($phone) || !$agree) {
    echo "<script>
        alert('Please fill all required fields and agree to the terms.');
        window.history.back();
    </script>";
    exit;
}

// STEP 6: Compose email
$subject = "New Contact Form Submission";
$body = "
New message from your website:

Name: $name $lastName
Email: $email
Phone: $phone

Message:
$message
";

$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

// STEP 7: Send email
if (mail($to, $subject, $body, $headers)) {
    echo "<script>
        alert('Message Sent Successfully!');
        window.location.href = 'thank-you.html';
    </script>";
} else {
    echo "<script>
        alert('Sending Failed. Please try again later.');
        window.history.back();
    </script>";
}
?>
