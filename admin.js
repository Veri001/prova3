/*
document.addEventListener("DOMContentLoaded", loadProducts);

function loadProducts() {
    const products = JSON.parse(localStorage.getItem("rioMareProducts")) || [];
    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    products.forEach((product, index) => {
        const productItem = document.createElement("div");
        productItem.innerHTML = `
            <strong>${product.name}</strong> - ${product.price}$<br>
            <img src="${product.image}" style="width: 50px; height: 50px; object-fit: cover;"><br>
            <button onclick="editProduct(${index})">✏️ Modifiko</button>
            <button onclick="deleteProduct(${index})">❌ Fshij</button>
            <hr>
        `;
        productList.appendChild(productItem);
    });
}

function editProduct(index) {
    const products = JSON.parse(localStorage.getItem("rioMareProducts")) || [];
    const product = products[index];

    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productImageFile").value = ""; // File input duhet bosh

    document.getElementById("productForm").onsubmit = async (e) => {
        e.preventDefault();
        const updatedProduct = await getProductFromForm(product.image); // Ruaj imazhin e vjetër nëse s'ndryshohet
        products[index] = updatedProduct;
        localStorage.setItem("rioMareProducts", JSON.stringify(products));
        loadProducts();
        resetForm();
    };
}

async function getProductFromForm(existingImage = null) {
    const name = document.getElementById("productName").value;
    const price = parseFloat(document.getElementById("productPrice").value);

    const fileInput = document.getElementById("productImageFile");
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve({
                    name: name,
                    price: price,
                    image: event.target.result // Base64 image
                });
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    } else {
        // Nëse s'ka file të ri, përdor imazhin ekzistues (në rast editimi)
        return {
            name: name,
            price: price,
            image: existingImage
        };
    }
}

document.getElementById("productForm").onsubmit = async (e) => {
    e.preventDefault();
    const products = JSON.parse(localStorage.getItem("rioMareProducts")) || [];
    const newProduct = await getProductFromForm();
    products.push(newProduct);
    localStorage.setItem("rioMareProducts", JSON.stringify(products));
    loadProducts();
    resetForm();
};

function deleteProduct(index) {
    const products = JSON.parse(localStorage.getItem("rioMareProducts")) || [];
    products.splice(index, 1);
    localStorage.setItem("rioMareProducts", JSON.stringify(products));
    loadProducts();
}

function resetForm() {
    document.getElementById("productForm").reset();
    document.getElementById("productForm").onsubmit = defaultAddProduct;
}

async function defaultAddProduct(e) {
    e.preventDefault();
    const products = JSON.parse(localStorage.getItem("rioMareProducts")) || [];
    const newProduct = await getProductFromForm();
    products.push(newProduct);
    localStorage.setItem("rioMareProducts", JSON.stringify(products));
    loadProducts();
    resetForm();
}

// Rikthehet në këtë funksion pasi mbaron editimi
document.getElementById("productForm").onsubmit = defaultAddProduct;

if (!localStorage.getItem("rioMareProducts")) {
    localStorage.setItem("rioMareProducts", JSON.stringify([
        {name: "Rio Mare Tonno Pisselli 2*160gr", price: 100, image: "img/rio/RioMare.png"},
        {name: "Rio Mare Tonno dkjf 2*160gr", price: 100, image: "img/rio/rio2.png"}
    ]));
}


*/

if (!localStorage.getItem("rioMareProducts")) {
    localStorage.setItem("rioMareProducts", JSON.stringify([
        {name: "Rio Mare Tonno Pisselli 2*160gr", price: 100, image: "img/rio/RioMare.png"},
        {name: "Rio Mare Tonno dkjf 2*160gr", price: 100, image: "img/rio/rio2.png"}
    ]));
}if (!localStorage.getItem("rioMareProducts")) {
    localStorage.setItem("rioMareProducts", JSON.stringify([
        {name: "Rio Mare Tonno Pisselli 2*160gr", code: "RM001", price: 100, image: "img/rio/RioMare.png"},
        {name: "Rio Mare Tonno dkjf 2*160gr", code: "RM002", price: 100, image: "img/rio/rio2.png"}
    ]));
}

