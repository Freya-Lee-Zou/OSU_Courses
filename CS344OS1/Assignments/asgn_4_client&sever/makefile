# CC=clang -g -fsanitize=address
CC=gcc --std=gnu99 -g
all: compile

compile: keygen enc_client enc_server dec_client dec_server


keygen: keygen.c
	$(CC) keygen.c -o keygen

enc_server: enc_server.c
	$(CC) enc_server.c -o enc_server

dec_server: dec_server.c
	$(CC) dec_server.c -o dec_server

enc_client: enc_client.c
	$(CC) enc_client.c -o enc_client

dec_client: dec_client.c
	$(CC) dec_client.c -o dec_client

clean:
	rm -rf *.out *.o dec_client enc_client dec_server  enc_server keygen
