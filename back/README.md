# Installtion
```bash
$ npm install 
```

## One time only
This command populates some users so that you can sign in

Run this in production or dev only once
```bash
$ mongorestore --db persian_framenet persian_framenet
```
Default user and pass is

USER : admin@gmail.com

PASS : 12345678


## Dev Mode
Do the commands in two different terminals
```bash
$ cd ../front && npm run dev
```
```bash
$  npm run dev
```
## Production
```bash
$ cd ../front && npm run build && cd ../backend && nohup npm run start >/dev/null 2>&1 &
```

## NGINX config
### you should specify server_name and proxy_pass
```nginx
server {
        listen 80;
        listen [::]:80;

        server_name 0.0.0.0;

        location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                proxy_read_timeout 1800;
                proxy_connect_timeout 1800;
                proxy_send_timeout 1800;
                send_timeout 1800;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }

}
```