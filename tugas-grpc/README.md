# Implementasi CRUD GRPC dan protobuf

## Persyaratan
Kita perlu pengetahuan dasar dari :
- Node JS
- MySQL


## Persiapan
Yang perlu diinstalasi :
- Node JS
- NPM


#### 1. Proto file
```proto
syntax = "proto3";

package data;

service MahasiswaData {
    rpc CreateMahasiswa (Mahasiswa) returns (Mahasiswa) {}
    rpc ReadMahasiswa (MahasiswaRequest) returns (Mahasiswa) {}
    rpc UpdateMahasiswa (Mahasiswa) returns (Mahasiswa) {}
    rpc DeleteMahasiswa (MahasiswaRequest) returns (Mahasiswa) {}
}

message Mahasiswa {
    int32 id = 1;
    string nama = 2;
    string alamat = 3;
    int32 nilai = 4;
}

message MahasiswaRequest {
    int32 id = 1;
}

```
#### 2. Server
```js
//Import the grpc module
const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const mysql = require("mysql");

const PROTO_PATH = "./mahasiswa.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const MahasiswaData = grpcObject.data.MahasiswaData;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "grpc-nodejs",
});

connection.connect();

function createMahasiswa(call, callback) {
  const user = call.request;

  connection.query("INSERT INTO users SET ?", user, (err, result) => {
    if (err) throw err;

    user.id = result.insertId;
    callback(null, "User created successfully");
  });
}

function readMahasiswa(call, callback) {
  const id = call.request.id;

  connection.query("SELECT * FROM users WHERE id = ?", id, (err, results) => {
    if (err) throw err;

    const user = results[0];
    callback(null, user);
  });
}

function updateMahasiswa(call, callback) {
  const user = call.request;

  connection.query(
    "UPDATE users SET nama = ?, alamat = ?, nilai = ? WHERE id = ?",
    [user.nama, user.alamat, user.nilai, user.id],
    (err, result) => {
      if (err) throw err;

      callback(null, "User updated successfully");
    }
  );
}

function deleteMahasiswa(call, callback) {
  const id = call.request.id;

  connection.query("DELETE FROM users WHERE id = ?", id, (err, result) => {
    if (err) throw err;

    callback(null, "User deleted successfully");
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(MahasiswaData.service, {
    CreateMahasiswa: createMahasiswa,
    ReadMahasiswa: readMahasiswa,
    UpdateMahasiswa: updateMahasiswa,
    DeleteMahasiswa: deleteMahasiswa,
  });

  server.bindAsync(
    "127.0.0.1:50051",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      console.log("Server running at http://127.0.0.1:50051");
      server.start();
    }
  );
}

main();

```

#### 3. Client
```js
//Import the grpc module
const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./mahasiswa.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const MahasiswaData = grpcObject.data.MahasiswaData;

const client = new MahasiswaData(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

function createMahasiswa(nama, alamat, nilai) {
  const user = {
    nama: nama,
    alamat: alamat,
    nilai: nilai,
  };

  client.CreateMahasiswa(user, (err, response) => {
    console.log(response);
    if (err) {
      console.error(err);
      return;
    }
    console.log(`User created`);
  });
}

function readMahasiswa(id) {
  client.ReadMahasiswa({ id: id }, (err, response) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(response);
  });
}

function updateMahasiswa(id, nama, alamat, nilai) {
  const user = {
    id: id,
    nama: nama,
    alamat: alamat,
    nilai: nilai,
  };

  client.UpdateMahasiswa(user, (err, response) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`Updated user with id ${response.id}`);
  });
}

function deleteMahasiswa(id) {
  client.DeleteMahasiswa({ id: id }, (err, response) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`Deleted user with id ${id}`);
  });
}

// penggunaan fungsi CRUD
// createMahasiswa("Alex", "Keputih", 85);
// readMahasiswa(2);
// updateMahasiswa(2, "Jezz", "Gebang", 87);
// readMahasiswa(2);
// deleteMahasiswa(1);

```
## Tes Fungsi CRUD
