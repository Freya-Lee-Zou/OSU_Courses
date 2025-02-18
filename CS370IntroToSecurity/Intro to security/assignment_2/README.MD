### Reminder:
1. Due to not having an Android phone, I am unable to test my program with the GA Android app; therefore, I can only test it against an iOS app
2. Please ensure that you have the cryptography and qrcode libraries installed on your local machine. If not, you can use the following commands to install:
- pip3 install cryptography
- pip3 install qrcode

### Structure of  totp.py 
The totp.py is divided into two sections by the notation: =================BONUS Part=============
          ===============Part I and Par II==========
Firstly, running the command to generate a QR code creates the 'secret.txt' file, where the content is encoded in base32. Additionally, a random key is generated to encrypt the 'secret.txt' file. Later, when you run the command to generate an OTP, it decrypts the text file first before obtaining the OTP and then uses the same key to encrypt the secret.txt file.

## =======Commands TO RUN THE PROGRAM ==========
Note: When you run the second command (python3 totp.py --get-otp), the program will run indefinitely. If you wish to stop the execution, use Control+C on macOS or Ctrl+C on Windows.
- Part 1: Generate QR code: python3 totp.py --generate-qr
- Part 2: Generate OTP: python3 totp.py --get-otp

## ===========Bonus=======================
I used the `cryptography.fernet` library to encrypt the 'secret.txt' file with a randomly generated key, which I saved in the 'filekey.key' file. A new key should be generated whenever you create a new QR code. Therefore, the password acts like a 'one-time' password. Consequently, there is no need to worry about the security of the 'filekey.key'. For secure key storage, you can keep the file on your local machine."