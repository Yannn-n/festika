let dataProdi = null;

// =======================
// LOAD JSON
// =======================

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    dataProdi = data;
    isiDropdownProdi();
  });


// =======================
// ISI DROPDOWN PRODI
// =======================

function isiDropdownProdi() {
  const select = document.getElementById("prodi");

  dataProdi.prodi.forEach(p => {
    let opt = document.createElement("option");
    opt.value = p.value;
    opt.textContent = p.label;
    select.appendChild(opt);
  });
}


// =======================
// KETIKA TOMBOL DIKLIK
// =======================

document.getElementById("btnPilih").addEventListener("click", function () {

  let prodiDipilih = document.getElementById("prodi").value;
  let selected = dataProdi.prodi.find(p => p.value === prodiDipilih);

  let container = document.getElementById("formNilai");
  container.innerHTML = `<h2>Nilai untuk Prodi: ${selected.label}</h2>`;

  // =======================
  // MAPEL WAJIB
  // =======================

  const wajib = [
    "Agama", "PKN", "Bahasa Indonesia",
    "Bahasa Inggris", "Matematika",
    "PJOK", "Seni Budaya"
  ];

  wajib.forEach(m => {
    container.innerHTML += `
      <label>${m}:</label>
      <input type="number" id="${m.replace(/ /g, "_")}" min="0" max="100"><br>
    `;
  });

  // =======================
  // MAPEL PENDUKUNG
  // =======================

  container.innerHTML += `<h3>Mata Pelajaran Pendukung</h3>`;

  selected.pendukung.forEach(m => {
    container.innerHTML += `
      <label>${m}:</label>
      <input type="number" id="${m.replace(/ /g, "_")}" min="0" max="100"><br>
    `;
  });

  container.innerHTML += `
    <button id="hitung">Hitung Rata-rata</button>
    <div id="hasil"></div>
  `;

  // =======================
  // HITUNG
  // =======================

  document.getElementById("hitung").addEventListener("click", function () {

    let nilai = [];

    wajib.forEach(m => {
      nilai.push(Number(document.getElementById(m.replace(/ /g, "_")).value));
    });

    selected.pendukung.forEach(m => {
      nilai.push(Number(document.getElementById(m.replace(/ /g, "_")).value));
    });

    let rata = nilai.reduce((a, b) => a + b, 0) / nilai.length;

    let hasil = `
      <p>Rata-rata nilai kamu: <b>${rata.toFixed(2)}</b></p>
      <p>Passing grade prodi: <b>${selected.nilai}</b></p>
    `;

    if (rata >= selected.nilai) {
      hasil += `<p class="lulus">KAMU BERPELUANG MASUK 🎉🔥</p>`;
    } else {
      hasil += `<p class="gagal">NILAI BELUM MENCUKUPI 😢</p>`;
    }

    document.getElementById("hasil").innerHTML = hasil;
  });

});