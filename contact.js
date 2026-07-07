(function () {
  const form = document.getElementById("contact-form");
  const btn = form.querySelector(".contact-btn");
  const status = document.getElementById("contact-status");

  const API_URL = "https://gyzau16ub8.execute-api.us-east-1.amazonaws.com/contact";

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Clear previous status
    status.textContent = "";
    status.className = "contact-status";

    // Validate
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Disable button and show sending state
    btn.disabled = true;
    btn.textContent = "Sending...";

    const payload = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim(),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Server responded with " + res.status);
      }

      status.textContent = "Thank you! I'll get back to you soon.";
      status.className = "contact-status success";
      form.reset();
    } catch (err) {
      status.textContent = "Something went wrong. Please try again.";
      status.className = "contact-status error";
    } finally {
      btn.disabled = false;
      btn.textContent = "Send message";
    }
  });
})();
