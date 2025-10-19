/**
 * Portal JavaScript
 * Handles sidebar navigation, form submissions, and animations
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }

  // Sidebar functionality
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("main-content");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebarLinks = document.querySelectorAll(".sidebar .nav-link");

  // Toggle sidebar
  function toggleSidebar() {
    sidebar.classList.toggle("active");
    mainContent.classList.toggle("sidebar-open");
    sidebarToggle.classList.toggle("active");

    // Add/remove body scroll lock
    document.body.classList.toggle("sidebar-open");
  }

  // Close sidebar when clicking outside
  function closeSidebar() {
    sidebar.classList.remove("active");
    mainContent.classList.remove("sidebar-open");
    sidebarToggle.classList.remove("active");
    document.body.classList.remove("sidebar-open");
  }

  // Event listeners
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar);
  }

  // Close sidebar when clicking on links (mobile)
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 992) {
        closeSidebar();
      }
    });
  });

  // Close sidebar when clicking outside
  document.addEventListener("click", function (event) {
    if (
      window.innerWidth <= 992 &&
      !sidebar.contains(event.target) &&
      !sidebarToggle.contains(event.target) &&
      sidebar.classList.contains("active")
    ) {
      closeSidebar();
    }
  });

  // Handle window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 992) {
      closeSidebar();
    }
  });

  // Form handling
  const registrationForm = document.getElementById("registrationForm");
  const affiliateForm = document.getElementById("affiliateForm");

  // Registration form submission
  if (registrationForm) {
    registrationForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleFormSubmission(this, "registration");
    });
  }

  // Affiliate form submission
  if (affiliateForm) {
    affiliateForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleFormSubmission(this, "affiliate");
    });
  }

  // Form submission handler
  // function handleFormSubmission(form, formType) {
  //     const submitButton = form.querySelector('.btn-register');
  //     const originalText = submitButton.innerHTML;

  //     // Show loading state
  //     submitButton.disabled = true;
  //     submitButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Processing...';

  //     // Simulate form processing
  //     setTimeout(() => {
  //         // Show success message
  //         showMessage('success', getSuccessMessage(formType));

  //         // Reset form
  //         form.reset();

  //         // Reset button
  //         submitButton.disabled = false;
  //         submitButton.innerHTML = originalText;

  //         // Scroll to top of form
  //         form.scrollIntoView({ behavior: 'smooth', block: 'start' });

  //     }, 2000);
  // }

  // Form submission handler
  async function handleFormSubmission(form, formType) {
    const submitButton = form.querySelector(".btn-register");
    const originalText = submitButton.innerHTML;

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<i class="bi bi-hourglass-split"></i> Processing...';

    // Convert form data to an object
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value.trim();
    });

    // Select SheetDB endpoint based on form type
    const sheetEndpoints = {
      registration: "https://sheetdb.io/api/v1/je0qjcwoqogvc", // replace with your real endpoint
      affiliate: "https://sheetdb.io/api/v1/tnu53nlbufq35",
    };
    const sheetAuth = {
      registration: {
        username: "sheetdbuser",
        password: "9b4c61b67d2a4f2e82a152c7b8e3e6d7",
      },
      affiliate: {
        username: "4y2e7cuc",
        password: "5lq3zw5y5yi2w5teeawj",
      },
    };

    const endpoint = sheetEndpoints[formType];
    let success = false;

    try {
      // Send data to SheetDB
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: data }),
      });

      if (response.ok) {
        success = true;
        showMessage("success", getSuccessMessage(formType));
        setInterval(() => {
          window.location.href = "./index.html";
        }, 1500);
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.error("Error sending to SheetDB:", error);
      if (error.response) {
        const text = await error.response.text();
        console.error("Response body:", text);
      }
      showMessage("error", "Something went wrong. Please try again.");
    } finally {
      // Reset form and button regardless of success
      if (success) form.reset();
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Get success message based on form type
  function getSuccessMessage(formType) {
    if (formType === "registration") {
      return "Thank you for registering! We'll notify you when the portal is ready.";
    } else if (formType === "affiliate") {
      return "Thank you for your interest in becoming an affiliate partner! We'll contact you soon.";
    }
    return "Thank you for your submission!";
  }

  // Show message function
  function showMessage(type, message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll(".form-message");
    existingMessages.forEach((msg) => msg.remove());

    // Create message element
    const messageDiv = document.createElement("div");
    messageDiv.className = `form-message ${type}-message`;
    messageDiv.innerHTML = `
            <div class="message-content">
                <i class="bi bi-${
                  type === "success" ? "check-circle" : "exclamation-circle"
                }"></i>
                <span>${message}</span>
            </div>
        `;

    // Add styles
    messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === "success" ? "#28a745" : "#dc3545"};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
        `;

    // Add to document
    document.body.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
      messageDiv.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
  }

  // Form validation
  function validateForm(form) {
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
        isValid = false;
      } else {
        field.classList.remove("is-invalid");
        field.classList.add("is-valid");
      }
    });

    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        emailField.classList.add("is-invalid");
        isValid = false;
      }
    }

    // Phone validation
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(phoneField.value.replace(/\s/g, ""))) {
        phoneField.classList.add("is-invalid");
        isValid = false;
      }
    }

    return isValid;
  }

  // Real-time validation
  document.addEventListener("input", function (e) {
    if (e.target.matches(".form-control")) {
      if (e.target.hasAttribute("required") && !e.target.value.trim()) {
        e.target.classList.add("is-invalid");
        e.target.classList.remove("is-valid");
      } else {
        e.target.classList.remove("is-invalid");
        e.target.classList.add("is-valid");
      }
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add loading animation to buttons
  function addLoadingAnimation(button) {
    button.style.position = "relative";
    button.style.overflow = "hidden";

    const loadingOverlay = document.createElement("div");
    loadingOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: loading 1.5s infinite;
        `;

    button.appendChild(loadingOverlay);
  }

  // Add interactive hover effects
  function addInteractiveEffects() {
    // Add hover effects to cards
    const cards = document.querySelectorAll(
      ".feature-card, .benefit-card, .registration-card"
    );
    cards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px) scale(1.02)";
        this.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
        this.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
      });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll(".btn-register");
    buttons.forEach((button) => {
      button.addEventListener("click", function (e) {
        const ripple = document.createElement("span");
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // Initialize interactive effects
  addInteractiveEffects();

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document
    .querySelectorAll(".feature-card, .benefit-card, .registration-card")
    .forEach((el) => {
      observer.observe(el);
    });

  // Add CSS animations
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes loading {
            0% {
                left: -100%;
            }
            100% {
                left: 100%;
            }
        }
        
        .form-control.is-invalid {
            border-color: #dc3545;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }
        
        .form-control.is-valid {
            border-color: #28a745;
            box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
        }
        
        .message-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .message-content i {
            font-size: 1.2rem;
        }
        
        body.sidebar-open {
            overflow: hidden;
        }
        
        @media (max-width: 992px) {
            .sidebar {
                left: -100%;
            }
        }
    `;
  document.head.appendChild(style);

  // Initialize tooltips if Bootstrap is available
  if (typeof bootstrap !== "undefined" && bootstrap.Tooltip) {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Add keyboard navigation support
  document.addEventListener("keydown", function (e) {
    // Close sidebar with Escape key
    if (e.key === "Escape" && sidebar.classList.contains("active")) {
      closeSidebar();
    }
  });

  // Add focus management for accessibility
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // Apply focus trap to sidebar when open
  if (sidebar) {
    trapFocus(sidebar);
  }

  console.log("Portal JavaScript initialized successfully");
});
