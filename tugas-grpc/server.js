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
