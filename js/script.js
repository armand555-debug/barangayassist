
//BarangayAssist

document.addEventListener("DOMContentLoaded", function () {
    initHeaderOffset();
    initMobileMenu();
    initActiveNavLink();
    initHeroSlider();
    initBackToTop();
    initLearnMore();
    initAlerts();
    initRequestForm();
    initInquiryForm();
});


//1. HEADER OFFSET
function updateHeaderOffset() {
    var header = document.getElementById("header");
    if (!header) return;

    document.documentElement.style.setProperty(
        "--header-offset",
        header.offsetHeight + "px"
    );
}

function initHeaderOffset() {
    updateHeaderOffset();
    window.addEventListener("resize", updateHeaderOffset);
    window.addEventListener("load", updateHeaderOffset); // logo may change the height
}


//2. MOBILE MENU (hamburger button on small phones)
function initMobileMenu() {
    var toggle = document.getElementById("menuToggle");
    var links = document.getElementById("navLinks");
    if (!toggle || !links) return;

    function closeMenu() {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
        var isOpen = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    });


    links.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            closeMenu();
            updateHeaderOffset();
        });
    });


    window.addEventListener("resize", function () {
        if (window.innerWidth > 480) closeMenu();
    });
}


//3. ACTIVE NAV LINK (highlights the section being viewed)
function initActiveNavLink() {
    var navLinks = document.querySelectorAll(".nav-links a[href^='#']");
    var sections = document.querySelectorAll("main section[id]");
    if (!navLinks.length || !sections.length || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            navLinks.forEach(function (link) {
                var isCurrent = link.getAttribute("href") === "#" + entry.target.id;
                link.classList.toggle("active", isCurrent);
            });
        });
    }, { rootMargin: "-40% 0px -55% 0px" });

    sections.forEach(function (section) {
        observer.observe(section);
    });
}


//4. HERO ARROW BUTTONS
function initHeroSlider() {
    var hero = document.querySelector(".hero");
    var prev = document.querySelector(".hero .prev");
    var next = document.querySelector(".hero .next");
    if (!hero || !prev || !next) return;

    var slides = ["image/brgy_hall.png"];
    var current = 0;

    function showSlide(index) {
        current = (index + slides.length) % slides.length;
        hero.style.backgroundImage = 'url("' + slides[current] + '")';
    }

    if (slides.length > 1) {
        prev.addEventListener("click", function () { showSlide(current - 1); });
        next.addEventListener("click", function () { showSlide(current + 1); });
    }
}


//5. FLOATING BACK TO TOP BUTTON
function initBackToTop() {
    var button = document.getElementById("backToTop");
    if (!button) return;

    function toggleButton() {
        var scrolled = window.pageYOffset || document.documentElement.scrollTop;
        button.classList.toggle("show", scrolled > 300);
    }

    window.addEventListener("scroll", toggleButton, { passive: true });
    toggleButton();

    button.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


//5b. "LEARN MORE" / "READ MORE" BUTTONS
function initLearnMore() {
    var buttons = document.querySelectorAll("[data-more]");
    if (!buttons.length) return;

    buttons.forEach(function (button) {
        var defaultLabel = button.textContent;

        button.addEventListener("click", function () {
            var card = button.closest(".info-card, .featured-card, .notice-item");
            var more = card ? card.querySelector(".card-more") : null;
            if (!more) return;

            var isOpen = more.hidden;
            more.hidden = !more.hidden;
            button.setAttribute("aria-expanded", String(isOpen));
            button.textContent = isOpen ? "Show Less" : defaultLabel;
        });
    });
}


//6. SUCCESS ALERTS (request form + contact/inquiry form)
var lastFocusedElement = null;

function openAlert(box) {
    box = box || document.getElementById("successAlert");
    if (!box) return;

    lastFocusedElement = document.activeElement;
    box.style.display = "flex";

    var okButton = box.querySelector("button");
    if (okButton) okButton.focus();
}

function closeAlert(box) {
    if (!box || !box.nodeType) box = document.getElementById("successAlert");
    if (!box) return;

    box.style.display = "none";

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
    }
}

function initAlerts() {
    var boxes = document.querySelectorAll(".success-alert");
    if (!boxes.length) return;

    boxes.forEach(function (box) {
        var okButton = box.querySelector("button");
        if (okButton) {
            okButton.addEventListener("click", function () { closeAlert(box); });
        }

        box.addEventListener("click", function (event) {
            if (event.target === box) closeAlert(box);
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        boxes.forEach(function (box) {
            if (box.style.display === "flex") closeAlert(box);
        });
    });
}


//7. REQUEST FORM (form.html)
function initRequestForm() {
    var form = document.getElementById("requestForm");
    var errorMessage = document.getElementById("requestError");

    if (!form) return;

    var checkboxes = form.querySelectorAll("input[name='request']");

    function hasRequestType() {
        return Array.prototype.some.call(checkboxes, function (box) {
            return box.checked;
        });
    }

    function hideError() {
        if (errorMessage) errorMessage.hidden = true;
    }

    checkboxes.forEach(function (box) {
        box.addEventListener("change", hideError);
    });

    form.addEventListener("reset", hideError);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (checkboxes.length && !hasRequestType()) {
            if (errorMessage) errorMessage.hidden = false;
            checkboxes[0].focus();
            return;
        }

        hideError();
        openAlert(document.getElementById("successAlert"));
        form.reset();
    });
}


//8. CONTACT / INQUIRY FORM (Contact Us section in index.html)
function initInquiryForm() {
    var form = document.getElementById("inquiryForm");

    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        openAlert(document.getElementById("inquiryAlert"));
        form.reset();
    });
}
