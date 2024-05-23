const API = "http://localhost:8000/phones";
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
readPhones();
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
