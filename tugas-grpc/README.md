syntax = "proto3";

package data;

service MahasiswaData {
    rpc CreateMahasiswa (Mahasiswa) returns (Mahasiswa) {}
    rpc ReadMahasiswa (MahasiswaRequest) returns (Mahasiswa) {}
    rpc ReadAllMahasiswa (Empty) returns (ListMahasiswa) {}
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

message ListMahasiswa {
    repeated Mahasiswa mahasiswa = 1;
}

message Empty {}
