import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  getDoc,
  doc,
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

// Read absensi
const tbody = document.getElementById("tbody");

const unsub = onSnapshot(collection(db, "absensi"), (docs) => {
  let table = "";
  let no = 1;

  docs.forEach((doc) => {
    table += `
    <tr>
      <td>${no}</td>
      <td>${doc.data().tanggal}</td>
      <td>${doc.data().siswa.length}</td>
      <td>
        <button type="button" class="btn btn-success btn-sm view-btn" data-target="#modalViewData"
          data-toggle="modal" id=${doc.id}>Detail</button>
      </td>
    </tr>
    `;
    no++;
  });

  tbody.innerHTML = table;
  const detailButton = document.querySelectorAll(".view-btn");
  detailButton.forEach((detailBtn) => {
    detailBtn.addEventListener("click", viewAbsensi);
  });
});

// Read Detail Absensi
const tbodyabsen = document.getElementById("tbodyabsen");

const viewAbsensi = async (e) => {
  const id = e.target.id;
  let table = "";

  const docSnap = await getDoc(doc(db, "absensi", id));

  if (docSnap.exists()) {
    document.getElementById("tanggalAbsensi").innerHTML =
      docSnap.data().tanggal;
    document.getElementById("jumlahAbsensi").innerHTML =
      docSnap.data().siswa.length;

    // Set table
    let num = 1;
    docSnap.data().siswa.forEach(async (user) => {
      const docSnap = await getDoc(doc(db, "users", user.id));
      table += `
        <tr>
          <td class="text-center">${num}</td>
          <td>${docSnap.data().nama}</td>
          <td class="text-center">${docSnap.data().nisn}</td>
          <td class="text-center">${docSnap.data().kelas}</td>
          <td class="text-center">${user.jam_absen}</td>
        </tr>
        `;
      tbodyabsen.innerHTML = table;
      num++;
    });
  }
};
