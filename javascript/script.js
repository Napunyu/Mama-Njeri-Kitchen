document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reservationForm");
  const statusBox = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const dateInput = document.getElementById("date");

  // Prevent selecting past dates in the date picker
  const today = new Date().toISOString().split("T")[0];
  if (dateInput) {
    dateInput.setAttribute("min", today);
  }

  function showFieldError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (message) {
      input.classList.add("invalid");
      error.textContent = message;
    } else {
      input.classList.remove("invalid");
      error.textContent = "";
    }
  }

  function setStatus(type, message) {
    statusBox.className = `form-status ${type}`;
    statusBox.textContent = message;
  }

  function validateForm() {
    let isValid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const date = document.getElementById("date").value;
    const guests = parseInt(document.getElementById("guests").value, 10);

    // 1. Name check
    if (name.length < 2) {
      showFieldError("name", "nameError", "Please enter your full name (at least 2 characters).");
      isValid = false;
    } else {
      showFieldError("name", "nameError", "");
    }

    // 2. Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFieldError("email", "emailError", "Please enter a valid email address.");
      isValid = false;
    } else {
      showFieldError("email", "emailError", "");
    }

    // 3. Phone check (supports Kenyan 07xx/01xx or +254 formats, 9-13 digits)
    const cleanedPhone = phone.replace(/[\s\-()]/g, "");
    const phoneRegex = /^(\+254|254|0)[17]\d{8}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      showFieldError("phone", "phoneError", "Enter a valid Kenyan number (e.g. 0712 345 678).");
      isValid = false;
    } else {
      showFieldError("phone", "phoneError", "");
    }

    // 4. Date check
    if (!date) {
      showFieldError("date", "dateError", "Please select a reservation date.");
      isValid = false;
    } else if (date < today) {
      showFieldError("date", "dateError", "Reservation date cannot be in the past.");
      isValid = false;
    } else {
      showFieldError("date", "dateError", "");
    }

    // 5. Guests check
    if (isNaN(guests) || guests < 1 || guests > 30) {
      showFieldError("guests", "guestsError", "Number of guests must be between 1 and 30.");
      isValid = false;
    } else {
      showFieldError("guests", "guestsError", "");
    }

    return isValid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusBox.className = "form-status";
    statusBox.textContent = "";

    if (!validateForm()) {
      setStatus("error", "Please fix the highlighted errors before submitting.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      const formData = new FormData(form);
      const response = await fetch(form.getAttribute("action"), {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setStatus("success", result.message);
        form.reset();
        document.getElementById("guests").value = 2;
      } else {
        setStatus("error", result.message || "Could not process your reservation. Please try again.");
      }
    } catch (err) {
      setStatus("error", "Network or server error. Make sure Apache and MySQL are running in XAMPP.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Reservation";
    }
  });
});