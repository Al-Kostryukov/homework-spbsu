log_format myformat '$connection_requests \t $remote_addr \t $status \t $request';

error_log /elbree.ru/log/nginx/error.log;
access_log /elbree.ru/log/nginx/access.log myformat;


upstream nodejs {
	ip_hash;
	server 127.0.0.1:1337;
	#server 127.0.0.1:1338;
	#server 127.0.0.1:1339;
	#server 127.0.0.1:1340;
}


server {
	listen 80 default_server;
	listen [::]:80 default_server;

	#root /elbree.ru;

	index index.html index.htm index.nginx-debian.html;

	server_name localhost;
	
	gzip on;
	gzip_disable "msie6";
	gzip_types *;
	gzip_comp_level 5;

	location / {
		proxy_pass http://nodejs;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}

	location /public/ {
		root  /elbree.ru/app/client;
		expires max;
		gzip_comp_level 9;
	}

	location /vendor/ {
		root  /elbree.ru/app/client;
		expires max;
		gzip_comp_level 9;
	}

	location /secure/ {
		root  /elbree.ru/app/client;
		expires max;
		gzip_comp_level 9;
	}
}

