let viewDpChange = document.getElementById('ChangeDp');
viewDpChange.addEventListener('click', () => {
    document.getElementById('modalClass').classList.toggle('view')
});
document.getElementById('hideContent').addEventListener('click', () => {
    console.log('clicked')
    document.getElementById('modelClass').style.display = 'none';
})
document.getElementById('uploadImage').addEventListener('change', function () {
    var oFReader = new FileReader();
    oFReader.readAsDataURL(document.getElementById("uploadImage").files[0]);

    oFReader.onload = function (oFREvent) {
        document.getElementById("uploadPreview").src = oFREvent.target.result;
    };
})