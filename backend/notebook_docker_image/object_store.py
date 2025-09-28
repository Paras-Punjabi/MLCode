import minio
from minio.error import S3Error
from pathlib import Path
from abc import ABC, abstractmethod

class ObjectStore(ABC):
    @abstractmethod
    def upload_object(self):
        ...

    @abstractmethod
    def delete_object(self):
        ...

    @abstractmethod
    def get_objects(self):
        ...

    @abstractmethod
    def download_object(self):
        ...

    @abstractmethod
    def is_object_present(self):
        ...

class MinioObjectStore(minio.Minio,ObjectStore):
    def __init__(self, endpoint, access_key, secret_key,secure,user_id,problem_id,bucket_name,watch_dir):
        super().__init__(endpoint=endpoint,access_key=access_key,secret_key=secret_key,secure=secure)
        print("==> MINIO Connected!!")

        self.user_id = user_id
        self.problem_id = problem_id
        self.bucket_name = bucket_name
        
        parts = list(Path(watch_dir).parts)
        parts = [item for item in parts if item != "\\"]
        self.watch_dir = "/".join(parts) + "/"
        self.object_prefix = f"{self.user_id}/{self.problem_id}/"
        
        if(not self.bucket_exists(self.bucket_name)):
            self.make_bucket(self.bucket_name)
            print(f"==> MINIO Bucket Created: {self.bucket_name}")
    
    def create_object_name(self,file_path):
        path_list = list(Path(file_path).parts)
        path_list = [item for item in path_list if item != "\\"]
        path = "/".join(path_list)
        path = path[len(self.watch_dir):]
        path = self.object_prefix + path
        return path
            
    def upload_object(self,file_path):
        if(".ipynb_checkpoints" in file_path):
            return
        object_name = self.create_object_name(file_path)
        print("Object name", object_name)
        self.fput_object(self.bucket_name,object_name,file_path)
        print(f"==> File Uploaded to Minio : {object_name}")

    def delete_object(self,file_path):
        if(".ipynb_checkpoints" in file_path):
            return
        object_name = self.create_object_name(file_path)
        print("Object name", object_name)
        object_list = self.list_objects(self.bucket_name,prefix=object_name,recursive=True)
        object_list = [item.object_name for item in list(object_list)]

        for item in object_list:
            self.remove_object(self.bucket_name,item)
            print(f"==> File Deleted from Minio : {item}")
    
    def get_objects(self,prefix):
        return super().list_objects(bucket_name=self.bucket_name,prefix=prefix,recursive=True)

    def download_object(self,object_name,file_path):
        return super().fget_object(bucket_name=self.bucket_name,object_name=object_name,file_path=file_path)

    def is_object_present(self,object_name):
        try:
            super().stat_object(bucket_name=self.bucket_name,object_name=object_name)
            return True
        except S3Error as e:
            return False