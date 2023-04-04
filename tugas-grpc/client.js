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

function readAllMahasiswa() {
  client.ReadAllMahasiswa({}, (err, response) => {
    if (err) {
      console.error(err);
      return;
    }

    response.mahasiswa.forEach((mahasiswa) => {
      console.log(mahasiswa);
    });
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
// createMahasiswa("masbro", "Keputih", 85);
// readMahasiswa(1);
// updateMahasiswa(1, "Jezz", "Gebang", 87);
// readMahasiswa(1);
// deleteMahasiswa(1);
readAllMahasiswa();