document.addEventListener("DOMContentLoaded", loadProducts);

let editingIndex = null; // Ky tregon nëse po modifikojmë apo shtojmë produkt të ri

function loadProducts() {
    const products = JSON.parse(localStorage.getItem("rioMareProducts")) || [];
    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    products.forEach((product, index) => {
        const productItem = document.createElement("div");
        productItem.innerHTML = `
            <strong>${product.name}</strong> (${product.code}) - ${product.price}$<br> <!-- Shtimi i kodit -->
            <img src="${product.image}" style="width: 50px; height: 50px;"><br>
            <button onclick="editProduct(${index})">✏️ Modifiko</button>
            <button onclick="deleteProduct(${index})">❌ Fshij</button>
            <hr>
        `;
        productList.appendChild(productItem);
    });
}

function editProduct(index) {
    const products = JSON.parse(localStorage.getItem("rioMareProducts")) || [];
    const product = products[index];

    // Mbush formën me të dhënat ekzistuese
    document.getElementById("productName").value = product.name;
    document.getElementById("productCode").value = product.code; // Shtimi i kodit
    document.getElementById("productPrice").value = product.price;

    // Fusha e file-it mbetet bosh (nuk lejohet plotësimi nga JS)
    document.getElementById("productImageFile").value = "";

    // Ruaj indeksin për të ditur që jemi në modalitetin "edit"
    editingIndex = index;
}

document.getElementById("productForm").onsubmit = async (e) => {
    e.preventDefault();

    const products = JSON.parse(localStorage.getItem("rioMareProducts")) || [];

    if (editingIndex !== null) {
        // Po modifikojmë produkt ekzistues
        const existingProduct = products[editingIndex];
        const updatedProduct = await getProductFromForm(existingProduct.image); // Përdorim foton ekzistuese nëse nuk ngarkohet e re
        products[editingIndex] = updatedProduct;
        editingIndex = null; // Pastro indikatorin e editimit
    } else {
        // Po shtojmë produkt të ri
        const newProduct = await getProductFromForm();
        products.push(newProduct);
    }

    localStorage.setItem("rioMareProducts", JSON.stringify(products));
    loadProducts();
    resetForm();
};

async function getProductFromForm(existingImage = null) {
    const name = document.getElementById("productName").value;
    const code = document.getElementById("productCode").value; // Merr kodin e produktit
    const price = parseFloat(document.getElementById("productPrice").value);

    const fileInput = document.getElementById("productImageFile");

    if (fileInput.files.length > 0) {
        // Nëse ka foto të re, lexojmë foton dhe e kthejmë në base64
        const file = fileInput.files[0];
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve({
                    name,
                    code, // Ruaj kodin e produktit
                    price,
                    image: event.target.result // Kjo është foto e re
                });
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    } else {
        // Nëse nuk ka foto të re, ruajmë foton ekzistuese
        if (existingImage) {
            return {
                name,
                code, // Ruaj kodin e produktit
                price,
                image: existingImage // Fotoja e vjetër
            };
        } else {
            alert('Ju lutem ngarkoni një foto!'); // Vetëm në rastin kur është shtim i ri dhe s'ka as foto
            throw new Error('Foto e detyrueshme për produkt të ri');
        }
    }
}

function deleteProduct(index) {
    const products = JSON.parse(localStorage.getItem("rioMareProducts")) || [];
    products.splice(index, 1);
    localStorage.setItem("rioMareProducts", JSON.stringify(products));
    loadProducts();
}

function resetForm() {
    document.getElementById("productForm").reset();
    editingIndex = null; // Pastro indikatorin e editimit
}