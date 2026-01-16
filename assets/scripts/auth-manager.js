class AuthManager {
  constructor() {
    this.authPages = {
      signin: "/signin.html",
      signup: "/signup.html",
      forgotpassword: "/forgotpassword.html",
    };

    this.isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    this.init();
  }

  async init() {
    if (this.isAuthenticated) {
      this.showDashboard();
    } else {
      await this.showAuthPage("signin");
    }

    document.addEventListener("auth:signin", () => this.handleSignIn());
    document.addEventListener("auth:navigate", (e) =>
      this.showAuthPage(e.detail.page)
    );
  }

  async showAuthPage(pageName) {
    if (!this.authPages[pageName]) return;

    document.getElementById("auth-container").style.display = "block";
    document.getElementById("dashboard-container").style.display = "none";

    try {
      const response = await fetch(this.authPages[pageName]);
      const html = await response.text();
      document.getElementById("auth-content").innerHTML = html;

      this.initAuthScripts(pageName);

      if (window.feather) {
        feather.replace();
      }
    } catch (error) {
      this.showError("Error loading page. Please try again.");
    }
  }

  initAuthScripts(pageName) {
    setTimeout(() => {
      this.initPasswordToggle();

      switch (pageName) {
        case "signin":
          this.initSignInButtons();
          break;
        case "signup":
          this.initSignUpButtons();
          break;
        case "forgotpassword":
          this.initForgotPasswordButtons();
          break;
      }
    }, 50);
  }

  initPasswordToggle() {
    document.querySelectorAll(".toggle-password").forEach((toggle) => {
      toggle.addEventListener("click", function () {
        const input =
          this.closest(".input-wrapper").querySelector(".password-field");
        const img = this.querySelector("img");

        if (input.type === "password") {
          input.type = "text";
          img.src = " assets/images/auth/hide_eye.svg";
          img.alt = "hide password";
        } else {
          input.type = "password";
          img.src = " assets/images/auth/show_eye.svg";
          img.alt = "show password";
        }
      });
    });
  }

  initSignInButtons() {
    const signInBtn = document.querySelector(".auth-btn");
    if (signInBtn) {
      signInBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleSignIn();
      });
    }

    const signUpLink = document.querySelector('a[href*="signup"]');
    if (signUpLink) {
      signUpLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigateToAuth("signup");
      });
    }

    const forgotPasswordLink = document.querySelector(
      'a[href*="forgotpassword"]'
    );
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigateToAuth("forgotpassword");
      });
    }

    const googleBtn = document.querySelector(".social-btn");
    if (googleBtn) {
      googleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleGoogleSignIn();
      });
    }
  }

  initSignUpButtons() {
    const signUpBtn = document.querySelector(".auth-btn");
    if (signUpBtn) {
      signUpBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleSignUp();
      });
    }

    const signInLink = document.querySelector('a[href*="signin"]');
    if (signInLink) {
      signInLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigateToAuth("signin");
      });
    }
  }

  initForgotPasswordButtons() {
    const submitBtn = document.querySelector(".auth-btn");
    if (submitBtn) {
      submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleForgotPassword();
      });
    }
  }

  handleSignIn() {
    localStorage.setItem("isAuthenticated", "true");
    this.isAuthenticated = true;
    this.showDashboard();
  }

  handleSignUp() {
    localStorage.setItem("isAuthenticated", "true");
    this.isAuthenticated = true;
    this.showDashboard();
  }

  handleForgotPassword() {
    this.navigateToAuth("signin");
  }

  handleGoogleSignIn() {
    localStorage.setItem("isAuthenticated", "true");
    this.isAuthenticated = true;
    this.showDashboard();
  }

  navigateToAuth(pageName) {
    const event = new CustomEvent("auth:navigate", {
      detail: { page: pageName },
    });
    document.dispatchEvent(event);
  }

  showDashboard() {
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("dashboard-container").style.display = "flex";

    if (window.pageLoader) {
      const initialPage = window.location.hash.replace("#", "") || "home";
      window.pageLoader.loadPage(initialPage);
    }
  }

  logout() {
    localStorage.removeItem("isAuthenticated");
    this.isAuthenticated = false;
    this.showAuthPage("signin");
  }

  showError(message) {
    const authContent = document.getElementById("auth-content");
    authContent.innerHTML = `
        <div class="auth-wrapper">
          <div class="auth-box">
            <div class="auth-card">
              <div class="alert alert-danger">${message}</div>
              <button class="w-100 auth-btn" onclick="window.authManager.showAuthPage('signin')">
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.authManager = new AuthManager();
});
