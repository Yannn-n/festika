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
    <button id="hitung">Hitung Peluang Masuk</button>
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

    let z = (rata - selected.nilai) / (selected.dayatampung / Math.sqrt(selected.peminat));
    
    class NormalDistribution {

    // Aproksimasi fungsi error (erf)
      static erf(z) {
          let t = 1.0 / (1.0 + 0.5 * Math.abs(z));

          let ans = 1 - t * Math.exp(
              -z * z
              - 1.26551223
              + 1.00002368 * t
              + 0.37409196 * t * t
              + 0.09678418 * Math.pow(t, 3)
              - 0.18628806 * Math.pow(t, 4)
              + 0.27886807 * Math.pow(t, 5)
              - 1.13520398 * Math.pow(t, 6)
              + 1.48851587 * Math.pow(t, 7)
              - 0.82215223 * Math.pow(t, 8)
              + 0.17087277 * Math.pow(t, 9)
          );

          return z >= 0 ? ans : -ans;
      }

      // Fungsi CDF Normal Standar
      static normalCDF(z) {
          return 0.5 * (1 + this.erf(z / Math.sqrt(2)));
      }
  }
  let peluangMasuk = NormalDistribution.normalCDF(z) * 100;
  let hasil;
  if (peluangMasuk > 10) {
    hasil = `<p class = "berpeluang">SELAMAT PELUANG MASUK MU : ${peluangMasuk.toFixed(0)}% 🎉🔥 </p>`;
  } else {
    hasil = `<p class = "rendah">MAAF PELUANG MASUK MU TERLALU RENDAH 😥😥</p>`;
  }  
    
    

    document.getElementById("hasil").innerHTML = hasil;
  });

});
