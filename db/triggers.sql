USE adminrps;

/* If an order is added, it can't be already sold and it can't have money received from the customer. If so, the manager will throw an exception. */

DROP TRIGGER IF EXISTS triggerinsertorder;

delimiter ::

CREATE TRIGGER triggerinsertorder
	BEFORE INSERT 
		ON orders
	FOR EACH ROW
		BEGIN
			IF (NEW.ordersold = 1) THEN 
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be created as sold';
			END IF;
            
            IF (NEW.moneyreceived IS NOT NULL) THEN 
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be created with money received from the customer already';
			END IF;
            
            IF (NEW.orderisdraft = 1) THEN
				IF (NEW.dateorder IS NOT NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An draft cannot be created with order creation date';
				END IF;
				IF (NEW.hourorder IS NOT NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An draft cannot be created with order creation hour';
				END IF;
				IF (NEW.numdayorder IS NOT NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An draft cannot be created with order number';
				END IF;
				IF (NEW.idordersold IS NOT NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An draft cannot be created with order id';
				END IF;
            END IF;
            
            IF (NEW.orderisdraft = 0) THEN
				IF (NEW.numdayorder IS NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be created if it has no order number';
				END IF;
                IF (NEW.dateorder IS NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be created if it has no creation date';
				END IF;
                IF (NEW.hourorder IS NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be created if it has no creation hour';
				END IF;
                IF (NEW.codcustomer IS NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be created if it has no customer';
				END IF;
            END IF;
        END::
	
delimiter ;

/* If an order is marked as sold, it must have at least one product and money received by the customer. If not, the manager will throw an exception. 
An order can't be marked as not sold if it has been sold already. */

DROP TRIGGER IF EXISTS triggerupdateorder;

delimiter ::

CREATE TRIGGER triggerupdateorder
	BEFORE UPDATE
		ON orders
	FOR EACH ROW
		BEGIN
			IF (NEW.ordersold = 0) AND (OLD.ordersold = 1) THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be marked as not sold if it has been sold already';
            END IF;
            
            IF (NEW.orderisdraft = 1) AND (OLD.orderisdraft = 0) THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be marked as a draft if it has been saved as order already';
            END IF;
            
            IF (NEW.ordersold = 1) AND (NEW.orderisdraft = 1) THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A draft cannot be marked as sold';
            END IF;
            
            IF (NEW.orderisdraft = 1) THEN
				IF (NEW.dateorder IS NOT NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An draft cannot have order creation date';
                END IF;
                IF (NEW.hourorder IS NOT NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An draft cannot have order creation hour';
				END IF;
                IF (NEW.numdayorder IS NOT NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An draft cannot have order number';
				END IF;
                IF (NEW.idordersold IS NOT NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An draft cannot be created with order id';
				END IF;
            END IF;
            
            IF (NEW.orderisdraft = 0) THEN
				IF (NEW.numdayorder IS NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be created if it has no order number';
                END IF;
				IF (NEW.dateorder IS NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be created if it has no creation date';
				END IF;
				IF (NEW.hourorder IS NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be created if it has no creation hour';
				END IF;
				IF (NEW.codcustomer IS NULL) THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be created if it has no customer';
				END IF;
            END IF;
            
			IF (NEW.orderisdraft = 0) OR (NEW.ordersold = 1) AND NOT EXISTS (
				SELECT contain.codproduct 
					FROM contain 
                    WHERE contain.codorder = NEW.codorder
				) THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be created if it is empty';
            END IF;
            
            IF (NEW.ordersold = 1) THEN
				IF (NEW.moneyreceived) IS NULL THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be sold without money received from the customer';
				END IF;
                IF (NEW.idordersold) IS NULL THEN
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be sold without an order id';
				END IF;
            END IF;
            
            IF (OLD.ordersold = 1) THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be updated if it is sold';
            END IF;
        END::
	
delimiter ;

/* If an order is sold, it can't be deleted or updated */

DROP TRIGGER IF EXISTS triggerdeleteorder;

delimiter ::

CREATE TRIGGER triggerdeleteorder
	BEFORE DELETE
		ON orders
	FOR EACH ROW
		BEGIN
			IF OLD.ordersold = 1 THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be deleted if it is sold';
            END IF;
        END::
	
delimiter ;

DROP TRIGGER IF EXISTS triggerdeletecontain;

delimiter ::

CREATE TRIGGER triggerdeletecontain
	BEFORE DELETE
		ON contain
	FOR EACH ROW
		BEGIN
			IF (SELECT orders.ordersold FROM orders WHERE orders.codorder = OLD.codorder) = 1 THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be deleted if it is sold';
            END IF;
        END::
	
delimiter ;

DROP TRIGGER IF EXISTS triggerupdatecontain;

delimiter ::

CREATE TRIGGER triggerupdatecontain
	BEFORE UPDATE
		ON contain
	FOR EACH ROW
		BEGIN
			IF (SELECT orders.ordersold FROM orders WHERE orders.codorder = OLD.codorder) = 1 THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be updated if it is sold';
            END IF;
        END::
	
delimiter ;

DROP TRIGGER IF EXISTS triggerinsertcontain;

delimiter ::

CREATE TRIGGER triggerinsertcontain
	BEFORE INSERT
		ON contain
	FOR EACH ROW
		BEGIN
			IF (SELECT orders.ordersold FROM orders WHERE orders.codorder = NEW.codorder) = 1 THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be updated if it is sold';
            END IF;
        END::
	
delimiter ;