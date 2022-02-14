USE adminrps;

/* If a user is deleted, all his data must be deleted too. */

DROP TRIGGER IF EXISTS triggerdeleteuser;

delimiter ::

CREATE TRIGGER triggerdeleteuser
	BEFORE DELETE 
		ON users
	FOR EACH ROW
		BEGIN
			SET SQL_SAFE_UPDATES = 0;
            
			DELETE FROM contain 
				WHERE contain.codorder IN (
                SELECT orders.codorder 
					FROM orders 
                    WHERE orders.codcustomer IN (
                    SELECT customers.codcustomer 
						FROM customers 
                        WHERE customers.coduser = OLD.coduser
					)
				);
			
			DELETE FROM orders
				WHERE orders.codcustomer IN (
                SELECT customers.codcustomer 
					FROM customers 
                    WHERE customers.coduser = OLD.coduser
				);
                
			DELETE FROM products 
				WHERE products.coduser = OLD.coduser;
                
			DELETE FROM customers
				WHERE customers.coduser = OLD.coduser;
                
			SET SQL_SAFE_UPDATES = 1;
        END::
	
delimiter ;

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
        END::
	
delimiter ;

/* If an order is marked as sold, it must have at least one product and money received by the customer. If not, the manager will throw an exception. 
An order can't be marked as not sold if it has been sold already. */

DROP TRIGGER IF EXISTS triggersellorder;

delimiter ::

CREATE TRIGGER triggersellorder
	BEFORE UPDATE
		ON orders
	FOR EACH ROW
		BEGIN
			IF (NEW.ordersold = 0) AND (OLD.ordersold = 1) THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be marked as not sold if it has been sold already.';
            END IF;
            
			IF (NEW.ordersold = 1) AND NOT EXISTS (
				SELECT contain.codproduct 
					FROM contain 
                    WHERE contain.codorder = NEW.codorder
				) THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be sold if it is empty';
            END IF;
            
            IF (NEW.ordersold = 1) AND NEW.moneyreceived IS NULL THEN
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order cannot be sold without money received from the customer';
            END IF;
        END::
	
delimiter ;

/* If an order is sold, it can't be deleted */

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