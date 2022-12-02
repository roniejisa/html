const input = document.querySelector("input");
const preview = document.querySelector("label");
let hasURL = false;
input.onchange = function (e) {
    let img = preview.querySelector("img");
    if (!img) {
        img = document.createElement("img");
    }
    var file = upload.files[0];
    if (!file) return;

    if (!file.name.endsWith(".jpg")) {
        return alert("Ảnh phải là dạng JPG");
    }

    if (!file.size / (1024 * 1024) > 5) {
        return alert("Chỉ được tải danh lên < 5 MB");
    }

    //Base64

    // var fileReader = new FileReader();
    // fileReader.readAsDataURL(file);
    // fileReader.onloadend = function (e) {
    //     console.log(e);
    //     img.src = e.srcElement.result;
    // };

    // URL Blob
    // if (hasURL) {
    //     URL.revokeObjectURL(img.src);
    // }
    // img.src = URL.createObjectURL(file);
    // hasURL = true;
    // preview.appendChild(img);
};
