document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burgerMenu');
    const burgerNav = document.getElementById('burgerNav');

    burgerMenu.addEventListener('click', () => {
        burgerNav.classList.toggle('open');
    });
});