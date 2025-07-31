// API Configuration
const API_BASE_URL = "http://localhost:8000/api";

// Global state
let currentUser = null;
let authToken = localStorage.getItem("authToken");

// DOM Elements
const sections = {
  auth: document.getElementById("authSection"),
  activities: document.getElementById("activitiesSection"),
  bookings: document.getElementById("bookingsSection"),
};

const navButtons = {
  auth: document.getElementById("authBtn"),
  activities: document.getElementById("activitiesBtn"),
  bookings: document.getElementById("bookingsBtn"),
  logout: document.getElementById("logoutBtn"),
};

// Utility Functions
function showMessage(message, type = "info") {
  const messageEl = document.getElementById("message");
  messageEl.innerHTML = `
        <i class="fas fa-${
          type === "success"
            ? "check-circle"
            : type === "error"
            ? "exclamation-circle"
            : "info-circle"
        }"></i>
        ${message}
    `;
  messageEl.className = `message ${type} show`;

  setTimeout(() => {
    messageEl.classList.remove("show");
  }, 4000);
}

function showSection(sectionName) {
  Object.values(sections).forEach((section) =>
    section.classList.remove("active")
  );
  Object.values(navButtons).forEach((btn) => btn.classList.remove("active"));

  sections[sectionName].classList.add("active");
  navButtons[sectionName].classList.add("active");
}

function updateAuthUI() {
  if (authToken) {
    navButtons.auth.style.display = "none";
    navButtons.logout.style.display = "block";
    showSection("activities");
  } else {
    navButtons.auth.style.display = "block";
    navButtons.logout.style.display = "none";
    showSection("auth");
  }
}

function setLoadingState(element, isLoading) {
  if (isLoading) {
    element.disabled = true;
    element.innerHTML = '<span class="loading"></span> Loading...';
  } else {
    element.disabled = false;
    // Reset button content based on element type
    if (element.type === "submit") {
      if (element.closest("#loginForm")) {
        element.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
      } else if (element.closest("#registerForm")) {
        element.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
      } else if (element.closest("#addActivityForm")) {
        element.innerHTML = '<i class="fas fa-save"></i> Create Activity';
      }
    }
  }
}

// API Functions
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Authentication Functions
async function register(userData) {
  const submitBtn = document.querySelector(
    '#registerForm button[type="submit"]'
  );
  setLoadingState(submitBtn, true);

  try {
    await apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    showMessage("Account created successfully! Please sign in.", "success");
    switchToLogin();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setLoadingState(submitBtn, false);
  }
}

async function login(credentials) {
  const submitBtn = document.querySelector('#loginForm button[type="submit"]');
  setLoadingState(submitBtn, true);

  try {
    const data = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    authToken = data.token;
    localStorage.setItem("authToken", authToken);
    showMessage("Welcome back! You have successfully signed in.", "success");
    updateAuthUI();
    loadActivities();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setLoadingState(submitBtn, false);
  }
}

function logout() {
  authToken = null;
  localStorage.removeItem("authToken");
  updateAuthUI();
  showMessage("You have been signed out successfully.", "info");
}

// Activity Functions
async function loadActivities() {
  const activitiesList = document.getElementById("activitiesList");
  activitiesList.innerHTML =
    '<div style="text-align: center; padding: 40px;"><span class="loading"></span> Loading activities...</div>';

  try {
    const activities = await apiCall("/activities");
    displayActivities(activities);
  } catch (error) {
    showMessage(error.message, "error");
    activitiesList.innerHTML =
      '<p style="text-align: center; color: #f56565; padding: 40px;">Failed to load activities. Please try again.</p>';
  }
}

async function createActivity(activityData) {
  const submitBtn = document.querySelector(
    '#addActivityForm button[type="submit"]'
  );
  setLoadingState(submitBtn, true);

  try {
    await apiCall("/activities", {
      method: "POST",
      body: JSON.stringify(activityData),
    });
    showMessage("Activity created successfully! 🎉", "success");
    loadActivities();
    hideAddActivityForm();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setLoadingState(submitBtn, false);
  }
}

