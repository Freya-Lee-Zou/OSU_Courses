# ***********************************************************
# Student: Ya Zou                                           *
# Email: zouy2@oregonstate.edu                              *
# Code is referenced: https://medium.com/analytics-vidhya/  *   
# understanding-totp-in-python-bbe994606087                 *
# ********************************************
import time,os,urllib.parse,qrcode,hmac,sys, struct,hashlib,base64
from cryptography.fernet import Fernet,InvalidToken

# =================BONUS Part=============
# Function to generate a random key and store it in a file
def generate_and_store_key():
    key = Fernet.generate_key() 
    with open('filekey.key', 'wb') as filekey:
        filekey.write(key)
    return key
# Function to read the stored key from the file
def read_key():
    with open('filekey.key', 'rb') as filekey:
        return filekey.read()

# Function to encrypt the file with a given key
def encrypt_file(key):
    fernet = Fernet(key)
    with open('secret.txt', 'rb') as file:
        original = file.read()
    encrypted = fernet.encrypt(original)
    with open('secret.txt', 'wb') as encrypted_file:
        encrypted_file.write(encrypted)

def decrypt_file(key):
    fernet = Fernet(key)
    try:
        with open('secret.txt', 'rb') as enc_file:
            encrypted = enc_file.read()
        decrypted = fernet.decrypt(encrypted)
        with open('secret.txt', 'wb') as dec_file:
            dec_file.write(decrypted)
        print(" Decryption successful.")
    except InvalidToken:
        print("InvalidToken: The provided key or token is incorrect or corrupted.")
    except Exception as e:
        print(f"An error occurred during decryption: {e}")

#===============Part I and Par II==========
#===============Starts Here================
def generateQRcode():
    
    # Generate a random 10-byte binary string
    secret_bytes = os.urandom(10)
    # Encode the binary secret using base32
    secret_encoded = base64.b32encode(secret_bytes).decode('utf-8')
    file_path = "secret.txt"
    # Open the file in write mode ('w')
    with open(file_path, 'w') as file:
        # Write the data to the file
        file.write(secret_encoded)
    
    issuer = "TOTP"
    account_name = "zouy2@oregonstate.edu"
    algorithm = "SHA1"
    digits = 6
    period = 30

    # create a uri
    uri = f'otpauth://totp/{urllib.parse.quote(issuer)}:{urllib.parse.quote(account_name)}?secret={secret_encoded}&issuer={urllib.parse.quote(issuer)}&algorithm={algorithm}&digits={digits}&period={period}'
    
    # Create a QR code image
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(uri)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white")
    # Save the image
    image_name = "qrCode.jpg"
    qr_img.save(image_name)


def get_totp_token(secret):
    # Ensuring to give the same OTP for 30 seconds
    resVal = str(get_hotp_token(secret, intervals_no=int(time.time()) // 30))
    
    # Adding 0 in the beginning till OTP has 6 digits
    while len(resVal) < 6:
        resVal = '0' + resVal
    # Truncate the OTP if it starts with '00'
    resVal = str(int(resVal))
    return resVal.zfill(6)

def get_hotp_token(secret, intervals_no):
    key = base64.b32decode(secret, True)
    # Decoding our key
    msg = struct.pack(">Q", intervals_no)
    # Conversions between Python values and C structs represented
    h = hmac.new(key, msg, hashlib.sha1).digest()
    o = h[19] & 15
    # Generate a hash using both of these. Hashing algorithm is HMAC
    h = (struct.unpack(">I", h[o:o+4])[0] & 0x7fffffff) % 1000000
    return h

def main():
    if len(sys.argv) != 2:
        print("Invalid number of arguments. Please provide a valid command: python3 totp.py --get-otp or --generate-qr")
        sys.exit()
    arg1 = sys.argv[1]
    if arg1 == "--generate-qr":
        #global global_key
        print(" Please wait for QR code generating...")
        time.sleep(2)
        generateQRcode()
        print(" QR code generation completed")
        print(" Encrypting the secret.txt...")
        key = generate_and_store_key()
        encrypt_file(key)
        print(f" secret.txt is successfully encrypted with the key:{key}")
    elif arg1 == "--get-otp":
        key_decrypt = read_key()
        print(" Decrypting the secret.txt...")
        decrypt_file(key_decrypt)
        with open("secret.txt", "r") as file:
            secret_key = file.read()
        encrypt_file(key_decrypt)
        while True:
            current_time = int(time.time()) % 30
            time_left = 30 - current_time
            print(f" The code:{get_totp_token(secret_key)} is valid for {time_left} seconds.")
            time.sleep(time_left) 
            print(f" The code:{get_totp_token(secret_key)} is valid for 30 seconds.") 
            time.sleep(30) 
    else:   
        print('''  ========= Welcome To My TOTP Assignment=======
            1.To generate QR code run the command: python3 totp.py --generate-qr
            2.To get OTP: python3 totp.py --get-otp
        ''')
if __name__ == "__main__":
    main()
