const API = "http://localhost:8000/phones";
const inpImg = document.querySelector("#inpImg");
const inpName = document.querySelector("#inpName");
const inpPrice = document.querySelector("#inpPrice");
const btnAdd = document.querySelector("#btnAdd");
const collapseThree = document.querySelector("#collapseThree");
const section2 = document.querySelector(".section2");
const inpSearch = document.querySelector("#inpSearch");
let searchValue = "";
let countPage = 1;
let currentPage = 1;

// ! -------------------------CREATE------------------------------
btnAdd.addEventListener("click", async () => {
  if (!inpImg.value.trim() || !inpName.value.trim() || !inpPrice.value.trim()) {
    alert("Введите данные!");
    return;
  }
  let newPhone = {
    phoneImg: inpImg.value,
    phoneName: inpName.value,
    phonePrice: inpPrice.value,
  };
  await createPhone(newPhone);
  inpImg.value = "";
  inpName.value = "";
  inpPrice.value = "";
  collapseThree.classList.toggle("show");
  await readPhones(); // Обновление данных после создания телефона
});

async function createPhone(phone) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(phone),
  });
}

// !------------------------READ--------------------------
async function readPhones() {
  const res = await fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=4`
  );
  const data = await res.json();
  section2.innerHTML = "";
  data.forEach((elem) => {
    section2.innerHTML += `
      <div class="card m-4 cardBook" style="width: 15rem;">
        <img style="height:300px" src="${elem.phoneImg}" alt="${elem.phoneName}">
        <div class="card-body">
          <h5 class="card-title">${elem.phoneName}</h5>
          <span>${elem.phonePrice}</span>
          <button type="button" class="btn btn-danger btnDelete" id="${elem.id}">Удалить</button>
          <button data-bs-toggle="modal" data-bs-target="#exampleModal" id="${elem.id}" type="button" class="btn btn-info btnEdit">Редактировать</button>
          <button type="button" class="btn btn-warning" id="${elem.id}" onclick="showDetail('${elem.phoneImg}', '${elem.phoneName}', '${elem.phonePrice}')">Детальный обзор</button>
        </div>
      </div>
    `;
  });
  await pageFunc();
}

// !-----------------------------------DELETE----------------------------------
document.addEventListener("click", async (e) => {
  const del_class = [...e.target.classList];
  let id = e.target.id;
  if (del_class.includes("btnDelete")) {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    await readPhones();
  }
});

// !------------------------EDIT----------------------------
const inpEditImg = document.querySelector("#inpEditImg");
const inpEditName = document.querySelector("#inpEditName");
const inpEditPrice = document.querySelector("#inpEditPrice");
const btnEditSave = document.querySelector("#btnEditSave");

document.addEventListener("click", async (e) => {
  let edit_class = [...e.target.classList];
  let id = e.target.id;
  if (edit_class.includes("btnEdit")) {
    const res = await fetch(`${API}/${id}`);
    const data = await res.json();
    inpEditImg.value = data.phoneImg;
    inpEditName.value = data.phoneName;
    inpEditPrice.value = data.phonePrice;
    btnEditSave.setAttribute("data-id", data.id); // Use data-id instead of id to avoid conflicts
  }
});

btnEditSave.addEventListener("click", async () => {
  if (
    !inpEditImg.value.trim() ||
    !inpEditName.value.trim() ||
    !inpEditPrice.value.trim()
  ) {
    alert("Введите данные!");
    return;
  }
  let editedPhone = {
    phoneImg: inpEditImg.value,
    phoneName: inpEditName.value,
    phonePrice: inpEditPrice.value,
  };
  const id = btnEditSave.getAttribute("data-id"); // Get the id from data-id
  await editPhone(editedPhone, id);
  await readPhones(); // Обновление данных после редактирования телефона
});

async function editPhone(phone, id) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(phone),
  });
}

// ! ---------------------------------SEARCH----------------------------------------
inpSearch.addEventListener("input", async (e) => {
  searchValue = e.target.value;
  await readPhones();
});

// ! -------------------------------PAGINATION--------------------------------------
async function pageFunc() {
  const res = await fetch(API);
  const data = await res.json();
  countPage = Math.ceil(data.length / 4); // Предполагаем, что 4 элемента на странице
  updatePaginationButtons();
}

function updatePaginationButtons() {
  document
    .querySelector("#prevBtn")
    .classList.toggle("disabled", currentPage <= 1);
  document
    .querySelector("#nextBtn")
    .classList.toggle("disabled", currentPage >= countPage);
}

document.querySelector("#prevBtn").addEventListener("click", async () => {
  if (currentPage <= 1) return;
  currentPage--;
  await readPhones();
});

document.querySelector("#nextBtn").addEventListener("click", async () => {
  if (currentPage >= countPage) return;
  currentPage++;
  await readPhones();
});

function showDetail(img, name, price) {
  document.querySelector("#detailImg").src = img;
  document.querySelector("#detailName").innerText = name;
  document.querySelector("#detailPrice").innerText = price;
}

document.addEventListener("DOMContentLoaded", readPhones); // Инициализация чтения телефонов при загрузке страницы
