import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import {
  collection,
  getFirestore,
  getDocs,
  getDoc,
  doc,
  addDoc,
  query,
  where,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";

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

moment.locale("id");

let hari = moment().format("dddd");
let tanggal = moment().format("LL");

const hariElm = document.getElementById("tanggal");
const text = document.createTextNode(hari + ", " + tanggal);

hariElm.appendChild(text);

// Add Student Absens
const idSiswaElm = document.getElementById("idSiswa");

const submitAbsenSiswa = (e) => {
  e.preventDefault();
  console.log("submit absensi");

  // clear form
  idSiswaElm.value = "";
};

const submitAbsen = document.getElementById("submitAbsenSiswa");
submitAbsen.addEventListener("submit", submitAbsenSiswa);

let newAbsensi = {
  tanggal: tanggal,
  siswa: [],
};

// cek data absensi
const tbody = document.getElementById("tbody");
let table = "";

const q = query(collection(db, "absensi"), where("tanggal", "==", tanggal));
const querySnapshot = await getDocs(q);
let idAbsensi = "";

querySnapshot.forEach((doc) => {
  idAbsensi = doc.id;
});

if (!idAbsensi) {
  console.log("inisiasi database");
  const docRef = await addDoc(collection(db, "absensi"), newAbsensi);
} else {
  console.log("ada data");
  const docSnap = await getDoc(doc(db, "absensi", idAbsensi));

  let num = 1;
  docSnap.data().siswa.forEach(async (e) => {
    const docSnap = await getDoc(doc(db, "users", e.id));
    table += `
      <tr>
        <td class="text-center">${num}</td>
        <td>${docSnap.data().nama}</td>
        <td class="text-center">${docSnap.data().nisn}</td>
        <td class="text-center">${docSnap.data().kelas}</td>
        <td class="text-center">${e.jam_absen}</td>
      </tr>
      `;
    tbody.innerHTML = table;
    num++;
  });
}
