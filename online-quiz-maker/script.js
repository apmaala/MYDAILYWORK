document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const createQuizBtn = document.getElementById('createQuizBtn');
    const takeQuizBtn = document.getElementById('takeQuizBtn');
    const navbar = document.querySelector('.navbar');

    // Button click handlers
    if (createQuizBtn) {
        createQuizBtn.addEventListener('click', () => {
            window.location.href = 'create-quiz.html';
        });
    }

    if (takeQuizBtn) {
        takeQuizBtn.addEventListener('click', () => {
            window.location.href = 'quizzes.html';
        });
    }

    // Handle Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = '0 10px 15px -10px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.ripple');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;

            let ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            this.appendChild(ripples);

            setTimeout(() => {
                ripples.remove();
            }, 1000);
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateOnScroll = document.querySelectorAll('.fade-in');
    animateOnScroll.forEach(el => observer.observe(el));
});
