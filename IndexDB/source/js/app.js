let $ = document;
const registerForm = $.querySelector(".register-form");
const nameInput = $.querySelector(".nameInput");
const passwordInput = $.querySelector(".passwordInput");
const emailInput = $.querySelector(".emailInput");
const userTableElem = $.querySelector("table");

let db = null;
let objectStore = null;

window.addEventListener("load", () => {
  // ساخت دیتا بیس  و ذخیره طلاعت
  // نحوه ساخت دیتابیس با نسخه اولیه 1
  let DBOpenReq = indexedDB.open("ali", 34); //دو تا ورودی میگیرد که اولی اسم دیتا بیس است و دومی نسخه یا ورژن دیتا بیس است وبه صورت اختیاری می باشد که اگه وارد نکنیم خودش به صورت دیفالت 1 وارد میکنه
  //برای اینکه بفهمیم دیتا بیس ایجاد شده یا خطایی دارد از دو رویداد یا اونت به خطا و موفق به صورت زیر استفادده مینماییم
  DBOpenReq.addEventListener("erroe", (err) => {
    console.warn("DB open Error", err);
  });

  DBOpenReq.addEventListener("success", (event) => {
    db = event.target.result;
    getUsers();
    console.log("DB open success", event.target.result);
  });

  //ایجاد رویداد خیلی مهم upgradeneeded
  DBOpenReq.addEventListener("upgradeneeded", (event) => {
    db = event.target.result;
    console.log("old DB version", event.oldVersion);
    console.log("upgrade", db);
    console.log("new DB version", event.newVersion);

    if (!db.objectStoreNames.contains("users")) {
      objectStore = db.createObjectStore("users", {
        keyPath: "userId",
      }); //اسم استور و اپشن
    }

    if (db.objectStoreNames.contains("corses")) {
      db.deleteObjectStore("corses");
    }
  }); //زمانی اجرا می شود که نسخه دیتا بیس ایجاد شده را تغییر دهیم
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let newUser = {
    userId: Math.floor(Math.random() * 9999),
    userName: nameInput.value,
    userPass: passwordInput.value,
    userEmail: emailInput.value,
  };

  let Tx = creatTx("users", "readwrite");

  Tx.addEventListener("complete", (event) => {
    console.log("Tx set complete", event);
  });

  let store = Tx.objectStore("users");
  let request = store.add(newUser);

  request.addEventListener("erroe", (err) => {
    console.warn("request set Error", err);
  });

  request.addEventListener("success", (event) => {
    console.log("request set success", event);
    clearValueRegister();
    getUsers();
  });
});

function clearValueRegister() {
  nameInput.value = "";
  passwordInput.value = "";
  emailInput.value = "";
}

function getUsers() {
  let Tx = creatTx("users", "readonly");

  Tx.addEventListener("complete", (event) => {
    console.log("Tx get complete", event);
  });

  let store = Tx.objectStore("users");
  let request = store.getAll();

  request.addEventListener("erroe", (err) => {
    console.warn("request Get Error", err);
  });

  request.addEventListener("success", (event) => {
    let allUsers = event.target.result;

    // console.log("request Get success", event.target.result);

    let userstemplateArray = allUsers
      .map((user) => {
        return `      <tr>
            <td>${user.userId}</td>
            <td>${user.userName}</td>
            <td>${user.userPass}</td>
            <td>${user.userEmail}</td>
            <td><a href="#" onclick="removeUser(${user.userId})">Remove</a></td>
            <td><a href="#" onclick="changeUser(${user.userId})">change</a></td>
          </tr>`;
      })
      .join("");
    userTableElem.innerHTML = `   <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Password</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                    <th>Change</th>
                                  </tr>`;
    userTableElem.innerHTML += userstemplateArray;
    console.log(userstemplateArray);
  });
}

function removeUser(userId) {
  event.preventDefault();
 
  let Tx = creatTx("users", "readwrite");

  Tx.addEventListener("complete", (event) => {
    console.log("Tx delete complete", event);
  });

  let store = Tx.objectStore("users");
  let request = store.delete(userId);

  request.addEventListener("erroe", (err) => {
    console.warn("request delete Error", err);
  });

  request.addEventListener("success", (event) => {
    console.log("request delete success", event);
    getUsers();
  });
}

// function changeUser(userId){
//     console.log(userId);
//     event.preventDefault()
// }
function creatTx(StoreName, aption) {
  let Tx = db.transaction(StoreName, aption);

  Tx.addEventListener("erroe", (err) => {
    console.warn("tx Error", err);
  });

  return Tx;
}
