const btntoggle = document.querySelector('.toggle-btn');
console.log (btntoggle);
btntoggle.addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('active');
});
