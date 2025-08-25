# KBT Logistik Web

Aplikasi web logistik KBT dengan navigasi menu, sistem login sederhana, form permintaan logistik, dan daftar permintaan.

## Fitur
- Menu navigasi: Form pengisian & daftar permintaan logistik terpisah.
- Login wajib untuk input/form maupun melihat list.
- No MR otomatis, Nama Pemohon, Department, Tanggal Otomatis, Nama Barang, Part No (opsional), Satuan (dropdown), Qty, Estimasi Harga.
- Edit permintaan hanya oleh pemohon (fitur dasar, bisa dikembangkan).
- Data tersimpan di Google Spreadsheet via Apps Script.

## Integrasi Spreadsheet
1. Buat Google Spreadsheet dengan kolom: No MR, Nama Pemohon, Department, Tanggal, Nama Barang, Part No, Satuan, Qty, Harga.
2. Buat Google Apps Script baru di spreadsheet, gunakan kode berikut:
   ```javascript
   function doGet() {
     var sheet = SpreadsheetApp.openById("ID_SPREADSHEET_ANDA").getSheetByName("Sheet1");
     var data = sheet.getDataRange().getValues();
     data.shift(); // hapus header
     var result = data.map(row => ({
       mr_no: row[0], pemohon: row[1], department: row[2], tanggal: row[3], barang: row[4],
       part_no: row[5], satuan: row[6], qty: row[7], harga: row[8]
     }));
     return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
   }
   function doPost(e) {
     var sheet = SpreadsheetApp.openById("ID_SPREADSHEET_ANDA").getSheetByName("Sheet1");
     var obj = JSON.parse(e.postData.contents);
     sheet.appendRow([obj.mr_no, obj.pemohon, obj.department, obj.tanggal, obj.barang, obj.part_no, obj.satuan, obj.qty, obj.harga]);
     return ContentService.createTextOutput(JSON.stringify({message: 'Permintaan berhasil dikirim!'})).setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. Deploy sebagai Web App, izinkan akses siapa saja.
4. Salin URL Web Apps Script sebagai `API_URL` di script.js.

## Cara Pakai
- Buka `index.html` di browser, login, pilih menu.
- Pengisian form di `form.html`.
- Lihat daftar permintaan di `list.html`.
