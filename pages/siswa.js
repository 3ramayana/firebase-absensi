import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBh_5mXg1rarkcAsFvM1IZCBTG5uHUNT6c",
  authDomain: "crud-firebase-fabff.firebaseapp.com",
  projectId: "crud-firebase-fabff",
  storageBucket: "crud-firebase-fabff.appspot.com",
  messagingSenderId: "1072353135478",
  appId: "1:1072353135478:web:77ec71e4be1fadcc6b4857",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const updateNama = document.getElementById("update-nama");
const updateNisn = document.getElementById("update-nisn");
const updateNipd = document.getElementById("update-nipd");
const updateJk = document.getElementById("update-jk");
const updateTempatLahir = document.getElementById("update-tempat-lahir");
const updateTanggalLahir = document.getElementById("update-tanggal-lahir");
const updateAlamat = document.getElementById("update-alamat");
const updateKelas = document.getElementById("update-kelas");
const updateGrade = document.getElementById("update-grade");
const updateAngkatan = document.getElementById("update-angkatan");
const updatePeminatan = document.getElementById("update-peminatan");
const updateClub = document.getElementById("update-club");

// READ DATA
const tbody = document.getElementById("tbody");

const unsub = onSnapshot(collection(db, "users"), (docs) => {
  let table = "";

  docs.forEach((doc) => {
    table += `
        <tr>
          <td>${doc.data().nama}</td>
          <td class="text-center">${doc.data().nisn}</td>
          <td class="text-center">${doc.data().kelas}</td>
          <td class="text-center">${doc.data().grade}</td>
          <td class="text-center">
            <button type="button" class="btn btn-success btn-sm view-btn" data-target="#modalViewData"
              data-toggle="modal" id=${doc.id}>Detail</button>
            <button type="button" class="btn btn-warning btn-sm update-btn" data-target="#modalUpdateData"
              data-toggle="modal" id=${doc.id}>Edit</button>
            <button type="button" class="btn btn-danger btn-sm delete-btn" id=${
              doc.id
            }>Delete</button>
          </td>
        </tr>`;
  });

  tbody.innerHTML = table;
  const detailButton = document.querySelectorAll(".view-btn");
  detailButton.forEach((detailBtn) => {
    detailBtn.addEventListener("click", viewData);
  });

  const updateButton = document.querySelectorAll(".update-btn");
  updateButton.forEach((updateBtn) => {
    updateBtn.addEventListener("click", updateData);
  });

  const deleteButton = document.querySelectorAll(".delete-btn");
  deleteButton.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", removeData);
  });
});

// TAMPIL DATA
const viewData = async (e) => {
  const id = e.target.id;

  const docSnap = await getDoc(doc(db, "users", id));

  if (docSnap.exists()) {
    getDownloadURL(ref(storage, docSnap.data().urlFoto))
      .then((url) => {
        const img = document.getElementById("viewUrlFoto");
        img.setAttribute("src", url);
      })
      .catch((error) => {
        // Handle any errors
      });

    document.getElementById("viewNama").innerHTML = docSnap.data().nama;
    document.getElementById("viewNisn").innerHTML = docSnap.data().nisn;
    document.getElementById("viewNipd").innerHTML = docSnap.data().nipd;
    document.getElementById("viewJk").innerHTML =
      docSnap.data().jk == "p" ? "Pria" : "Wanita";
    document.getElementById("viewTempatLahir").innerHTML =
      docSnap.data().tempatLahir;
    document.getElementById("viewTanggalLahir").innerHTML =
      docSnap.data().tanggalLahir;
    document.getElementById("viewAlamat").innerHTML = docSnap.data().alamat;
    document.getElementById("viewKelas").innerHTML = docSnap.data().kelas;
    document.getElementById("viewGrade").innerHTML = docSnap.data().grade;
    document.getElementById("viewAngkatan").innerHTML = docSnap.data().angkatan;
    document.getElementById("viewPeminatan").innerHTML =
      docSnap.data().peminatan;
    document.getElementById("viewClub").innerHTML = docSnap.data().club;
  } else {
    console.log("No such document!");
  }
};

// REMOVE DATA
const removeData = async (e) => {
  const id = e.target.id;

  // delete storage
  const docSnap = await getDoc(doc(db, "users", id));
  await deleteObject(ref(storage, docSnap.data().urlFoto))
    .then(() => {
      // File deleted successfully
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
    });

  // delete firestore
  await deleteDoc(doc(db, "users", id));
  Swal.fire("Berhasil!", "Data Berhasil di Hapus!", "success");
};

// UPDATE DATA
const updateData = async (e) => {
  const id = e.target.id;

  const docSnap = await getDoc(doc(db, "users", id));

  if (docSnap.exists()) {
    getDownloadURL(ref(storage, docSnap.data().urlFoto))
      .then((url) => {
        const img = document.getElementById("prev-foto");
        img.setAttribute("src", url);
        img.setAttribute("alt", docSnap.data().urlFoto);
      })
      .catch((error) => {
        // Handle any errors
      });

    updateNama.value = docSnap.data().nama;
    updateNisn.value = docSnap.data().nisn;
    updateNipd.value = docSnap.data().nipd;
    updateJk.value = docSnap.data().jk;
    updateTempatLahir.value = docSnap.data().tempatLahir;
    updateTanggalLahir.value = docSnap.data().tanggalLahir;
    updateAlamat.value = docSnap.data().alamat;
    updateKelas.value = docSnap.data().kelas;
    updateGrade.value = docSnap.data().grade;
    updateAngkatan.value = docSnap.data().angkatan;
    updatePeminatan.value = docSnap.data().peminatan;
    updateClub.value = docSnap.data().club;
  } else {
    console.log("No such document!");
  }

  const updateBtn = document.querySelector(".updateBtn");
  updateBtn.addEventListener("click", simpanUpdateData);
  updateBtn.setAttribute("id", id);
};

const simpanUpdateData = async (e) => {
  const id = e.target.id;
  let updateStudent = {
    nama: updateNama.value,
    nisn: updateNisn.value,
    nipd: updateNipd.value,
    jk: updateJk.value,
    tempatLahir: updateTempatLahir.value,
    tanggalLahir: updateTanggalLahir.value,
    alamat: updateAlamat.value,
    kelas: updateKelas.value,
    grade: updateGrade.value,
    angkatan: updateAngkatan.value,
    peminatan: updatePeminatan.value,
    club: updateClub.value,
  };
  await updateDoc(doc(db, "users", id), updateStudent);
  Swal.fire("Berhasil!", "Data Berhasil di Simpan!", "success");
};
