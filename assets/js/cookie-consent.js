document.addEventListener("DOMContentLoaded", function () {
  const banner = document.getElementById("cookie-consent-banner");
  const modalElement = document.getElementById("cookie-modal");
  const modal = new bootstrap.Modal(modalElement);
  const CONSENT_KEY = "cookieConsent";
  const DECLINE_TIMESTAMP_KEY = "cookieDeclineTimestamp";
  const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes in ms

  // Retrieve consent & decline timestamp from localStorage
  const consent = localStorage.getItem(CONSENT_KEY);
  const declineTimestamp = localStorage.getItem(DECLINE_TIMESTAMP_KEY);

  // Show banner function
  function showBanner() {
    banner.classList.remove("d-none");
  }

  // Banner display logic
  if (consent) {
    // Consent exists - do nothing (banner hidden)
    console.log("Consent already given");
  } else if (declineTimestamp) {
    // Show banner only if 5 minutes passed since decline
    const now = Date.now();
    if (now - parseInt(declineTimestamp, 10) > FIVE_MINUTES) {
      showBanner();
    } else {
      console.log("Declined recently, banner hidden");
    }
  } else {
    // No consent or decline record - show banner
    showBanner();
  }

  // Accept All button handler
  document.getElementById("accept-all").onclick = () => {
    saveConsent({ necessary: true }); // Necessary includes analytics
    banner.classList.add("d-none");
    localStorage.removeItem(DECLINE_TIMESTAMP_KEY);
  };

  
  // Decline All button handler
  document.getElementById("decline-all").onclick = () => {
    localStorage.setItem(DECLINE_TIMESTAMP_KEY, Date.now().toString());
    localStorage.removeItem(CONSENT_KEY);
    banner.classList.add("d-none");
  };

  // Customize button shows modal
  document.getElementById("customize").onclick = () => {
    modal.show();
  };

  // Save preferences from modal (only necessary here)
  document.getElementById("cookie-form").onsubmit = function (e) {
    e.preventDefault();
    saveConsent({ necessary: true }); // Only one option, always true
    modal.hide();
    banner.classList.add("d-none");
    localStorage.removeItem(DECLINE_TIMESTAMP_KEY);
  };

  // Save consent and load GA if allowed
  function saveConsent(consent) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    handleConsent(consent);
  }

  // Load Google Analytics only if consent given
  function handleConsent(consent) {
    if (consent.necessary) {
      loadGoogleAnalytics();
    }
  }

  // GA loader function
  function loadGoogleAnalytics() {
    if (window.gaLoaded) {
      console.log("GA already loaded");
      return;
    }
    const gaID = "G-9TVLHYTJ8X"; // Replace with your GA4 ID
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        dataLayer.push(arguments);
      };
    gtag("js", new Date());
    gtag("config", gaID);

    window.gaLoaded = true;
    console.log("Google Analytics loaded");
  }

    try {
      const consentObj = JSON.parse(consent);
      handleConsent(consentObj);
    } catch (e) {
      console.error("Invalid consent data. Clearing.");
      localStorage.removeItem(CONSENT_KEY);
      showBanner();
    }



  // Load GA if consent already present on page load
  if (consent) {
    handleConsent(JSON.parse(consent));
  }
});





