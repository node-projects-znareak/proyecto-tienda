const products = [];
const loader = document.getElementById("loader");
const buttonPay = document.getElementById("checkout");
const category = document.getElementById("category");
const pageContent = document.getElementById("page-content");
const buttonLogin = document.getElementById("button-login");
const addProduct = document.getElementById("add-product");
const categoryList = document.getElementById("categoryList");
const buttonLogout = document.getElementById("button-logout");
const addProductForm = document.getElementById("add-product-form");
const toggleFormAddProduct = document.getElementById("toggle-form-add-product");
const REGEX_FLOAT_NUMBERS = /^[+-]?\d+(\.\d+)?$/;
let isFormProductOpen = false;

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
    fr.readAsDataURL(imageFile);
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

function deleteProductOnclick() {
  const buttons = document.querySelectorAll(".button-delete");
  buttons.forEach((button) => {
    button.onclick = deleteProductHanlder;
  });
}

async function deleteProductHanlder(e) {
  const productId = e.target.getAttribute("data-productid");
  try {
    const res = await axios.delete(`/api/product/${productId}`);
    alert("El producto fue eliminado");
    window.location.reload();
  } catch (error) {
    if (error.response) {
      if (error.response.data?.error) {
        alert(error.response.data.data);
      }
    } else {
      alert("Error desconocido, intente más tarde");
    }
  }
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
    const { name, image, price, _id } = element;
    const buttons = getToken()
      ? `<button 
            class="button-add" 
            data-productid="${_id}">
            Editar producto
         </button>

          <button 
              class="button-delete" 
              data-productid="${_id}">
              Eliminar producto
          </button>`
      : "";
    productsHTML += `<div class="product-container">
    
			<h3>${name}</h3>
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
    const res = await axios.post("/api/product/", formData);
    alert("El producto fue agregado");
    window.location.reload();
  } catch (error) {
    if (error.response) {
      if (error.response.data?.error) {
        alert(error.response.data.data);
      }
    } else {
      alert("Error desconocido, intente más tarde");
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
  window.location.reload();
}

window.onload = async () => {
  if (getToken()) {
    buttonLogin.remove();
    buttonLogout.addEventListener("click", logout);
    addProductForm.addEventListener("submit", addProductHandler);
    addCategories(categoryList);
  } else {
    addProduct.remove();
    buttonLogout.remove();
    addProductForm.remove();
    toggleFormAddProduct.remove();
  }
  const res = await axios.get("/api/product");
  const productlist = res?.data?.data || [];
  loader.remove();
  pageContent.classList.remove("is-loading");
  displayproducts(productlist);
  addCategories(category);

  buttonPay.addEventListener("click", pay);
  category.addEventListener("change", (e) => {
    onChangeCategory(e.target.value, productlist);
  });

  toggleFormAddProduct.addEventListener("click", toggleFormAddProductHandler);
  if (getToken()) {
    deleteProductOnclick();
  }
};
