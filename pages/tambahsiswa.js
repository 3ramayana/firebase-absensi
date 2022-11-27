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

// ADD DATA
let fileImg = {};
urlFoto.addEventListener("change", (e) => {
  fileImg = e.target.files[0];
});

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
    clearField();
  } catch (e) {
    Swal.fire("Gagal!", "Data Gagal di Simpan!", "error");
  }
};

const clearField = () => {
  nama.value = "";
  nisn.value = "";
  nipd.value = "";
  jk.value = "";
  tempatLahir.value = "";
  tanggalLahir.value = "";
  alamat.value = "";
  kelas.value = "";
  grade.value = "";
  angkatan.value = "";
  peminatan.value = "";
  club.value = "";
  urlFoto.value = "";
};

const addStudent = document.getElementById("addStudent");
addStudent.addEventListener("submit", addData);
