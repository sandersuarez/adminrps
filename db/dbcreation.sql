/* Database creation */
CREATE DATABASE IF NOT EXISTS adminrps;
USE adminrps;

/* Users table creation */
CREATE TABLE IF NOT EXISTS users
	(
	coduser INT,
    nameuser VARCHAR(60) NOT NULL,
    keyuser VARCHAR(255) NOT NULL,
    ivaprefuser DECIMAL(3,2) NOT NULL,
    datlastkeyuser DATE NOT NULL DEFAULT (CURDATE()),
    CONSTRAINT pk_users PRIMARY KEY (coduser),
    CONSTRAINT coduser_unsigned CHECK (coduser >= 0),
    CONSTRAINT ivaprefuser_unsigned CHECK (ivaprefuser >= 0 AND ivaprefuser <= 1)
	) COLLATE 'utf8mb4_bin';

/* Products table creation */
CREATE TABLE IF NOT EXISTS products
	(
    codproduct INT,
    nameproduct VARCHAR (240) NOT NULL COLLATE 'utf8mb4_spanish_ci',
    stockproduct INT NULL DEFAULT NULL,
    priceproduct DECIMAL(5,2) NOT NULL,
    productdeleted BIT NOT NULL DEFAULT 0,
    coduser INT NOT NULL,
    CONSTRAINT pk_products PRIMARY KEY (codproduct),
    CONSTRAINT codproduct_unsigned CHECK (codproduct >= 0),
    CONSTRAINT stockproduct_unsigned CHECK (stockproduct >= 0),
    CONSTRAINT priceproduct_unsigned CHECK (priceproduct >= 0),
    CONSTRAINT fk_products_users FOREIGN KEY (coduser)
		REFERENCES users (coduser) ON DELETE CASCADE
        ON UPDATE CASCADE
    ) COLLATE 'utf8mb4_bin';
    
/* Customers table creation */
CREATE TABLE IF NOT EXISTS customers
	(
    codcustomer INT,
    namecustomer VARCHAR (60) NOT NULL COLLATE 'utf8mb4_spanish_ci',
    telcustomer CHAR(9) NOT NULL,
    coduser INT NOT NULL,
    CONSTRAINT pk_customers PRIMARY KEY (codcustomer),
    CONSTRAINT codcustomer_unsigned CHECK (codcustomer >= 0),
    CONSTRAINT fk_customers_users FOREIGN KEY (coduser)
		REFERENCES users (coduser) ON DELETE CASCADE
        ON UPDATE CASCADE
    ) COLLATE 'utf8mb4_bin';
    
/* Orders table creation */
CREATE TABLE IF NOT EXISTS orders
	(
    codorder INT,
    idordersold CHAR(6) NULL DEFAULT NULL,
    numdayorder MEDIUMINT NULL DEFAULT NULL,
    dateorder DATE NULL DEFAULT NULL,
    hourorder TIME NULL DEFAULT NULL,
    moneyreceived DECIMAL(5,2) NULL DEFAULT NULL,
    ordersold BIT NOT NULL DEFAULT 0,
    orderisdraft BIT NOT NULL DEFAULT 1,
    codcustomer INT NULL DEFAULT NULL,
    coduser INT NOT NULL,
    CONSTRAINT pk_orders PRIMARY KEY (codorder),
    CONSTRAINT numdayorder_unsigned CHECK (numdayorder > 0),
    CONSTRAINT moneyreceived_unsigned CHECK (moneyreceived >= 0),
    CONSTRAINT fk_orders_customer FOREIGN KEY (codcustomer)
		REFERENCES customers (codcustomer) ON DELETE NO ACTION
        ON UPDATE CASCADE,
	CONSTRAINT fk_orders_users FOREIGN KEY (coduser)
		REFERENCES users (coduser) ON DELETE CASCADE
		ON UPDATE CASCADE
    ) COLLATE 'utf8mb4_bin';

/* Contain table creation */
CREATE TABLE IF NOT EXISTS contain
	(
    codproduct INT,
    codorder INT,
    amountproductorder SMALLINT NOT NULL DEFAULT 1,
    CONSTRAINT pk_contain PRIMARY KEY (codproduct, codorder),
    CONSTRAINT amountproductorder_restriction CHECK (amountproductorder > 0),
    CONSTRAINT fk_contain_product FOREIGN KEY (codproduct)
		REFERENCES products (codproduct) ON DELETE NO ACTION
        ON UPDATE CASCADE,
    CONSTRAINT fk_contain_order FOREIGN KEY (codorder)
		REFERENCES orders (codorder) ON DELETE NO ACTION
        ON UPDATE CASCADE
    ) COLLATE 'utf8mb4_bin';