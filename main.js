const book = [];
//Event
const render_event = "render-book";
document.addEventListener("render-book", function () {
  const uncompletedBooktoRead = document.getElementById("incompleteBookshelfList");
  uncompletedBooktoRead.innerHTML = "";
  const completedBookList = document.getElementById("completeBookshelfList");
  completedBookList.innerHTML = "";
  for (const bookDesc of book) {
    const bookElement = bookshelf(bookDesc);
    if (!bookDesc.isComplete) {
      uncompletedBooktoRead.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    aboutBook();
    submitForm.reset();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
// Custom Dialog
const dialogModal = document.getElementById("confirmDialogModal");
window.onclick = function (event) {
  if (event.target == dialogModal) {
    dialogModal.style.display = "none";
  }
};
function confirmDialog(generatedID) {
  const myCustomDialog = document.getElementById("confirmDialogModal");
  const yesConfirm = document.getElementById("yesButton");
  const noConfirm = document.getElementById("noButton");
  myCustomDialog.style.display = "block";

  yesConfirm.classList.add(generatedID);

  yesConfirm.addEventListener("click", function () {
    if ( myCustomDialog.style.display == "block") {
      removeBookFromShelf(yesConfirm.className);
      yesConfirm.classList.remove(generatedID);
    }
    myCustomDialog.style.display = "none";

  });
  noConfirm.addEventListener("click", function () {
    myCustomDialog.style.display = "none";
    yesConfirm.className.remove(generatedID);
  });
}

//Function

function aboutBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = parseInt(document.getElementById("inputBookYear").value) 
  const isComplete = document.getElementById("inputBookIsComplete").checked ? true : false;
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor,bookYear, isComplete);
  book.push(bookObject);
  document.dispatchEvent(new Event("render-book"));
  saveData();
}

function generateId() {
  return +new Date();
}
function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}
function bookshelf(bookObject) {
  const container = document.createElement("article");
  container.classList.add("book_item");

  const bookName = document.createElement("h3");
  bookName.innerText = bookObject.title;

  const bookWriter = document.createElement("p");
  bookWriter.innerText = "Penulis : " + bookObject.author;

  const yearPublished = document.createElement("p");
  yearPublished.innerText = "Tahun Terbit : " + bookObject.year;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  container.append(bookName, bookWriter, yearPublished, buttonContainer);

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.innerText = "Belum Selesai Dibaca";
    undoButton.classList.add("green");
    undoButton.addEventListener("click", function () {
      undoBookFromComplete(bookObject.id);
    });
    const trashButton = document.createElement("button");
    trashButton.innerText = "Hapus Buku";
    trashButton.classList.add("red");
    trashButton.addEventListener("click", function () {
      confirmDialog(bookObject.id);
    });
    buttonContainer.append(undoButton, trashButton);
  } else {
    const doneButton = document.createElement("button");
    doneButton.innerText = "Selesai Dibaca";
    doneButton.classList.add("green");
    doneButton.addEventListener("click", function () {
      addBookToComplete(bookObject.id);
    });
    const trashButton = document.createElement("button");
    trashButton.innerText = "Hapus Buku";
    trashButton.classList.add("red");
    trashButton.addEventListener("click", function () {
      confirmDialog(bookObject.id);
    });
    buttonContainer.append(doneButton, trashButton);
  }
  return container;
}
function findBook(generatedID) {
  for (const bookDesc of book) {
    if (bookDesc.id == generatedID) {
      return bookDesc;
    }
  }
  return null;
}
function findBookIndex(generatedID) {
  for (const index in book) {
    if (book[index.id] === generatedID) {
      return index;
    }
  }
  return -1;
}
function addBookToComplete(generatedID) {
  const bookTarget = findBook(generatedID);

  if (bookTarget == null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event("render-book"));
  saveData();
}
function removeBookFromShelf(generatedID) {
  const bookTarget = findBook(generatedID);
  if (bookTarget == -1) return;
  book.splice(bookTarget, 1);
  document.dispatchEvent(new Event("render-book"));
  saveData();
}
function undoBookFromComplete(generatedID) {
  const bookTarget = findBook(generatedID);
  if (bookTarget == null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event("render-book"));
  saveData();
}

//Web Storage
const savedEvent = "saved-book";
const storageKey = "Bookshelf_App";
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser Kamu Tidak Mendukung Local Storage");
    return false;
  }
  return true;
}
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(book);
    localStorage.setItem("Bookshelf_App", parsed);
    document.dispatchEvent(new Event("saved-book"));
  }
}
function loadDataFromStorage() {
  const serializedData = localStorage.getItem("Bookshelf_App");
  let data = JSON.parse(serializedData);
  if (data !== null) {
    for (const listName of data) {
      book.push(listName);
    }
  }
  document.dispatchEvent(new Event("render-book"));
}
// Search
const searchInputForm = document.getElementById("searchBook");
searchInputForm.addEventListener("submit", function (event) {
  event.preventDefault();
  searchBook();
  searchInputForm.reset();
});

function searchBook() {
  const bookTitleInput = document.getElementById("searchBookTitle").value.toLowerCase();
  const bookComponent = document.querySelectorAll(".book_item > h3");
  for (i = 0; i < bookComponent.length; i++) {
    if (!bookComponent[i].innerHTML.toLowerCase().includes(bookTitleInput)) {
      bookComponent[i].parentElement.style.display = "none";
    } else {
      bookComponent[i].parentElement.style.display = "block";
    }
  }
}
