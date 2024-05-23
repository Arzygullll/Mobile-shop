const API = "http://localhost:8000/phones";
const API2 = "http://localhost:8001/phones";
const inpImg = document.querySelector("#inpImg");
const inpName = document.querySelector("#inpName");
const inpPrice = document.querySelector("#inpPrice");
const btnAdd = document.querySelector("#btnAdd");
const collapseThree = document.querySelector("#collapseThree");
const section2 = document.querySelector(".section2");
// const inpSearch = document.querySelector("#inpSearch");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

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
  updatePaginationButtons();
}
readPhones();

async function pageFunc() {
  const res = await fetch(`${API}?q=${searchValue}`);
  const data = await res.json();
  countPage = Math.ceil(data.length / 4);
}

function updatePaginationButtons() {
  prevBtn.parentElement.classList.toggle("disabled", currentPage <= 1);
  nextBtn.parentElement.classList.toggle("disabled", currentPage >= countPage);
}

prevBtn.addEventListener("click", async (event) => {
  event.preventDefault(); // Предотвращает прокрутку вверх
  if (currentPage > 1) {
    currentPage--;
    await readPhones();
  }
});

nextBtn.addEventListener("click", async (event) => {
  event.preventDefault(); // Предотвращает прокрутку вверх
  if (currentPage < countPage) {
    currentPage++;
    await readPhones();
  }
});

// !-----------------------------------DELETE----------------------------------
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btnDelete")) {
    const id = e.target.id;
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
  if (e.target.classList.contains("btnEdit")) {
    const id = e.target.id;
    const res = await fetch(`${API}/${id}`);
    const data = await res.json();
    inpEditImg.value = data.phoneImg;
    inpEditName.value = data.phoneName;
    inpEditPrice.value = data.phonePrice;
    btnEditSave.setAttribute("data-id", data.id);
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
  const id = btnEditSave.getAttribute("data-id");
  let editedPhone = {
    phoneImg: inpEditImg.value,
    phoneName: inpEditName.value,
    phonePrice: inpEditPrice.value,
  };
  await editPhone(editedPhone, id);
  await readPhones();
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
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btninfo")) {
    const id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        document.querySelector("#detailImg").src = data.phoneImg;
        document.querySelector("#detailName").innerText = data.phoneName;
        document.querySelector("#detailPrice").innerText = data.phonePrice;

        const detailModal = new bootstrap.Modal(
          document.getElementById("detailModal"),
          {
            keyboard: false,
          }
        );
        detailModal.show();
      });
  }
});

// ! ---------------------------------SEARCH----------------------------------------
const inpSearch = document.querySelector("input[type='search']");
btnSearch.addEventListener("click", async (e) => {
  e.preventDefault(); // Предотвращаем стандартное поведение формы
  searchValue = inpSearch.value.trim();
  currentPage = 1;
  await readPhones();
});

inpSearch.addEventListener("input", async (e) => {
  searchValue = e.target.value.trim();
  currentPage = 1;
  await readPhones();
});

// ! -------------------------------PAGINATION--------------------------------------
document.addEventListener("DOMContentLoaded", readPhones);

function showDetail(img, name, price) {
  document.querySelector("#detailImg").src = img;
  document.querySelector("#detailName").innerText = name;
  document.querySelector("#detailPrice").innerText = price;
}
//

// !-------SECTION3-----------------
// !-----------------------------------SECTION-3 START-----------------------------------
const section3 = document.querySelector(".section3");

// Функция для чтения данных о Samsung-телефонах
async function readSamsungPhones() {
  const res = await fetch(
    `${API2}?q=${searchValue}&_page=${currentPage}&_limit=4`
  );
  const data = await res.json();
  return data;
}

// Функция для отображения данных о Samsung-телефонах на странице
async function displaySamsungPhones() {
  const samsungData = await readSamsungPhones();

  // Очищаем содержимое section3 перед добавлением новых данных
  section3.innerHTML = "";

  // Вставляем данные о Samsung-телефонах в раздел section3
  samsungData.forEach((elem) => {
    section3.innerHTML += `
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
}

// Вызываем функцию для отображения данных о Samsung-телефонах при загрузке страницы
displaySamsungPhones();

// Обработчик события для кнопки добавления нового телефона Samsung
const btnAddSamsung = document.querySelector("#btnAdd2");

btnAddSamsung.addEventListener("click", async () => {
  const inpImg2 = document.querySelector("#inpImg2");
  const inpName2 = document.querySelector("#inpName2");
  const inpPrice2 = document.querySelector("#inpPrice2");

  if (
    !inpImg2.value.trim() ||
    !inpName2.value.trim() ||
    !inpPrice2.value.trim()
  ) {
    alert("Введите данные!");
    return;
  }

  let newPhone2 = {
    phoneImg: inpImg2.value,
    phoneName: inpName2.value,
    phonePrice: inpPrice2.value,
  };

  await createSamsungPhone(newPhone2);
  inpImg2.value = "";
  inpName2.value = "";
  inpPrice2.value = "";

  // Обновляем отображение данных о Samsung-телефонах
  await displaySamsungPhones();
});

// Функция для создания нового Samsung-телефона
async function createSamsungPhone(phones) {
  await fetch(API2, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(phones),
  });
}

// Обработчик события для кнопки редактирования телефона Samsung
const inpEditImg2 = document.querySelector("#inpEditImg2");
const inpEditName2 = document.querySelector("#inpEditName2");
const inpEditPrice2 = document.querySelector("#inpEditPrice2");
const btnEditSave2 = document.querySelector("#btnEditSave2");

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btnEdit")) {
    const id = e.target.id;
    const res = await fetch(`${API2}/${id}`);
    const data = await res.json();
    inpEditImg2.value = data.phoneImg;
    inpEditName2.value = data.phoneName;
    inpEditPrice2.value = data.phonePrice;
    btnEditSave2.setAttribute("data-id", data.id);
  }
});

btnEditSave2.addEventListener("click", async () => {
  if (
    !inpEditImg2.value.trim() ||
    !inpEditName2.value.trim() ||
    !inpEditPrice2.value.trim()
  ) {
    alert("Введите данные!");
    return;
  }
  const id = btnEditSave2.getAttribute("data-id");
  let editedPhone2 = {
    phoneImg: inpEditImg2.value,
    phoneName: inpEditName2.value,
    phonePrice: inpEditPrice2.value,
  };
  await editPhone2(editedPhone2, id);
  await displaySamsungPhones();
});

// Функция для редактирования телефона Samsung
async function editPhone2(phones, id) {
  await fetch(`${API2}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(phones),
  });
}

// Функция для отображения детальной информации о телефоне Samsung
function showDetail(img, name, price) {
  document.querySelector("#detailImg2").src = img;
  document.querySelector("#detailName2").innerText = name;
  document.querySelector("#detailPrice2").innerText = price;
}
// !-----------------------------------SECTION-3 FINISH-----------------------------------
