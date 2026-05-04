# Analisa Code Sistem Sederhana buat Manage Daftar Belanja

*(dirapikan Claude.AI)*

---

## Code

```javascript
class DaftarBelanja {
  constructor() {
    this.items = [];
    this.total = 0;
  }

  tambah(nama, harga, qty = 1) {
    const item = { nama, harga, qty, subtotal: harga * qty };
    this.items.push(item);
    this.total += item.subtotal;
    return this;
  }

  hapus(nama) {
    const idx = this.items.findIndex(i => i.nama === nama);
    if (idx !== -1) {
      this.total -= this.items[idx].subtotal;
      this.items.splice(idx, 1);
    }
    return this;
  }

  tampilkan() {
    this.items.forEach(i => {
      console.log(`${i.nama} x${i.qty} = Rp${i.subtotal}`);
    });
    console.log(`Total: Rp${this.total}`);
  }

  cari(keyword) {
    const hasil = this.items.filter(i =>
      i.nama.toLowerCase().includes(keyword.toLowerCase())
    );

    if (hasil.length === 0) {
      console.log(`Tidak ada item dengan kata kunci "${keyword}"`);
      return [];
    }

    console.log(`Hasil pencarian "${keyword}" : `);
    hasil.forEach(i => {
      console.log(`- ${i.nama} x ${i.qty} = Rp${i.subtotal}`);
    });

    return hasil;
  }
}
```

---

## Gambaran Umum

Dari code diatas menurutku ini adalah kode program yang digunakan untuk menambahkan item daftar perbelanjaan pada suatu aplikasi, bisa dilihat dari nama classnya yang bernama `DaftarBelanja` dan diikuti dengan method `hapus`, `tambah` dan `tampilkan`.

Bagian yang belum aku mengerti ada banyak sekali, pertama pada baris ini :

```javascript
const item = { nama, harga, qty, subtotal: harga * qty };
```

Dibagian ini aku tidak mengerti `subtotal: harga * qty` maksudnya apa, apakah seperti `subtotal = harga * qty` gitu? Lalu juga dibagian ini `this.items.splice(idx, 1);` splice ini apaan? Lalu items ini splice?? Lalu juga didalam kurung kurawal ada `idx` dan `1`.. sejauh ini aku tidak paham soal itu. Lalu yang bagian method tampilkan, aku cukup paham lah untuk soal perulangannya yang akan menampilkan nama barang, jumlah barang dan harga subtotal dan total barang dalam bentuk mata uang rupiah.

---

## Penjelasan

Oke, jadi disini kita memiliki sebuah program code javascript yang dibuat untuk Management List Perbelanjaan, disini sebelum kita mulai kita harus membungkus semua fungsi fungsinya tersebut dalam 1 class dulu yang disebut dengan `DaftarBelanja` lalu kita tuliskan didalam class tersebut sebuah fungsi yang disebut constructor, fungsi `constructor` yang ditulis ini akan berjalan secara otomatis dan hanya sekali saja, gunanya untuk menyediakan kita sebuah wadah kosong bagi item item perbelanjaan yang akan kita masukkan nanti, ibarat buku ini constructor ini menyediakan halaman kosong aja, lalu lanjut ke baris code dibagian ini :

```javascript
this.items = [];
this.total = 0;
```

Disini kita mendeklarasikan `items` yang dijadikan array kosong, dan karena nilai arraynya kosong kita set `total`nya juga `0` sebagai default karena array kosong.

---

Lanjut, kita masuk ke fungsi `tambah`, disini kita membuat fungsi tambah yang didalamnya kita isikan `nama`, `harga` dan `qty`. Nama, harga dan qty ini kemudian kita anggap sebagai 1 produk yang masuk kedalam array, kemudian kita deklarasikan `item` yang berisi `nama`, `harga`, `qty`, dan `subtotal`, dapat subtotal darimana? Ya dari qty dikali harga. Setelah ketemu hasilnya kita masukkan item kedalam array `items` yang sudah dideklarasikan sebelumnya, dan kita tampilkan totalnya dengan cara `total + subtotal` dan kemudian setelah selesai dengan penambahan item ke `items`, dengan `return this;` sistem mengembalikan object ke perbelanjaan lagi, ibaratnya kayak selesai nulis dan pensil ditaru diatas kertas menunggu untuk digunakan lagi untuk menulis.

---

Lanjut setelahnya ada method `hapus`, disini method hapus diisi dengan `nama` saja, setelahnya kita deklarasikan `idx` (singkatan dari index) untuk mencari item dengan index tertentu, nama item disini diwakilkan sebagai `i` jika sistem tidak menemukan nama yang cocok dengan `i` maka sistem akan menampilkan `-1` tapi jika ternyata ada maka sistem akan mengurangi jumlah total harga dengan subtotal item index yang dihapus dan setelah pengurangan selesai maka sistem akan menghapus item sesuai dengan index yang kita inginkan, `(idx, 1);` fungsi angka `1` disini adalah seberapa banyak yang ingin dihapus.

---

Lanjut method `tampilkan`, disini kita menggunakan perulangan `forEach` agar sistem bisa menampilkan semua object array 1 per 1, nama object array diwakilkan dengan `i` disini menggunakan `console.log` sistem akan menampilkan nama, jumlah dan harga subtotal setiap barang yang ada, kemudian sistem akan menjumlahkan seluruh subtotalnya menjadi total keseluruhan daftar perbelanjaan yang sudah ditambahkan didalam array.

---

Method tambahan yaitu method `cari`, di method ini kita menggunakan `keyword` agar bisa mencari nama item perbelanjaan yang sudah ditambahkan. Pertama, kita deklarasikan dulu `hasil`, kemudian hasil ini akan mengambil `items` dan memfilternya sesuai dengan nama barang yang kita tambahkan didalam array `items`, dengan `.toLowerCase()` kita ubah semua huruf inputan kita menjadi huruf kecil dan juga dengan `.includes()` kita membuat sistem mengecek nama items dalam array yang memiliki nama yang sesuai dengan nama barang didalam array `items`, disini menggunakan perulangan `if` sistem akan ngecek seberapa banyak kecocokan keyword kita dengan nama items yang tersimpan, jika tidak ada maka sistem akan menampilkan `0` dan sistem mengatakan `"Tidak ada item dengan kata kunci ${kata kunci yang dimasukkan}"`, tapi jika ternyata sistem menemukan kecocokan dari inputan huruf keyword kita dengan nama items yang disimpan di array maka sistem dengan `console.log`nya akan menampilkan hasil pencarian itu, dan dengan menggunakan perulangan `forEach` sistem akan menampilkan setiap data yang cocok dengan keyword pencarian kita, seperti nama, harga, jumlah dan subtotalnya. Kemudian sistem akan menampilkan hasil dari pencarian kita melalui `return hasil;`