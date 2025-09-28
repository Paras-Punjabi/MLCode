import os
import json
import subprocess
import threading
import time
from watch_files import WatchFiles
from object_store import MinioObjectStore

#* ENV & CONSTANT Variables
MINIO_URI = os.getenv("MINIO_URI")
MINIO_ROOT_USER = os.getenv("MINIO_ROOT_USER")
MINIO_ROOT_PASSWORD = os.getenv("MINIO_ROOT_PASSWORD")
USER_ID = os.getenv("USER_ID")
PROBLEM_ID = os.getenv("PROBLEM_ID")
BUCKET_NAME = "notebooks"
WATCH_DIR = "/app"

class NotebookContainer:
    def __init__(self,endpoint,access_key,secret_key,user_id,problem_id,bucket_name,watch_dir):
        self.endpoint = endpoint
        self.access_key = access_key
        self.secret_key = secret_key
        self.user_id = user_id
        self.problem_id = problem_id
        self.bucket_name = bucket_name
        self.watch_dir = watch_dir

        self.obj_store_client = MinioObjectStore(endpoint,access_key,secret_key,False,user_id,problem_id,bucket_name,watch_dir)
        
    def pull_objects_from_minio(self):
        objects = self.obj_store_client.get_objects(prefix=f"{self.user_id}/{self.problem_id}")

        for item in objects:
            file_name = item.object_name.replace(f"{self.user_id}/{self.problem_id}",self.watch_dir)
            self.obj_store_client.download_object(object_name=item.object_name,file_path=file_name)
        
        print("==> Notebook and other files PULLED from MINIO")
    
    def create_notebook(self):
        content = {"cells": [],"metadata": {"kernelspec":{"name": "python3","display_name": "Python 3","language": "python"}},"nbformat": 4,"nbformat_minor": 5}
        print("==> Notebook Does not Exists")

        notebook_path = os.path.join(self.watch_dir,"main.ipynb") 
        with open(notebook_path,"w") as file:
            file.write(json.dumps(content))
        
        self.obj_store_client.upload_object(notebook_path)
        
        print("==> Notebook Created in MINIO")
        
    def run_jupyter(self):
        notebook_path = os.path.join(self.watch_dir,"main.ipynb") 
        while(not os.path.exists(notebook_path)):
            time.sleep(1)

        subprocess.run([
            "jupyter", 
            "notebook",
            "--NotebookApp.token=", 
            "--ip=0.0.0.0", 
            "--no-browser", 
            "--allow-root", 
            notebook_path
        ],check=True)
    
    def run(self):
        is_present = self.obj_store_client.is_object_present(object_name=f"{self.user_id}/{self.problem_id}/main.ipynb")

        if(is_present):
            print("==> Notebook Exists in MINIO")
            self.pull_objects_from_minio()
        else:
            self.create_notebook()
                
        watch_files = WatchFiles(self.endpoint,self.access_key,self.secret_key,self.user_id,self.problem_id,self.bucket_name,self.watch_dir)
        
        t1 = threading.Thread(target=watch_files.start)
        t2 = threading.Thread(target=self.run_jupyter)
        
        t1.start()
        t2.start()

        t1.join()
        t2.join()

if __name__ == '__main__':
    notebook = NotebookContainer(MINIO_URI,MINIO_ROOT_USER,MINIO_ROOT_PASSWORD,USER_ID,PROBLEM_ID,BUCKET_NAME,WATCH_DIR)
    notebook.run()