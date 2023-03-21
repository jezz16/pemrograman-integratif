//Import the grpc module
const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// Define the path to the proto file
const PROTO_PATH = "./mahasiswa.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

//Load the protobuf
const mahasiswaProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

//Dummy data
let mahasiswas = [
  {
    id: 1,
    nama: "Asep",
    nrp: "5027",
    nilai: 80,
  },
  {
    id: 2,
    nama: "Budi",
    nrp: "5028",
    nilai: 90,
  },
];

server.addService(mahasiswaProto.MahasiswaService.service, {
  getAll: (_, callback) => {
    callback(null, mahasiswa);
  },
});

server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
  }
);
