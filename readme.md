### moka react exercise




1. install dependencies
    ```js
        npm install
    ```
2. setup application
    
    * development 
    
    ```$xslt
       npm run dev
    ```
    then open browser and visit [`localhost:8080/dist/index.html`](http://localhost:8080/dist/index.html)
    
    * production 
        
    ```$xslt
       npm run product
    ```
    the finally codes will be output at `./dist`, then server it by nginx or other web servers
    
    in case of ngnix , we can simply config like this
     
     ```
       server {
               listen       80;
               root  ~/Projects/ReactExercise/dist;
               location / {
                  index index.html;
                  try_files $uri $uri/ /index.html =404;
               }
           }
    ```
    
    
    
    
    
    
******
 
 
 
 
 