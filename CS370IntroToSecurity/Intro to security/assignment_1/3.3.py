#********************************************
# Student Name: YA Zou(Suzy)
# Date: 23, Oct, 2023
#********************************************

from cryptography.hazmat.primitives import hashes
import os


def weak_collision():

    digest = hashes.Hash(hashes.SHA256())
    digest.update(b"abc")
    weak_hash_value = digest.finalize()[:3]

    for i in range(15):
        time = 0
        total_iterations = 0
        while True:
            # create 3 bytes random chars
            random_characters = os.urandom(3)
            # print(random_characters)
            digest = hashes.Hash(hashes.SHA256())
            #The bytes to be hashed.
            digest.update(random_characters)
            #Finalize the current context and return the message digest as bytes.
            weak_hash_value_2 = digest.finalize()[:3]
            time += 1
            if weak_hash_value == weak_hash_value_2:
                total_iterations = total_iterations+ time
                break
    average_iterations = total_iterations/5
    #Average number of iterations to find a weak collision:  1991638.40
    print(f"Average number of iterations to find a weak collision: {average_iterations:.2f}")         
     

def strong_collision():
  
  total_iteration = 0
  for i  in range(16):
    flag = True
    count_times = 0
    list = []
    while flag == True:
        str1 = os.urandom(3)
        digest = hashes.Hash(hashes.SHA256())
        digest.update(str1)
        hash1 = digest.finalize()
        list.append(hash1[:3])
        if len(list) > 1:
            for i in range(len(list)-1):
                if list[i] == hash1[:3]:
                    flag = False
                    break
          
        count_times += 1
    total_iteration += count_times
  print("Average amount of trials for strong collision: ", total_iteration /16)


def main():
    weak_collision()
    strong_collision()

if __name__ == "__main__":
    main()
