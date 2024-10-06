document.querySelector('a[href="#home"]').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.querySelector('a[href="#about-us"]').addEventListener('click', function(e) {
    e.preventDefault();
    const aboutSection = document.querySelector('#about-us');
    window.scrollTo({
        top: aboutSection.offsetTop,
        behavior: 'smooth'
    });
});
