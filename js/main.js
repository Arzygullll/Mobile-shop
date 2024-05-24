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
          <button type="button" class="btn btn-warning btninfo" id="${elem.id}">Детальный обзор</button>
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

// ! INFO
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
let currentPageSamsung = 1;
let searchValueSamsung = ""; // Добавьте это, если есть возможность поиска

// READ - Функция для чтения данных о Samsung-телефонах
async function readSamsungPhones() {
  const res = await fetch(
    `${API2}?q=${searchValueSamsung}&_page=${currentPageSamsung}&_limit=4`
  );
  const data = await res.json();
  return data;
}

// READ - Функция для отображения данных о Samsung-телефонах на странице
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
          <button data-bs-toggle="modal" data-bs-target="#exampleModal2" id="edit-${elem.id}" type="button" class="btn btn-info btnEdit">Редактировать</button>
          <button type="button" class="btn btn-warning" id="${elem.id}" onclick="showDetail('${elem.phoneImg}', '${elem.phoneName}', '${elem.phonePrice}')">Детальный обзор</button>
        </div>
      </div>
    `;
  });

  // Добавляем обработчики событий для кнопок удаления
  document.querySelectorAll(".btnDelete").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const id = e.target.id;
      await deletePhone(id); // DELETE
      await displaySamsungPhones(); // Refresh after delete
    });
  });

  // Добавляем обработчики событий для кнопок редактирования
  document.querySelectorAll(".btnEdit").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const id = e.target.id.split("-")[1]; // Получаем id из id кнопки
      const res = await fetch(`${API2}/${id}`);
      const data = await res.json();
      document.querySelector("#inpEditImg2").value = data.phoneImg;
      document.querySelector("#inpEditName2").value = data.phoneName;
      document.querySelector("#inpEditPrice2").value = data.phonePrice;
      document.querySelector("#btnEditSave2").setAttribute("data-id", data.id);
    });
  });
}

// Вызываем функцию для отображения данных о Samsung-телефонах при загрузке страницы
displaySamsungPhones();

// CREATE - Обработчик события для кнопки добавления нового телефона Samsung
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

  await createSamsungPhone(newPhone2); // CREATE
  inpImg2.value = "";
  inpName2.value = "";
  inpPrice2.value = "";

  // Обновляем отображение данных о Samsung-телефонах
  await displaySamsungPhones();
});

// CREATE - Функция для создания нового Samsung-телефона
async function createSamsungPhone(phones) {
  await fetch(API2, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(phones),
  });
}

// EDIT - Функция для редактирования телефона Samsung
async function editPhone2(phones, id) {
  await fetch(`${API2}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(phones),
  });
}

// DELETE - Функция для удаления телефона Samsung
async function deletePhone(id) {
  await fetch(`${API2}/${id}`, {
    method: "DELETE",
  });
}

// Обработчик события для кнопки сохранения изменений
const btnEditSave2 = document.querySelector("#btnEditSave2");

btnEditSave2.addEventListener("click", async () => {
  const inpEditImg2 = document.querySelector("#inpEditImg2");
  const inpEditName2 = document.querySelector("#inpEditName2");
  const inpEditPrice2 = document.querySelector("#inpEditPrice2");

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
  await editPhone2(editedPhone2, id); // EDIT
  await displaySamsungPhones();
});

// ! INFO
// First section
function showDetail(img, name, price) {
  document.querySelector("#detailImg").src = img;
  document.querySelector("#detailName").innerText = name;
  document.querySelector("#detailPrice").innerText = price;

  const detailModal = new bootstrap.Modal(
    document.getElementById("detailModal"),
    {
      keyboard: false,
    }
  );
  detailModal.show();
}

// Third section
function showSamsungDetail(img, name, price) {
  document.querySelector("#detailImg2").src = img;
  document.querySelector("#detailName2").innerText = name;
  document.querySelector("#detailPrice2").innerText = price;

  const detailModal = new bootstrap.Modal(
    document.getElementById("detailModal2"),
    {
      keyboard: false,
    }
  );
  detailModal.show();
}

// PAGINATION - Пагинация
const prevBtnSamsung = document.querySelector("#prevBtn2");
const nextBtnSamsung = document.querySelector("#nextBtn2");

prevBtnSamsung.addEventListener("click", async (e) => {
  e.preventDefault(); // Предотвращаем перезагрузку страницы
  if (currentPageSamsung > 1) {
    currentPageSamsung--;
    await displaySamsungPhones();
  }
});

nextBtnSamsung.addEventListener("click", async (e) => {
  e.preventDefault(); // Предотвращаем перезагрузку страницы
  currentPageSamsung++;
  await displaySamsungPhones();
});
// !-----------------------------------SECTION-3 FINISH-----------------------------------
