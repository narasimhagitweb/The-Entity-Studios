// 📌 Initialize EmailJS when the script loads
(function () {
  emailjs.init({
    publicKey: "rYefjyypzUAM_GDuh", // Replace with your EmailJS Public Key
  });
})();

// 📌 On Form Submission
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent page reload

    // ✅ Check reCAPTCHA response
    var recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      alert("Please complete the reCAPTCHA.");
      return;
    }

    // 📨 Set up EmailJS template parameters
    var templateParams = {
      name: document.getElementById("nameinput1").value,
      to: document.getElementById("emailInput").value,
      body: document.getElementById("messageInput").value,
    };

    // 📤 Send email
    emailjs
      .send("service_2zs6kg2", "template_x863nwy", templateParams) // Replace with your service & template ID
      .then(
        function (response) {
          alert("Message sent!");
          document.getElementById("contactForm").reset(); // Reset form
          grecaptcha.reset(); // Reset CAPTCHA
        },
        function (error) {
          alert("Failed to send message: " + error.text);
        }
      );
  });
});
