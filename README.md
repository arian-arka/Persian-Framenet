# Persian Framenet
**Introduction**

An easy and high customizable cli with pre-built features.

- [Description](#description)
    - [Glossary](GLOSSARY.md)
- [Installation](#installation)
- [Running Dev](#running-dev)
- [Deploy Production](#deploy-production)
    - [NGINX Config](#nginx-suggested-config)
- [Defaults](#defaults)


## Description
Persian Framenet is an online lexical databases for persian linguists based upon the theory of meaning known as Frame semantics

---------------------------------

## Running Dev
```bash
 cd front & node deployToBack.js & cd ../backend &  npm run start
```

---------------------------------

## Deploy Production
```bash
 cd front & node deployToBack.js https://your-domain.example & cd ../backend & nohup npm run start >/dev/null 2>&1 &
```
### NGINX Suggested Config
you should specify server_name and proxy_pass
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

---------------------------------

## Defaults

- Default User Credentials to login
    - Username : admin@gmail.com
    - Password : 12345678
    - base url : /

---------------------------------

    