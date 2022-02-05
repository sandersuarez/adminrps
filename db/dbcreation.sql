/* Database creation */
CREATE DATABASE IF NOT EXISTS adminrps;
USE adminrps;

/* Users table creation */
CREATE TABLE IF NOT EXISTS users
	(
	coduser INT UNSIGNED,
    nameuser VARCHAR(60) NOT NULL,
    keyuser VARCHAR(255) NOT NULL,
    ivaprefuser DECIMAL(3,2) UNSIGNED NOT NULL,
    datlastkeyuser DATE NOT NULL DEFAULT (CURDATE()),
    CONSTRAINT pk_users PRIMARY KEY (coduser)
	) COLLATE 'utf8_bin';

/* Products table creation */
CREATE TABLE IF NOT EXISTS products
	(
    codproduct INT UNSIGNED,
    nameproduct VARCHAR (240) NOT NULL COLLATE 'utf8_spanish_ci',
    stockproduct INT UNSIGNED NULL DEFAULT NULL,
    priceproduct DECIMAL(5,2) UNSIGNED NOT NULL,
    coduser INT UNSIGNED NOT NULL,
    CONSTRAINT pk_products PRIMARY KEY (codproduct),
    CONSTRAINT fk_products_users FOREIGN KEY (coduser)
		REFERENCES users (coduser) ON DELETE CASCADE
        ON UPDATE CASCADE
    ) COLLATE 'utf8_bin';
    
/* Customers table creation */
CREATE TABLE IF NOT EXISTS customers
	(
    codcustomer INT UNSIGNED,
    namecustomer VARCHAR (60) NOT NULL COLLATE 'utf8_spanish_ci',
    telcustomer CHAR(9) NOT NULL,
    coduser INT UNSIGNED NOT NULL,
    CONSTRAINT pk_customers PRIMARY KEY (codcustomer),
    CONSTRAINT fk_customers_users FOREIGN KEY (coduser)
		REFERENCES users (coduser) ON DELETE CASCADE
        ON UPDATE CASCADE
    ) COLLATE 'utf8_bin';
    
/* Orders table creation */
CREATE TABLE IF NOT EXISTS orders
	(
    codorder INT UNSIGNED,
    numdayorder SMALLINT UNSIGNED NOT NULL,
    dateorder DATE NOT NULL DEFAULT (CURDATE()),
    hourorder TIME NOT NULL DEFAULT (CURTIME()),
    ordersold BIT NOT NULL DEFAULT 0,
    moneyreceived DECIMAL(5,2) UNSIGNED NULL,
    codcustomer INT UNSIGNED NOT NULL,
    CONSTRAINT pk_orders PRIMARY KEY (codorder),
    CONSTRAINT fk_orders_customer FOREIGN KEY (codcustomer)
		REFERENCES customers (codcustomer) ON DELETE NO ACTION
        ON UPDATE CASCADE
    ) COLLATE 'utf8_bin';

/* Contain table creation */
CREATE TABLE IF NOT EXISTS contain
	(
    codproduct INT UNSIGNED,
    codorder INT UNSIGNED,
    amountproductorder TINYINT UNSIGNED NOT NULL,
    CONSTRAINT pk_contain PRIMARY KEY (codproduct, codorder),
    CONSTRAINT fk_contain_product FOREIGN KEY (codproduct)
		REFERENCES products (codproduct) ON DELETE NO ACTION
        ON UPDATE CASCADE,
    CONSTRAINT fk_contain_order FOREIGN KEY (codorder)
		REFERENCES orders (codorder) ON DELETE NO ACTION
        ON UPDATE CASCADE
    ) COLLATE 'utf8_bin';