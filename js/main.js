import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, orderBy, query } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEtw-mrf6PPOaCxtpEJeL8swkG0GgQ8Jc",
  authDomain: "infotech-e1174.firebasestorage.app",
  projectId: "infotech-e1174",
  storageBucket: "infotech-e1174.firebasestorage.app",
  messagingSenderId: "243395836512",
  appId: "1:243395836512:web:3d0705c6bcaf0fe452a105"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -------------------- Page Loader --------------------
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});

// -------------------- Dark Mode Toggle --------------------
const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });
}

// -------------------- WhatsApp Float --------------------
window.startProject = () => {
  const phone = "918221826243";
  const msg = "Hi, I want to start a project for my website. Please share your expertise and pricing.";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
};

// -------------------- Contact Form --------------------
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    await addDoc(collection(db, "contactMessages"), { name, email, message, timestamp: serverTimestamp() });
    alert("Message sent! We'll contact you soon.");
    contactForm.reset();
  });
}

// -------------------- Newsletter --------------------
const newsletterForm = document.getElementById("newsletterForm");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail").value;
    await addDoc(collection(db, "newsletter"), { email, timestamp: serverTimestamp() });
    alert("Subscribed successfully!");
    newsletterForm.reset();
  });
}

// -------------------- Portfolio Filter & Lightbox --------------------
if (document.getElementById("portfolioGrid")) {
  let portfolioItems = [];
  async function loadPortfolio() {
    const q = query(collection(db, "portfolioItems"));
    const snap = await getDocs(q);
    portfolioItems = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderPortfolio("all");
  }
  window.filterPortfolio = (category) => {
    renderPortfolio(category);
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.filter === category);
    });
  };
  function renderPortfolio(category) {
    const grid = document.getElementById("portfolioGrid");
    const filtered = category === "all" ? portfolioItems : portfolioItems.filter(item => item.category === category);
    grid.innerHTML = filtered.map(item => `
      <div class="portfolio-item" onclick="openLightbox('${item.image}')">
        <img src="${item.image}" loading="lazy" alt="${item.title}">
        <div style="padding:1rem"><h3>${item.title}</h3><p>${item.description || ""}</p></div>
      </div>
    `).join("");
  }
  window.openLightbox = (src) => {
    const lb = document.getElementById("lightbox");
    lb.querySelector("img").src = src;
    lb.classList.add("active");
  };
  window.closeLightbox = () => document.getElementById("lightbox").classList.remove("active");
  loadPortfolio();
}

// -------------------- Blog Listing (with skeleton) --------------------
if (document.getElementById("blogList")) {
  async function loadBlogs() {
    const container = document.getElementById("blogList");
    container.innerHTML = Array(3).fill(`<div class="skeleton" style="height:200px; background:#e5e7eb; margin-bottom:1rem; border-radius:1rem;"></div>`).join("");
    const q = query(collection(db, "blogPosts"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    const posts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    container.innerHTML = posts.map(post => `
      <div class="blog-card" style="background:var(--surface); border-radius:1rem; overflow:hidden; margin-bottom:1.5rem;">
        <img src="${post.image}" style="width:100%; height:200px; object-fit:cover;">
        <div style="padding:1rem">
          <h3>${post.title}</h3>
          <p>${post.excerpt || post.content.substring(0,100)}...</p>
          <a href="blog-post.html?id=${post.id}" class="btn btn-outline">Read More</a>
        </div>
      </div>
    `).join("");
  }
  loadBlogs();
}

// -------------------- Single Blog Post --------------------
if (document.getElementById("singlePost")) {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  if (postId) {
    const docRef = doc(db, "blogPosts", postId);
    getDoc(docRef).then(doc => {
      if (doc.exists) {
        const post = doc.data();
        document.getElementById("singlePost").innerHTML = `
          <h1>${post.title}</h1>
          <img src="${post.image}" style="width:100%; max-height:400px; object-fit:cover; border-radius:1rem; margin:1rem 0;">
          <div>${post.content}</div>
        `;
      } else { document.getElementById("singlePost").innerHTML = "<p>Post not found.</p>"; }
    });
  }
}

// -------------------- Admin Panel --------------------
if (window.location.pathname.includes("admin.html")) {
  const loginDiv = document.getElementById("adminLogin");
  const dashboard = document.getElementById("adminDashboard");
  const loginBtn = document.getElementById("loginBtn");
  const messagesDiv = document.getElementById("messagesList");
  const blogListDiv = document.getElementById("blogListAdmin");
  const portfolioListDiv = document.getElementById("portfolioListAdmin");
  
  if (loginBtn) {
    loginBtn.onclick = () => {
      if (document.getElementById("adminPassword").value === "admin123") {
        loginDiv.style.display = "none";
        dashboard.style.display = "block";
        loadMessages();
        loadBlogsAdmin();
        loadPortfolioAdmin();
      } else alert("Wrong password");
    };
  }
  async function loadMessages() {
    const q = query(collection(db, "contactMessages"), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    messagesDiv.innerHTML = snap.docs.map(doc => `
      <div class="message-card"><strong>${doc.data().name}</strong> (${doc.data().email})<br>${doc.data().message}<br><small>${doc.data().timestamp?.toDate()}</small></div>
    `).join("");
  }
  async function loadBlogsAdmin() {
    const snap = await getDocs(collection(db, "blogPosts"));
    blogListDiv.innerHTML = snap.docs.map(doc => `
      <div><strong>${doc.data().title}</strong> <button onclick="deleteDoc(doc(db,'blogPosts','${doc.id}'))">Delete</button></div>
    `).join("");
  }
  async function loadPortfolioAdmin() { /* similar */ }
  
  // Add blog post form
  const blogForm = document.getElementById("addBlogForm");
  if (blogForm) {
    blogForm.onsubmit = async (e) => {
      e.preventDefault();
      await addDoc(collection(db, "blogPosts"), {
        title: document.getElementById("blogTitle").value,
        content: document.getElementById("blogContent").value,
        image: document.getElementById("blogImage").value,
        excerpt: document.getElementById("blogExcerpt").value,
        date: serverTimestamp()
      });
      alert("Blog added!");
      blogForm.reset();
      loadBlogsAdmin();
    };
  }
}
