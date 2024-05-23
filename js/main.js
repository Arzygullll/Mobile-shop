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

btnAdd.addEventListener("click", () => {
  if (!inpImg.value.trim() || !inpName.value.trim() || !inpPrice.value.trim()) {
    alert("Введите данные!");
    return;
  }
  let newPhone = {
    phoneImg: inpImg.value,
    phoneName: inpName.value,
    phonePrice: inpPrice.value,
  };
  createPhone(newPhone);
  inpImg.value = "";
  inpName.value = "";
  inpPrice.value = "";
  collapseThree.classList.toggle("show");
});

function createPhone(phone) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(phone),
  }).then(() => readPhones());
}

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
          <button data-bs-toggle="modal" data-bs-target="#editModal" id="${elem.id}" type="button" class="btn btn-info btnEdit">Редактировать</button>
          <button data-bs-toggle="modal" data-bs-target="#detailModal" id="${elem.id}" type="button" class="btn btn-warning btnDetail">Детальный обзор</button>
        </div>
      </div>
    `;
  });
  pageFunc();
}

document.addEventListener("click", (e) => {
  const del_class = [...e.target.classList];
  let id = e.target.id;
  if (del_class.includes("btnDelete")) {
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    }).then(() => readPhones());
  }
});

const inpEditImg = document.querySelector("#inpEditImg");
const inpEditName = document.querySelector("#inpEditName");
const inpEditPrice = document.querySelector("#inpEditPrice");
const btnEditSave = document.querySelector("#btnEditSave");

document.addEventListener("click", (e) => {
  let edit_class = [...e.target.classList];
  let id = e.target.id;
  if (edit_class.includes("btnEdit")) {
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        inpEditImg.value = data.phoneImg;
        inpEditName.value = data.phoneName;
        inpEditPrice.value = data.phonePrice;
        btnEditSave.setAttribute("data-id", data.id);
      });
  } else if (edit_class.includes("btnDetail")) {
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        document.querySelector("#detailImg").src = data.phoneImg;
        document.querySelector("#detailName").textContent = data.phoneName;
        document.querySelector("#detailPrice").textContent = data.phonePrice;
      });
  }
});

btnEditSave.addEventListener("click", () => {
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
  editPhone(editedPhone, btnEditSave.getAttribute("data-id"));
});

function editPhone(phone, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(phone),
  }).then(() => readPhones());
}

inpSearch.addEventListener("input", (e) => {
  searchValue = e.target.value;
  readPhones();
});

async function pageFunc() {
  const res = await fetch(API);
  const data = await res.json();
  countPage = Math.ceil(data.length / 4); // Предполагаем, что 4 элемента на странице
}

document.querySelector("#prevBtn").addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readPhones();
});

document.querySelector("#nextBtn").addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readPhones();
});

readPhones(); // Инициализация чтения телефонов при загрузке страницы
