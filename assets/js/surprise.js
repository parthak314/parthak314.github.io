document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const triggerCelebrationBtn = document.getElementById('trigger-celebration-btn');
    let confettiInstance;

    triggerCelebrationBtn.addEventListener('click', function() {
        const fullname = contactForm.querySelector('input[name="fullname"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;

        if (fullname.toLowerCase() === 'baggu20' && email.toLowerCase() === 'guitar.mariokart@birthday.com' && message.toLowerCase() === 'just think about it in words') {
            triggerCelebration();
        }
    });

    window.triggerCelebration = function() {
        // Trigger confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Unfurl the scroll
        const scroll = document.getElementById('scroll');
        scroll.classList.remove('hidden');
        setTimeout(() => {
            scroll.classList.add('visible');
        }, 100); // Small delay to trigger the animation
    };

    document.addEventListener('click', function() {
        // Hide the scroll
        const scroll = document.getElementById('scroll');
        scroll.classList.remove('visible');
        setTimeout(() => {
            scroll.classList.add('hidden');
        }, 500); // Small delay to allow the animation to complete

        // Stop the confetti
        if (confettiInstance) {
            confettiInstance.reset();
        }
    });
});
