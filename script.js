// Ganti URL di bawah ini dengan Google Apps Script Web API Anda
const API_URL = "https://script.google.com/macros/s/AKfycbx.../exec";

// ========== LOGIN & MENU ==========
function login() {
  const username = document.getElementById('loginUser').value.trim();
  if (!username) {
    document.getElementById('loginMsg').textContent = "Masukkan nama pemohon!";
    return;
  }
  localStorage.setItem('user', username);
  document.getElementById('loginSection').style.display = "none";
  document.getElementById('menuSection').style.display = "block";
}
function logout() {
  localStorage.removeItem('user');
  location.reload();
}
window.onload = function() {
  // Untuk halaman index.html
  if (document.getElementById('menuSection')) {
    const user = localStorage.getItem('user');
    if (user) {
      document.getElementById('loginSection').style.display = "none";
      document.getElementById('menuSection').style.display = "block";
    }
  }
  // Untuk form.html
  if (document.getElementById('formSection')) {
    const user = localStorage.getItem('user');
    if (user) {
      document.getElementById('loginSectionForm').style.display = "none";
      document.getElementById('formSection').style.display = "block";
      document.getElementById('pemohon').value = user;
      setTanggal();
      setNoMR();
    }
  }
  // Untuk list.html
  if (document.getElementById('listSection')) {
    const user = localStorage.getItem('user');
    if (user) {
      document.getElementById('loginSectionList').style.display = "none";
      document.getElementById('listSection').style.display = "block";
      loadMRList();
    }
  }
};

// ========== LOGIN di FORM & LIST ==========
function loginForm() {
  const username = document.getElementById('loginUserForm').value.trim();
  if (!username) {
    document.getElementById('loginMsgForm').textContent = "Masukkan nama pemohon!";
    return;
  }
  localStorage.setItem('user', username);
  location.reload();
}
function loginList() {
  const username = document.getElementById('loginUserList').value.trim();
  if (!username) {
    document.getElementById('loginMsgList').textContent = "Masukkan nama pemohon!";
    return;
  }
  localStorage.setItem('user', username);
  location.reload();
}

// ========== FORM LOGISTIK ==========
function setTanggal() {
  const tgl = new Date().toISOString().slice(0,10);
  document.getElementById('tanggal').value = tgl;
}
async function setNoMR() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    document.getElementById('mr_no').value = "MR" + String(data.length + 1).padStart(4, '0');
  } catch {
    document.getElementById('mr_no').value = "MR0001";
  }
}
if (document.getElementById('mrForm')) {
  document.getElementById('mrForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const user = localStorage.getItem('user');
    if (!user) {
      document.getElementById('msg').textContent = "Anda harus login dahulu!";
      return;
    }
    const form = e.target;
    const data = {
      mr_no: form.mr_no.value,
      pemohon: user,
      department: form.department.value,
      tanggal: form.tanggal.value,
      barang: form.barang.value,
      part_no: form.part_no.value,
      satuan: form.satuan.value,
      qty: form.qty.value,
      harga: form.harga.value
    };
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      const result = await res.json();
      document.getElementById('msg').textContent = result.message || 'Permintaan berhasil dikirim!';
      form.reset();
      setNoMR();
      setTanggal();
    } catch (err) {
      document.getElementById('msg').textContent = 'Gagal kirim permintaan!';
    }
  });
}

// ========== LIST LOGISTIK ==========
async function loadMRList() {
  const user = localStorage.getItem('user');
  if (!user) return;
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const tbody = document.querySelector('#mrList tbody');
    tbody.innerHTML = '';
    data.forEach((mr, idx) => {
      const canEdit = mr.pemohon === user;
      const row = `<tr>
        <td>${mr.mr_no}</td>
        <td>${mr.pemohon}</td>
        <td>${mr.department}</td>
        <td>${mr.tanggal}</td>
        <td>${mr.barang}</td>
        <td>${mr.part_no || ''}</td>
        <td>${mr.satuan}</td>
        <td>${mr.qty}</td>
        <td>${mr.harga}</td>
        <td>${canEdit ? `<button onclick="editMR(${idx})">Edit</button>` : ''}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  } catch {
    document.querySelector('#mrList tbody').innerHTML = '<tr><td colspan="10">Gagal memuat data.</td></tr>';
  }
}
function editMR(idx) {
  alert("Fitur edit: hanya bisa oleh pemohon. Anda memilih MR urutan #" + (idx+1));
  // Bisa dikembangkan: load data, tampilkan form edit, dsb.
}

function updateTotalHarga() {
  const qty = Number(document.getElementById('qty').value) || 0;
  const harga = Number(document.getElementById('harga').value) || 0;
  document.getElementById('total_harga').value = qty * harga;
}
if (document.getElementById('qty')) {
  document.getElementById('qty').addEventListener('input', updateTotalHarga);
}
if (document.getElementById('harga')) {
  document.getElementById('harga').addEventListener('input', updateTotalHarga);
}

// Saat submit, kirim total_harga juga
if (document.getElementById('mrForm')) {
  document.getElementById('mrForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const user = localStorage.getItem('user');
    if (!user) {
      document.getElementById('msg').textContent = "Anda harus login dahulu!";
      return;
    }
    const form = e.target;
    const data = {
      mr_no: form.mr_no.value,
      pemohon: user,
      department: form.department.value,
      tanggal: form.tanggal.value,
      barang: form.barang.value,
      part_no: form.part_no.value,
      satuan: form.satuan.value,
      qty: form.qty.value,
      harga: form.harga.value,
      total_harga: form.total_harga.value
    };
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      const result = await res.json();
      document.getElementById('msg').textContent = result.message || 'Permintaan berhasil dikirim!';
      form.reset();
      setNoMR();
      setTanggal();
      updateTotalHarga();
    } catch (err) {
      document.getElementById('msg').textContent = 'Gagal kirim permintaan!';
    }
  });
}
