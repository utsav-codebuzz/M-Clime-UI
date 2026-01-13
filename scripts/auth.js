document.addEventListener("DOMContentLoaded", function () {
  /* =========================
     PASSWORD TOGGLE
  ========================= */
  document.querySelectorAll(".toggle-password").forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const input = this.parentElement.querySelector(".password-field");
      const img = this.querySelector("img");

      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        img.src = " assets/images/auth/hide_eye.svg";
      } else {
        input.type = "password";
        img.src = " assets/images/auth/show_eye.svg";
      }
    });
  });

  /* =========================
     HELPERS
  ========================= */
  function getErrorDiv(input) {
    const block = input.closest(".mb-2, .mb-3");
    return block ? block.querySelector(".error-text") : null;
  }

  function showError(input, message) {
    const errorDiv = getErrorDiv(input);
    if (!errorDiv) return;

    input.classList.add("input-error");
    errorDiv.textContent = message;
  }

  function clearError(input) {
    const errorDiv = getErrorDiv(input);
    if (!errorDiv) return;

    input.classList.remove("input-error");
    errorDiv.textContent = "";
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /* =========================
     SIGN IN VALIDATION
  ========================= */
  const signinForm = document.getElementById("signinForm");

  function validateSignin() {
    let valid = true;

    const email = signinForm.email;
    const password = signinForm.password;

    clearError(email);
    clearError(password);

    if (!email.value.trim()) {
      showError(email, "Email is required");
      valid = false;
    } else if (!isEmail(email.value)) {
      showError(email, "Enter a valid email");
      valid = false;
    }

    if (!password.value.trim()) {
      showError(password, "Password is required");
      valid = false;
    } else if (password.value.length < 6) {
      showError(password, "Password must be at least 6 characters");
      valid = false;
    }

    return valid;
  }

  if (signinForm) {
    signinForm.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", validateSignin);
    });

    signinForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (validateSignin()) {
        window.location.href = "/home.html";
      }
    });
  }

  /* =========================
     SIGN UP VALIDATION
  ========================= */
  const signupForm = document.getElementById("signupForm");

  function validateSignup() {
    let valid = true;

    const { firstName, lastName, email, password, confirmPassword, terms } =
      signupForm;

    [firstName, lastName, email, password, confirmPassword].forEach(clearError);

    if (!firstName.value.trim()) {
      showError(firstName, "First name is required");
      valid = false;
    }

    if (!lastName.value.trim()) {
      showError(lastName, "Last name is required");
      valid = false;
    }

    if (!email.value.trim()) {
      showError(email, "Email is required");
      valid = false;
    } else if (!isEmail(email.value)) {
      showError(email, "Enter a valid email");
      valid = false;
    }

    if (!password.value.trim()) {
      showError(password, "Password is required");
      valid = false;
    } else if (password.value.length < 6) {
      showError(password, "Minimum 6 characters required");
      valid = false;
    }

    if (!confirmPassword.value.trim()) {
      showError(confirmPassword, "Confirm your password");
      valid = false;
    } else if (password.value !== confirmPassword.value) {
      showError(confirmPassword, "Passwords do not match");
      valid = false;
    }

    const termsError =
      signupForm.querySelector(".form-check").nextElementSibling;
    if (!terms.checked) {
      termsError.textContent = "You must accept terms & conditions";
      termsError.style.color = "#dc2626";
      valid = false;
    } else {
      termsError.textContent = "";
    }

    return valid;
  }

  if (signupForm) {
    signupForm.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", validateSignup);
      input.addEventListener("change", validateSignup);
    });

    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  }

  /* =========================
   FORGOT PASSWORD VALIDATION
========================= */
  const forgotForm = document.getElementById("forgotPasswordForm");

  function validateForgot() {
    let valid = true;

    const newPassword = forgotForm.newPassword;
    const confirmPassword = forgotForm.confirmPassword;

    [newPassword, confirmPassword].forEach(clearError);

    if (!newPassword.value.trim()) {
      showError(newPassword, "New password is required");
      valid = false;
    } else if (newPassword.value.length < 6) {
      showError(newPassword, "Password must be at least 6 characters");
      valid = false;
    }

    if (!confirmPassword.value.trim()) {
      showError(confirmPassword, "Please confirm your password");
      valid = false;
    } else if (newPassword.value !== confirmPassword.value) {
      showError(confirmPassword, "Passwords do not match");
      valid = false;
    }

    return valid;
  }

  if (forgotForm) {
    forgotForm.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", validateForgot);
      input.addEventListener("change", validateForgot);
    });

    forgotForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (validateForgot()) {
        window.location.href = "/signin.html";
      }
    });
  }
});
