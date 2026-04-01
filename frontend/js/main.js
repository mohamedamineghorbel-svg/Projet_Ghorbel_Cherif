document.addEventListener('DOMContentLoaded', () => {
    console.log("SDGconnect Frontend Loaded");

    // Simple sticky navbar effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
            } else {
                navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
            }
        });
    }
});
