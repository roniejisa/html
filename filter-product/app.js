const apiURL = "https://fakestoreapi.com/products";
const listProduct = document.querySelector(".product");
const search = document.querySelector(".search input");

async function fetchData() {
    let data = localStorage.getItem("PRODUCT") ? JSON.parse(localStorage.getItem("PRODUCT")) : await fetch(apiURL).then((res) => res.json());
    localStorage.setItem("PRODUCT", JSON.stringify(data));
    listProduct.innerHTML = data
        .map(
            (item) => ` <div class="product__item">
<img src="${item.image}" alt="${item.description}" />
<div class="content">
    <p class="name">${item.title}</p>
    <p class="price">$ ${item.price}</p>
</div>
</div>`
        )
        .join("");
}
fetchData();

search.oninput = function (e) {
    let txtSearch = e.target.value.trim().toLowerCase();
    let productInDom = listProduct.querySelectorAll(".product__item .content");
    productInDom.forEach((item) => {
        if (txtSearch == "") {
            item.closest(".product__item").style.display = "block";
        } else {
            if (item.innerText.toLowerCase().includes(txtSearch)) {
                item.closest(".product__item").style.display = "block";
            } else {
                item.closest(".product__item").style.display = "none";
            }
        }
    });
};
