import os
import ftplib
import time

# Hostinger FTP Details
HOST = '195.35.38.142'
PORT = 21
USER = 'u716939471.qwebtesting.tech'
PASS = 'Murshid112!'

# Aapki website ka local folder
LOCAL_DIR = r'C:\Users\Mujtaba Hasan\Downloads\Velora-formazione'

# Jin folders ya files ko upload NAHI karna, unki list:
IGNORE_DIRS = {'.git', '.gemini', 'node_modules', '_old_website_backup', '_back up old website'}
IGNORE_FILES = {'.gitignore', '.antigravityignore', 'package.json', 'package-lock.json', 'upload_to_ftp.py'}

def upload_dir(ftp, local_dir):
    for item in os.listdir(local_dir):
        # Ignore junk/unwanted files and folders
        if item in IGNORE_DIRS or item in IGNORE_FILES or item.endswith('.zip') or item.startswith('.'):
            continue
        
        local_path = os.path.join(local_dir, item)
        
        if os.path.isdir(local_path):
            try:
                # FTP pe folder banayen
                ftp.mkd(item)
            except ftplib.error_perm:
                # Agar pehle se bana hua hai tou ignore karein
                pass
            
            # Us folder ke andar jayen
            ftp.cwd(item)
            # Recursively uske andar ki files upload karein
            upload_dir(ftp, local_path)
            # Wapas bahar aayen
            ftp.cwd('..')
            
        elif os.path.isfile(local_path):
            print(f"Uploading: {item}")
            with open(local_path, 'rb') as f:
                # File upload karein
                ftp.storbinary(f'STOR {item}', f)

def main():
    print("Connecting to FTP server...")
    
    # FTP_TLS use karna zaroori hai Hostinger ke liye
    ftp = ftplib.FTP_TLS()
    try:
        ftp.connect(HOST, PORT, timeout=30)
        ftp.login(USER, PASS)
        ftp.prot_p() # Secure data connection enable karein
        print("Login successful!")
    except Exception as e:
        print(f"Connection failed: {e}")
        return

    print("Starting upload process...")
    # Directly root folder mein files push karna
    upload_dir(ftp, LOCAL_DIR)
    
    ftp.quit()
    print("Upload 100% completed successfully! Sab kuch live hai.")

if __name__ == '__main__':
    main()
