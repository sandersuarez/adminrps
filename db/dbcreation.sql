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
    codproduct BIGINT,
    nameproduct VARCHAR(240) NOT NULL COLLATE 'utf8mb4_spanish_ci',
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
    codcustomer BIGINT,
    namecustomer VARCHAR(60) NOT NULL COLLATE 'utf8mb4_spanish_ci',
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
    codorder BIGINT,
    numdayorder MEDIUMINT NOT NULL,
    dateorder DATE NOT NULL DEFAULT (CURDATE()),
    hourorder TIME NOT NULL DEFAULT (CURTIME()),
    pickuptime TIME NULL DEFAULT NULL,
    codcustomer BIGINT NOT NULL,
    CONSTRAINT pk_orders PRIMARY KEY (codorder),
    CONSTRAINT codorder_unsigned CHECK (codorder > 0),
    CONSTRAINT numdayorder_unsigned CHECK (numdayorder > 0),
    CONSTRAINT fk_orders_customer FOREIGN KEY (codcustomer)
		REFERENCES customers (codcustomer) ON DELETE NO ACTION
        ON UPDATE CASCADE
    ) COLLATE 'utf8mb4_bin';
    
/* Orders Sold table creation */
CREATE TABLE IF NOT EXISTS orders_sold
	(
    codordersold BIGINT,
    idordersold CHAR(6) NOT NULL,
    moneyreceived DECIMAL(5,2) NOT NULL,
    dateordersold DATE NOT NULL DEFAULT (CURDATE()),
    hourordersold TIME NOT NULL DEFAULT (CURTIME()),
    codorder BIGINT UNIQUE NOT NULL,
    CONSTRAINT pk_orders_sold PRIMARY KEY (codordersold),
    CONSTRAINT codordersold_unsigned CHECK (codordersold > 0),
    CONSTRAINT moneyreceived_unsigned CHECK (moneyreceived > 0),
    CONSTRAINT fk_orders_sold_order FOREIGN KEY (codorder)
		REFERENCES orders (codorder) ON DELETE NO ACTION
        ON UPDATE CASCADE
    );

/* Orders Contain table creation */
CREATE TABLE IF NOT EXISTS orders_contain
	(
    codproduct BIGINT,
    codorder BIGINT,
    amountproductorder SMALLINT NOT NULL DEFAULT 1,
    CONSTRAINT pk_orders_contain PRIMARY KEY (codproduct, codorder),
    CONSTRAINT amountproductorder_restriction CHECK (amountproductorder > 0),
    CONSTRAINT fk_orders_contain_product FOREIGN KEY (codproduct)
		REFERENCES products (codproduct) ON DELETE NO ACTION
        ON UPDATE CASCADE,
    CONSTRAINT fk_orders_contain_order FOREIGN KEY (codorder)
		REFERENCES orders (codorder) ON DELETE NO ACTION
        ON UPDATE CASCADE
    ) COLLATE 'utf8mb4_bin';
    
/* Drafts table creation */
CREATE TABLE IF NOT EXISTS drafts
	(
    coddraft BIGINT,
    namecustomertmp VARCHAR(60) NULL COLLATE 'utf8mb4_spanish_ci' DEFAULT NULL,
    telcustomertmp VARCHAR(9) NULL DEFAULT NULL,
    pickuptime TIME NULL DEFAULT NULL,
    coduser INT NOT NULL,
    codcustomer BIGINT NULL DEFAULT NULL,
    CONSTRAINT pk_drafts PRIMARY KEY (coddraft),
    CONSTRAINT coddraft_unsigned CHECK (coddraft > 0),
    CONSTRAINT fk_drafts_user FOREIGN KEY (coduser)
		REFERENCES users (coduser) ON DELETE NO ACTION
        ON UPDATE CASCADE,
    CONSTRAINT fk_drafts_customer FOREIGN KEY (codcustomer)
		REFERENCES customers (codcustomer) ON DELETE NO ACTION
        ON UPDATE CASCADE
    );
    
/* Drafts Contain table creation */
CREATE TABLE IF NOT EXISTS drafts_contain
	(
    codproduct BIGINT,
    coddraft BIGINT,
    amountproductdraft SMALLINT NOT NULL DEFAULT 1,
    CONSTRAINT pk_drafts_contain PRIMARY KEY (codproduct, coddraft),
    CONSTRAINT amountproductdraft_restriction CHECK (amountproductdraft > 0),
    CONSTRAINT fk_drafts_contain_product FOREIGN KEY (codproduct)
		REFERENCES products (codproduct) ON DELETE NO ACTION
        ON UPDATE CASCADE,
    CONSTRAINT fk_drafts_contain_draft FOREIGN KEY (coddraft)
		REFERENCES drafts (coddraft) ON DELETE NO ACTION
        ON UPDATE CASCADE
    ) COLLATE 'utf8mb4_bin';