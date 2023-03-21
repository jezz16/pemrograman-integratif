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

//Load the service
const MahasiswaService = grpc.loadPackageDefinition(packageDefinition);
MahasiswaService;

//Create a client
const client = new MahasiswaService.MahasiswaService(
  "127.0.0.1:50051",
  grpc.credentials.createInsecure()
);

client.getAll({}, (error, mahasiswa) => {
  if (!error) throw error;
  console.log(mahasiswa);
});
