#include <stdio.h>
#include <mspack.h>

int main(int argc, char **argv) {
    int selftest;
    MSPACK_SYS_SELFTEST(selftest);
    if (selftest != MSPACK_ERR_OK || argc != 3) {
        fprintf(stderr, "usage: %s INPUT OUTPUT\n", argv[0]);
        return 2;
    }

    struct mskwaj_decompressor *kwaj = mspack_create_kwaj_decompressor(NULL);
    if (!kwaj) return 3;
    int result = kwaj->decompress(kwaj, argv[1], argv[2]);
    mspack_destroy_kwaj_decompressor(kwaj);
    if (result != MSPACK_ERR_OK) {
        fprintf(stderr, "KWAJ decompression failed: %d\n", result);
        return 1;
    }
    return 0;
}
