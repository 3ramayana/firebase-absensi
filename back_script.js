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

// Get Element
const nama = document.getElementById("nama");
const nisn = document.getElementById("nisn");
const nipd = document.getElementById("nipd");
const jk = document.getElementById("jk");
const tempatLahir = document.getElementById("tempat-lahir");
const tanggalLahir = document.getElementById("tanggal-lahir");
const alamat = document.getElementById("alamat");
const kelas = document.getElementById("kelas");
const grade = document.getElementById("grade");
const angkatan = document.getElementById("angkatan");
const peminatan = document.getElementById("peminatan");
const club = document.getElementById("club");
const urlFoto = document.getElementById("foto");
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

let fileImg = {};
urlFoto.addEventListener("change", (e) => {
  fileImg = e.target.files[0];
});

const prevFoto = document.getElementById("prev-foto-input");
prevFoto.addEventListener("change", async (e) => {
  fileImg = e.target.files[0];

  // upload foto
  const prevFoto = document.getElementById("prev-foto");
  const urlFoto = prevFoto.getAttribute("alt");

  await uploadBytes(ref(storage, urlFoto), fileImg).then((snapshot) => {
    console.log("Uploaded a blob or file!");
  });

  // download foto
  await getDownloadURL(ref(storage, urlFoto))
    .then((url) => {
      const img = document.getElementById("prev-foto");
      img.setAttribute("src", url);
    })
    .catch((error) => {
      // Handle any errors
    });
});

// ADD DATA
const addData = async (e) => {
  e.preventDefault();

  const fileImgName = Date.now();
  uploadBytes(ref(storage, `foto-siswa/${fileImgName}`), fileImg).then(
    (snapshot) => {
      console.log("Uploaded a blob or file!");
    }
  );

  let newStudent = {
    nama: nama.value,
    nisn: nisn.value,
    nipd: nipd.value,
    jk: jk.value,
    tempatLahir: tempatLahir.value,
    tanggalLahir: tanggalLahir.value,
    alamat: alamat.value,
    kelas: kelas.value,
    grade: grade.value,
    angkatan: angkatan.value,
    peminatan: peminatan.value,
    club: club.value,
    urlFoto: `foto-siswa/${fileImgName}`,
  };

  try {
    const docRef = await addDoc(collection(db, "users"), newStudent);
    Swal.fire("Berhasil!", "Data Berhasil di Simpan!", "success");
  } catch (e) {
    Swal.fire("Gagal!", "Data Gagal di Simpan!", "error");
  }
};

const addStudent = document.getElementById("addStudent");
addStudent.addEventListener("submit", addData);

// READ DATA
const unsub = onSnapshot(collection(db, "users"), (docs) => {
  let table = "";
  let no = 1;

  docs.forEach((doc) => {
    table += `
        <tr>
          <th scope="row" class="text-center">${no}</th>
          <td>${doc.data().nama}</td>
          <td class="text-center">${doc.data().nisn}</td>
          <td class="text-center">${doc.data().kelas}</td>
          <td class="text-center">${doc.data().grade}</td>
          <td class="text-center">
            <button type="button" class="btn btn-success view-btn" data-bs-target="#modalViewData"
              data-bs-toggle="modal" id=${doc.id}>Details</button>
            <button type="button" class="btn btn-primary update-btn" data-bs-target="#modalUpdateData"
              data-bs-toggle="modal" id=${doc.id}>Update</button>
            <button type="button" class="btn btn-danger delete-btn" id=${
              doc.id
            }>Delete</button>
          </td>
        </tr>`;

    no++;
  });

  tbody.innerHTML = table;
  const deleteButton = document.querySelectorAll(".delete-btn");
  deleteButton.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", removeData);
  });

  const updateButton = document.querySelectorAll(".update-btn");
  updateButton.forEach((updateBtn) => {
    updateBtn.addEventListener("click", updateData);
  });

  const detailButton = document.querySelectorAll(".view-btn");
  detailButton.forEach((detailBtn) => {
    detailBtn.addEventListener("click", viewData);
  });
});

const tbody = document.getElementById("tbody");

// VIEW DATA
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

// DELETE DATA
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

    const updateBtn = document.getElementById("updateBtn");
    updateBtn.addEventListener("click", () => {
      simpanUpdateData(id);
    });
  } else {
    console.log("No such document!");
  }
};

const simpanUpdateData = async (id) => {
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
