// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Firebase Config (User Provided)
const firebaseConfig = {
  apiKey: "AIzaSyAEtw-mrf6PPOaCxtpEJeL8swkG0GgQ8Jc",
  authDomain: "infotech-e1174.firebasestorage.app",
  projectId: "infotech-e1174",
  storageBucket: "infotech-e1174.firebasestorage.app",
  messagingSenderId: "243395836512",
  appId: "1:243395836512:web:3d0705c6bcaf0fe452a105"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Page Loader
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }
});

// WhatsApp Function (Used Across Pages)
window.startProject = () => {
  const phone = "918221826243";
  const message = "Hi, I want to start a project for my website. Please share your expertise and pricing.";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
};

// Newsletter Subscription (Firestore)
const newsletterForm = document.getElementById("newsletterForm");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail").value;
    try {
      await addDoc(collection(db, "newsletter"), {
        email: email,
        timestamp: serverTimestamp()
      });
      alert("✅ Subscribed successfully! Thank you.");
      newsletterForm.reset();
    } catch (error) {
      console.error("Newsletter error:", error);
      alert("❌ Subscription failed. Please try again.");
    }
  });
}

// Portfolio Data (Live Projects)
const portfolioData = [
  {
    title: "BDS Ayurvedic Physio & Yoga Centre",
    description: "Holistic healthcare clinic for natural healing and wellness.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
    link: "https://drgagan10-arch.github.io/BDS-AYURVEDIC-PHYSIO-YOGA-CENTRE/"
  },
  {
    title: "RideWave Cab Service",
    description: "Premium cab & taxi service in Amritsar with outstation trips.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600",
    link: "https://drgagan10-arch.github.io/RideWave.in/"
  },
  {
    title: "BDS Science & Maths Academy",
    description: "Coaching for Class 5-10, +1/+2 Biology & NEET preparation.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600",
    link: "https://drgagan10-arch.github.io/Baba-Deep-Singh-Science-Maths-Academy/"
  },
  {
    title: "BDS Academy Online",
    description: "Live interactive classes with expert faculty & doubt solving.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
    link: "https://drgagan10-arch.github.io/BDS-Science-Maths-Academy-Online/index.html"
  },
  {
    title: "MarketHub Online Store",
    description: "E-commerce platform for trending products & secure shopping.",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600",
    link: "https://drgagan10-arch.github.io/Market-Hub/index.html"
  }
];

// Render Portfolio
function renderPortfolio() {
  const portfolioGrid = document.getElementById("portfolioGrid");
  if (portfolioGrid) {
    portfolioGrid.innerHTML = portfolioData.map(project => `
      <div class="portfolio-card">
        <img src="${project.image}" alt="${project.title}" loading="lazy">
        <div class="portfolio-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="portfolio-link">
            View Project <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `).join("");
  }
}

// Call render function when page loads
document.addEventListener("DOMContentLoaded", () => {
  renderPortfolio();
});

// Mobile Menu Toggle
const menuBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// Close mobile menu when clicking a link
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    if (navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
    }
  });
});

// Set Active Nav Link
const currentPage = window.location.pathname.split("/").pop();
if (currentPage === "" || currentPage === "index.html") {
  document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.getAttribute("href") === "index.html") {
      link.classList.add("active");
    }
  });
}
