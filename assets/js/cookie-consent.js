document.addEventListener("DOMContentLoaded", function () {
  const banner = document.getElementById("cookie-consent-banner");
  const modalElement = document.getElementById("cookie-modal");
  const modal = new bootstrap.Modal(modalElement);
  const CONSENT_KEY = "cookieConsent";
  const DECLINE_TIMESTAMP_KEY = "cookieDeclineTimestamp";
  const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Check if consent is given permanently (accepted)
  const consent = localStorage.getItem(CONSENT_KEY);
  const declineTimestamp = localStorage.getItem(DECLINE_TIMESTAMP_KEY);

  // Function to show banner
  function showBanner() {
    banner.classList.remove("d-none");
  }

  // Show banner logic:
  if (consent) {
    // Consent exists - if accepted, do nothing (banner hidden)
    console.log("Consent already given");
  } else if (declineTimestamp) {
    // Check if 5 minutes passed since decline
    const now = Date.now();
    const timePassed = now - parseInt(declineTimestamp, 10);
    if (timePassed > FIVE_MINUTES) {
      showBanner();
    } else {
      // less than 5 minutes, keep banner hidden
      console.log("Declined recently, banner hidden");
    }
  } else {
    // No consent, no decline timestamp — show banner
    showBanner();
  }

  // Accept All
  document.getElementById("accept-all").onclick = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
    banner.classList.add("d-none");
    localStorage.removeItem(DECLINE_TIMESTAMP_KEY); // remove decline timestamp on accept
  };

  // Decline All
  document.getElementById("decline-all").onclick = () => {
    localStorage.setItem(DECLINE_TIMESTAMP_KEY, Date.now().toString());
    localStorage.removeItem(CONSENT_KEY); // clear consent
    banner.classList.add("d-none");
  };

  // Customize Button (show modal)
  document.getElementById("customize").onclick = () => {
    modal.show();
  };

  // Save Preferences from modal
  document.getElementById("cookie-form").onsubmit = function (e) {
    e.preventDefault();
    const analytics = document.getElementById("analytics").checked;
    const marketing = document.getElementById("marketing").checked;
    saveConsent({ necessary: true, analytics, marketing });
    modal.hide();
    banner.classList.add("d-none");
    localStorage.removeItem(DECLINE_TIMESTAMP_KEY); // clear decline timestamp on save
  };

  // Store and apply consent
  function saveConsent(consent) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    handleConsent(consent);
  }

  // Load Google Analytics if allowed
  function handleConsent(consent) {
    if (consent.analytics) {
      loadGoogleAnalytics();
    }
  }

  // Google Analytics Loader
  function loadGoogleAnalytics() {
    if (window.gaLoaded) {
      console.log("GA script already loaded");
      return;
    }
    const gaID = "G-9TVLHYTJ8X"; // your GA4 ID here
    const scriptTag = document.createElement("script");
    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${gaID}`;
    scriptTag.async = true;
    document.head.appendChild(scriptTag);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", gaID);

    window.gaLoaded = true;
    console.log("Loading Google Analytics");
  }

  // Load GA if consent was already given
  if (consent) {
    handleConsent(JSON.parse(consent));
  }
});
