const products = [];
const loader = document.getElementById("loader");
const buttonPay = document.getElementById("checkout");
const category = document.getElementById("category");
const pageContent = document.getElementById("page-content");
const buttonLogin = document.getElementById("button-login");
const addProduct = document.getElementById("add-product");
const categoryList = document.getElementById("categoryList");
const categoryListProductEdit = document.getElementById(
  "categoryList-edit-product"
);
const buttonLogout = document.getElementById("button-logout");
const addProductForm = document.getElementById("add-product-form");
const editproductForm = document.getElementById("edit-product-form");
const toggleFormAddProduct = document.getElementById("toggle-form-add-product");
const REGEX_FLOAT_NUMBERS = /^[+-]?\d+(\.\d+)?$/;
let isFormProductOpen = false;

// campos del modal editar
const titleModal = document.getElementById("name-edit-product");
const priceModal = document.getElementById("price-edit-product");
const imageModal = document.getElementById("image-edit-product");
const categoryModal = document.getElementById("categoryList-edit-product");
const imageEditProductPreview = document.getElementById(
  "image-edit-product-preview"
);

const CATEGORY_LIST = [
  "Todos",
  "Viveres",
  "Licores",
  "Higiene",
  "Cigarros",
  "Otros",
];
let total = 0;
let totalFixed = 0;

function imageToBase64(imageFile) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = (err) => reject(err);
    imageFile && fr.readAsDataURL(imageFile);
  });
}

function add(product, price) {
  products.push(product);
  total = total + price;
  totalFixed = total.toFixed(2);
  buttonPay.innerHTML = `Pagar $${totalFixed}`;
}

function pay() {
  alert(`Total a pagar: ${totalFixed}$`);
}

function addPriceOnclick() {
  const buttons = document.querySelectorAll(".button-add");
  buttons.forEach((button) => {
    button.onclick = () => {
      const price = parseFloat(button.getAttribute("data-price"));
      const product = parseInt(button.getAttribute("data-productid"));
      add(product, price);
    };
  });
}

function editProductOnlick() {
  const buttons = document.querySelectorAll(".button-edit");
  buttons.forEach((button) => {
    button.onclick = editProductHandler;
  });
}

function deleteProductOnclick() {
  const buttons = document.querySelectorAll(".button-delete");
  buttons.forEach((button) => {
    button.onclick = deleteProductHanlder;
  });
}

async function deleteProductHanlder(e) {
  const productId = e.target.getAttribute("data-productid");
  try {
    const res = await axios.delete(`${API_URL}/product/${productId}`);
    if (res.data?.ok) {
      alert("El producto fue eliminado");
      window.location.href="index.html";
    }
  } catch (error) {
    if (error.response) {
      if (error.response.data?.error) {
        alert(error.response.data.data);
      }
    }
  }
}

async function editProductHandler(e) {
  const productId = e.target.getAttribute("data-productid");
  const productContainer = document.getElementById(productId);
  const productIdInput = document.getElementById("productid");
  const title = productContainer.querySelector("h3").innerHTML;
  const price = productContainer.querySelector("h1").innerHTML;
  const img = productContainer.querySelector("img").src;
  const category =
    productContainer.querySelector(".product-category").innerHTML;

  titleModal.value = title;
  priceModal.value = parseFloat(price.replace("$", ""));
  imageEditProductPreview.src = img;
  categoryModal.value = category;
  productIdInput.value = productId;
}

async function editProductOnSubmit(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const productId = e.target.productid.value;
  data.append("image", imageEditProductPreview.src);
  try {
    const res = await axios.put(`${API_URL}/product/${productId}`, data);
    if (res.data?.ok) {
      alert("El producto fue editado");
      window.location.href="index.html";
    }
  } catch (error) {
    if (error.response) {
      if (error.response.data?.error) {
        alert(error.response.data.data);
      }
    }
  }
}

async function changeImageModal(e) {
  const imageFile = e.target.files[0];
  const base64 = await imageToBase64(imageFile);
  imageEditProductPreview.src = base64;
}