function displayActivities(activities) {
  const activitiesList = document.getElementById("activitiesList");

  if (activities.length === 0) {
    activitiesList.innerHTML = `
            <div style="text-align: center; padding: 60px; color: var(--text-light);">
                <i class="fas fa-calendar-times" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No Activities Available</h3>
                <p>Be the first to create an activity!</p>
            </div>
        `;
    return;
  }

  activitiesList.innerHTML = activities
    .map(
      (activity) => `
        <div class="activity-card">
            <h3><i class="fas fa-calendar-check"></i> ${activity.title}</h3>
            ${
              activity.description
                ? `<p><i class="fas fa-align-left"></i> ${activity.description}</p>`
                : ""
            }
            <div class="activity-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${
                  activity.location
                }</span>
                <span><i class="fas fa-calendar"></i> ${new Date(
                  activity.date
                ).toLocaleDateString()}</span>
            </div>
            <div class="activity-meta">
                <span><i class="fas fa-clock"></i> ${activity.time}</span>
                <button class="book-btn" onclick="bookActivity('${
                  activity._id
                }')">
                    <i class="fas fa-bookmark"></i> Book Now
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

// Booking Functions
async function bookActivity(activityId) {
  const button = event.target.closest(".book-btn");
  const originalText = button.innerHTML;

  button.disabled = true;
  button.innerHTML = '<span class="loading"></span> Booking...';

  try {
    await apiCall("/bookings/book", {
      method: "POST",
      body: JSON.stringify({ activityId }),
    });
    showMessage("Activity booked successfully! 🎉", "success");
    loadMyBookings();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    button.disabled = false;
    button.innerHTML = originalText;
  }
}

async function loadMyBookings() {
  const bookingsList = document.getElementById("bookingsList");
  bookingsList.innerHTML =
    '<div style="text-align: center; padding: 40px;"><span class="loading"></span> Loading your bookings...</div>';

  try {
    const bookings = await apiCall("/bookings/my-bookings");
    displayBookings(bookings);
  } catch (error) {
    showMessage(error.message, "error");
    bookingsList.innerHTML =
      '<p style="text-align: center; color: #f56565; padding: 40px;">Failed to load bookings. Please try again.</p>';
  }
}

function displayBookings(bookings) {
  const bookingsList = document.getElementById("bookingsList");

  if (bookings.length === 0) {
    bookingsList.innerHTML = `
            <div style="text-align: center; padding: 60px; color: var(--text-light);">
                <i class="fas fa-bookmark" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No Bookings Yet</h3>
                <p>Start exploring activities and make your first booking!</p>
            </div>
        `;
    return;
  }

  bookingsList.innerHTML = bookings
    .map(
      (booking) => `
        <div class="booking-card">
            <h3><i class="fas fa-calendar-check"></i> ${
              booking.activity.title
            }</h3>
            ${
              booking.activity.description
                ? `<p><i class="fas fa-align-left"></i> ${booking.activity.description}</p>`
                : ""
            }
            <p><i class="fas fa-map-marker-alt"></i> ${
              booking.activity.location
            }</p>
            <p><i class="fas fa-calendar"></i> ${new Date(
              booking.activity.date
            ).toLocaleDateString()}</p>
            <p><i class="fas fa-clock"></i> ${booking.activity.time}</p>
            <p class="booking-date">
                <i class="fas fa-bookmark"></i> Booked on: ${new Date(
                  booking.createdAt
                ).toLocaleDateString()}
            </p>
        </div>
    `
    )
    .join("");
}

// Form Functions
function switchToLogin() {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.querySelector('[data-tab="login"]').classList.add("active");
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
}

function switchToRegister() {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.querySelector('[data-tab="register"]').classList.add("active");
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
}

function showAddActivityForm() {
  document.getElementById("addActivityForm").style.display = "block";
  document.getElementById("addActivityBtn").style.display = "none";
  // Focus on first input
  document.getElementById("activityTitle").focus();
}

function hideAddActivityForm() {
  document.getElementById("addActivityForm").style.display = "none";
  document.getElementById("addActivityBtn").style.display = "block";
  document.getElementById("addActivityForm").reset();
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  // Navigation
  navButtons.auth.addEventListener("click", () => showSection("auth"));
  navButtons.activities.addEventListener("click", () => {
    if (authToken) {
      showSection("activities");
      loadActivities();
    } else {
      showMessage("Please sign in to view activities", "error");
    }
  });
  navButtons.bookings.addEventListener("click", () => {
    if (authToken) {
      showSection("bookings");
      loadMyBookings();
    } else {
      showMessage("Please sign in to view your bookings", "error");
    }
  });
  navButtons.logout.addEventListener("click", logout);

  // Auth tabs
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      if (tab === "login") {
        switchToLogin();
      } else {
        switchToRegister();
      }
    });
  });

  // Login form
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    await login({ email, password });
  });

  // Register form
  document
    .getElementById("registerForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("registerName").value.trim();
      const email = document.getElementById("registerEmail").value.trim();
      const phone = document.getElementById("registerPhone").value.trim();
      const password = document.getElementById("registerPassword").value;

      if (!name || !email || !phone || !password) {
        showMessage("Please fill in all fields", "error");
        return;
      }

      if (password.length < 6) {
        showMessage("Password must be at least 6 characters long", "error");
        return;
      }

      await register({ name, email, phone, password });
    });

  // Activity form
  document
    .getElementById("addActivityBtn")
    .addEventListener("click", showAddActivityForm);
  document
    .getElementById("cancelAddBtn")
    .addEventListener("click", hideAddActivityForm);

  document
    .getElementById("addActivityForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("activityTitle").value.trim();
      const description = document
        .getElementById("activityDescription")
        .value.trim();
      const location = document.getElementById("activityLocation").value.trim();
      const date = document.getElementById("activityDate").value;
      const time = document.getElementById("activityTime").value;

      if (!title || !location || !date || !time) {
        showMessage("Please fill in all required fields", "error");
        return;
      }

      await createActivity({ title, description, location, date, time });
    });

  // Initialize UI
  updateAuthUI();

  // Set default date to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("activityDate").value = today;

  // Add keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "1":
          e.preventDefault();
          if (authToken) {
            showSection("activities");
            loadActivities();
          }
          break;
        case "2":
          e.preventDefault();
          if (authToken) {
            showSection("bookings");
            loadMyBookings();
          }
          break;
        case "l":
          e.preventDefault();
          if (authToken) {
            logout();
          }
          break;
      }
    }
  });

  // Show welcome message if user is logged in
  if (authToken) {
    setTimeout(() => {
      showMessage(
        "Welcome back! Use Ctrl+1 for Activities, Ctrl+2 for Bookings",
        "info"
      );
    }, 1000);
  }
});
