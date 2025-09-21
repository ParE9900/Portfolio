document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const toggleIcon = themeToggle.querySelector("i");
  const nav = document.querySelector(".navbar");

  function setIconForTheme(theme) {
    if (theme === "light") {
      toggleIcon.classList.remove("fa-sun");
      toggleIcon.classList.add("fa-moon");
    } else {
      toggleIcon.classList.remove("fa-moon");
      toggleIcon.classList.add("fa-sun");
    }
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    body.classList.add(savedTheme + "-mode");
    setIconForTheme(savedTheme);
  } else {
    setIconForTheme("dark");
  }

  themeToggle.addEventListener("click", () => {
    if (body.classList.contains("light-mode")) {
      body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
      setIconForTheme("dark");
    } else {
      body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
      setIconForTheme("light");
    }
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("navbar-scrolled");
    } else {
      nav.classList.remove("navbar-scrolled");
    }
  });

  function smoothScrollTo(target, duration) {
    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - 100;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }
    requestAnimationFrame(animation);
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href").length > 1) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          smoothScrollTo(targetElement, 1000);
        }
      }
    });
  });

  const sections = document.querySelectorAll("section[id]");
  function navHighlighter() {
    let scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 110;
      let sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        let navLink = document.querySelector(
          ".nav-link[href*=" + sectionId + "]"
        );
        if (navLink) navLink.classList.add("active");
      } else {
        let navLink = document.querySelector(
          ".nav-link[href*=" + sectionId + "]"
        );
        if (navLink) navLink.classList.remove("active");
      }
    });
  }
  window.addEventListener("scroll", navHighlighter);
  navHighlighter();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  document
    .querySelectorAll(".section, .project-card, .skill-card, .profile-img")
    .forEach((el) => {
      el.classList.add("fade-in");
      observer.observe(el);
    });

  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const serviceID = "YOUR_SERVICE_ID";
      const templateID = "YOUR_TEMPLATE_ID";
      const publicKey = "YOUR_PUBLIC_KEY";

      emailjs.sendForm(serviceID, templateID, this, publicKey).then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          alert("Message sent successfully!");
          contactForm.reset();
        },
        (error) => {
          console.log("FAILED...", error);
          alert("Failed to send message. Please try again.");
        }
      );
    });
  }
});
