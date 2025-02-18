#********************************************
# Student Name: YA Zou(Suzy)
# Date: 23, Oct, 2023
#********************************************

#=========================Brainstrom===========
# Given things: encryption mode:aes-128-cbc ; ciphertext; pliantext; initial     vector is all int 0; the key is < 16 characters -128 bits;  space characters (hexadecimal value 0x20) are appended to the end of the word to form a key of 128 bits
# Method: bruteforce
# Found key: median 
#=====================================================

from binascii import unhexlify # to ocnvert hex to binary 
from Crypto.Cipher import AES # cryptography algorithm 


def loadData():
    english_words = []
    file_path = "words.txt"
    with open(file_path, 'r') as file:
       for line in file:
            # Remove all of space characters
            word = line.strip()
            # Store all words that less and eqal to 16 chars to list english_words
            if len(word)<= 16:
                english_words.append(word.encode('utf-8'))
    # print(english_words)
    return english_words


def main():
   
    plaintext = b"This is a top secret."+ b'\x0b'*11
    ciphertextHex = "8d20e5056a8d24d0462ce74e4904c1b513e10d1df4a2ef2ad4540fae1ca0aaf9"
    ciphertext = unhexlify(ciphertextHex)
    # print("ciphertext:",ciphertext)
    words_list = loadData() 
    # print(words_list)
    for word in words_list:
        # Convert the word to bytes and pad with spaces if it's shorter than 16 characters
        key = word + b' ' * (16 - len(word))

        # Create an AES cipher object with the key and IV set to all zeros
        cipher = AES.new(key, AES.MODE_CBC, bytes(16))
        
        # Decrypt the ciphertext
        decrypted = cipher.decrypt(ciphertext)
        # print(f"decrepted is: ",{decrypted})
        # Check if the decrypted result matches the plaintext
       
        if decrypted == plaintext:
            print(f"Found key is: {key.decode('utf-8')}")
            break
    else:
        print("OPPS! Didn't find the key")

if __name__ == "__main__":
    main()
