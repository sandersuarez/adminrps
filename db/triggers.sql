USE adminrps;

/* If an order is sold, it cannot be deleted or updated */

DROP TRIGGER IF EXISTS triggerupdateorder;

delimiter ::

CREATE TRIGGER triggerupdateorder
	BEFORE UPDATE
		ON orders
	FOR EACH ROW
		BEGIN
			IF EXISTS (
            SELECT codorder
				FROM orders_sold
				WHERE codorder = OLD.codorder
			) AND (USER() = 'adminrps@127.0.0.1') THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be updated if it is sold';
			END IF;
        END::
	
delimiter ;

DROP TRIGGER IF EXISTS triggerinsertorderscontain;

delimiter ::

CREATE TRIGGER triggerinsertorderscontain
	BEFORE INSERT
		ON orders_contain
	FOR EACH ROW
		BEGIN
			IF EXISTS (
            SELECT codorder
				FROM orders_sold
				WHERE codorder = NEW.codorder
			) AND (USER() = 'adminrpsuser@127.0.0.1') THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be updated if it is sold';
            END IF;
        END::
	
delimiter ;

DROP TRIGGER IF EXISTS triggerdeleteorderscontain;

delimiter ::

CREATE TRIGGER triggerdeleteorderscontain
	BEFORE DELETE
		ON orders_contain
	FOR EACH ROW
		BEGIN
			IF EXISTS (
            SELECT codorder
				FROM orders_sold
				WHERE codorder = OLD.codorder
			) AND (USER() = 'adminrpsuser@127.0.0.1') THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be deleted if it is sold';
            END IF;
        END::
	
delimiter ;

DROP TRIGGER IF EXISTS triggerupdateorderscontain;

delimiter ::

CREATE TRIGGER triggerupdateorderscontain
	BEFORE UPDATE
		ON orders_contain
	FOR EACH ROW
		BEGIN
			IF EXISTS (
            SELECT codorder
				FROM orders_sold
				WHERE codorder = OLD.codorder
			) AND (USER() = 'adminrpsuser@127.0.0.1') THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be updated if it is sold';
            END IF;
        END::
	
delimiter ;

/* The drafts cannot have both a customer name and customer phone number and a customer code */

DROP TRIGGER IF EXISTS triggerinsertdraft;

delimiter ::

CREATE TRIGGER triggerinsertdraft
	BEFORE INSERT
		ON drafts
	FOR EACH ROW
		BEGIN
			IF ((NEW.namecustomertmp IS NOT NULL OR NEW.telcustomertmp IS NOT NULL) AND NEW.codcustomer IS NOT NULL) THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A draft cannot have both a customer name and customer phone number and a customer code ';
            END IF;
        END::
	
delimiter ;

DROP TRIGGER IF EXISTS triggerupdatedraft;

delimiter ::

CREATE TRIGGER triggerupdatedraft
	BEFORE UPDATE
		ON drafts
	FOR EACH ROW
		BEGIN
			IF ((NEW.namecustomertmp IS NOT NULL OR NEW.telcustomertmp IS NOT NULL) AND NEW.codcustomer IS NOT NULL) THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A draft cannot have both a customer name and customer phone number and a customer code ';
            END IF;
        END::
	
delimiter ;