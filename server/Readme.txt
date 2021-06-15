========== Update Package ==========
npm install

========== SET mysql cred in .env ==========


========== Update Models ==========
sequelize-auto -o "./models" -d product_demo -h 192.168.64.2 -u jayesh -p 3306 -x jayesh -e mysql 

========== Start Project ==========
node server

