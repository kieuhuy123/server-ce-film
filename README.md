## Setup lib project
    - express
    - helmet
    - bcrypt": "^5.1.0",: encrypt, decrypt
    - body-parser": "^1.20.2",: config parser request body
    - compression": "^1.7.4",: nen request response
    - cookie-parser": "^1.4.6",: config parser request body
    - dotenv": "^16.0.3",: cau hinh doc file enviroment .env
    - helmet": "^6.0.1",: Che dau thong tin stack phia server, thong tin rieng tu...
    - html-to-text": "^9.0.4",: convert html to text
    - jsonwebtoken": "^9.0.0",: thu vien jwt
    - lodash": "^4.17.21",
    - mongoose": "^6.9.2",: connect mongodb
    - morgan": "^1.10.0",: thu vien in ra cac log khi mot nguoi dung request xuong
    - nodemailer": "^6.9.1",: cho phep send mail
    - slugify": "^1.6.6",: convert text to slug, example: ao khoac nam -> ao-khoac-nam
    - swagger-ui-express": "^4.6.2": config swagger
    - nodemon
    - redis: using cache redis
  
## Mongodb
    - Nhược điểm của cách connect cũ
    - Cách connect mới, khuyên dùng
    - Kiểm tra hệ thống có bao nhiêu connect
    - THông báo khi server quá tải connect
    - Có nên disConnect liên tục hay không?
    - PoolSize là gì? vì sao lại quan trọng?
    - Nếu vượt quá kết nối poolsize?
    - MongoDB Desing pattern
          - Polymorphic pattern
          - Attribute pattern
          - Bucket pattern
          - Outlier pattern
          - Computed pattern
          - Subnet pattern
          - Extended reference pattern
          - Approximation pattern
          - Tree pattern
          - Preallocation pattern
          - Document versioning pattenr
          - Schema versioning pattern
### Api key
    `Lưu trữ key cung cấp cho các đối tác được truy cập vào hệ thống`

### Design Schema MongoDB - Polymorphic Pattern
    - 1document 1kb -> 50tr = 50gb