function onChangeCategory(category, productsList) {
  if (category === "todos") {
    return displayproducts(productsList);
  }
  const filterproducts = productsList.filter((product) => {
    return product.category === category;
  });
  displayproducts(filterproducts);
}

function addCategories(element) {
  let categoriesHTML = ``;
  CATEGORY_LIST.forEach((element) => {
    categoriesHTML += `<option value="${element.toLocaleLowerCase()}">${element}</option>`;
  });
  element.innerHTML = categoriesHTML;
}

function displayproducts(productlist) {
  let productsHTML = ``;

  productlist.forEach((element) => {
    const { name, image, price, _id, category } = element;
    const buttons = getToken()
      ? `<a href="#open-modal" style="display:block; width:100%; text-decoration: none;">
            <button 
              class="button-edit" 
              data-productid="${_id}">
              Editar producto
            </button>
          </a>

          <button 
              class="button-delete" 
              data-productid="${_id}">
              Eliminar producto
          </button>`
      : "";
    productsHTML += `<div class="product-container" id="${_id}">
    
			<h3>${name}</h3>
      <p class="product-category">${category ? category : "Sin categoría"}</p>
			<img src="${image}" />
			<h1>$${price}</h1>
      <div class="buttons">
        <button 
          class="button-add" 
          data-price="${price}"
          data-productid="${_id}">
          Agregar al carrito
        </button>
        ${buttons}
      </div>
		</div>`;
  });

  if (productlist.length === 0) {
    productsHTML = `<h3 style="margin-top: 1rem;">No hay productos de esa categoría</h3>`;
  }
  pageContent.innerHTML = productsHTML;
  addPriceOnclick();
  if (getToken()) {
    deleteProductOnclick();
    editProductOnlick();
    editproductForm.addEventListener("submit", editProductOnSubmit);
  }
}

async function addProductHandler(e) {
  e.preventDefault();
  const image = e.target.image.files[0];
  const price = parseFloat(e.target.price.value);

  if (!REGEX_FLOAT_NUMBERS.test(price)) {
    return alert("Debe colocar un precio correcto, verifique el campo.");
  }

  const imageBase64 = await imageToBase64(image);
  const formData = new FormData(e.target);
  formData.append("image", imageBase64);

  try {
    const res = await axios.post(`${API_URL}/product/`, formData);
    if (res.data?.ok) {
      alert("El producto fue agregado");
      window.location.href="index.html";
    }
  } catch (error) {
    if (error.response) {
      if (error.response.data?.error) {
        alert(error.response.data.data);
      }
    }
  }
}

function toggleFormAddProductHandler() {
  addProductForm.classList.toggle("f-hidden");
  isFormProductOpen = !isFormProductOpen;
  toggleFormAddProduct.innerHTML = isFormProductOpen
    ? "Cerrar"
    : "Agregar producto";
}

function logout() {
  removeToken();
  window.location.href="index.html";
}

window.onload = async () => {
  if (getToken()) {
    buttonLogin.remove();
    buttonLogout.addEventListener("click", logout);
    addProductForm.addEventListener("submit", addProductHandler);
    addCategories(categoryList);
    addCategories(categoryListProductEdit);
  } else {
    addProduct.remove();
    buttonLogout.remove();
    addProductForm.remove();
    toggleFormAddProduct.remove();
  }
  const res = await axios.get(`${API_URL}/product`);
  const productlist = res?.data?.data || [];
  loader.remove();
  pageContent.classList.remove("is-loading");
  displayproducts(productlist);
  addCategories(category);

  buttonPay.addEventListener("click", pay);
  category.addEventListener("change", (e) => {
    onChangeCategory(e.target.value, productlist);
  });

  if (getToken()) {
    deleteProductOnclick();
    editProductOnlick();
    imageModal.addEventListener("change", changeImageModal);
    toggleFormAddProduct.addEventListener("click", toggleFormAddProductHandler);
    editproductForm.addEventListener("submit", editProductOnSubmit);
  }
};
