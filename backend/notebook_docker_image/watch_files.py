import os
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer
from object_store import MinioObjectStore        

class FilesHandler(FileSystemEventHandler):
    def __init__(self,endpoint, access_key, secret_key,user_id,problem_id,bucket_name,watch_dir):
        super().__init__()
        self.endpoint = endpoint
        self.access_key = access_key
        self.secret_key = secret_key
        self.user_id = user_id
        self.problem_id = problem_id
        self.bucket_name = bucket_name
        
        self.obj_store_client = MinioObjectStore(endpoint, access_key, secret_key,False,user_id,problem_id,bucket_name,watch_dir)
        
        self.object_prefix = f"{self.user_id}/{self.problem_id}/"

        for item in self.get_all_files(watch_dir):
            self.obj_store_client.upload_object(item)

    def get_all_files(self,path):
        files = []
        def solve(path):
            if(".ipynb_checkpoints" in path):
                return
            if(os.path.isfile(path)):
                files.append(path.replace("\\","/")[2:])
                return
            for item in os.listdir(path):
                solve(os.path.join(path,item))
        solve(path)
        
        return files
    
    def on_modified(self, event):
        try:
            if(event.is_directory):
                return
            self.obj_store_client.upload_object(event.src_path)
        except Exception as e:
            print(f"==> Error: {e}")
            
    def on_created(self, event):
        try:
            if(event.is_directory):
                return
            self.obj_store_client.upload_object(event.src_path)
        except Exception as e:
            print(f"==> Error: {e}")

    def on_deleted(self, event):
        try:
            if(event.is_directory):
                return
            self.obj_store_client.delete_object(event.src_path)
        except Exception as e:
            print(f"==> Error: {e}")

    def on_moved(self, event):
        try:
            if(event.is_directory):
                return

            self.obj_store_client.upload_object(event.dest_path)
            self.obj_store_client.delete_object(event.src_path)
            
            print(f"==> File Renamed from {event.src_path} to {event.dest_path}")
            
        except Exception as e:
            print(f"==> Error: {e}")

class WatchFiles:
    def __init__(self,endpoint,access_key,secret_key,user_id,problem_id,bucket_name,watch_dir):
        self.handler = FilesHandler(endpoint,access_key,secret_key,user_id,problem_id,bucket_name,watch_dir)
        self.observer = Observer()
        self.watch_dir = watch_dir
        
    def start(self):
        self.observer.schedule(self.handler,self.watch_dir,recursive=True)
        self.observer.start()
        print("==> WatchDog Started..")
        try:
            while self.observer.is_alive():
                pass
        except:
            self.observer.stop()

        self.observer.join()

