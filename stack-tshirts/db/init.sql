
CREATE DATABASE `tshirts`;

USE `tshirts`;

CREATE TABLE `user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20),
  `address` VARCHAR(255),
  `active` BOOLEAN DEFAULT TRUE,
  `role` ENUM('OPERATOR','CLIENT') DEFAULT 'CLIENT',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `password` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `payment_method` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `card_type` ENUM('VISA','MASTERCARD','AMEX','OTHER'),
  `last_four` CHAR(4),
  `expiry_month` TINYINT,
  `expiry_year` SMALLINT,
  `is_default` BOOLEAN DEFAULT FALSE,
  `token` VARCHAR(255) COMMENT 'Payment processor token for security',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tshirt` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `size` ENUM('xxs','xs','s','m','l','xl','xxl') NOT NULL,
  `gender` ENUM('woman','man','unisex','boy','girl','unisex_kids') NOT NULL,
  `color` VARCHAR(50) NOT NULL,
  `brand` VARCHAR(50) NOT NULL,
  `stock` INT UNSIGNED NOT NULL DEFAULT 0,
  `price` DECIMAL(8,2) NOT NULL,
  `active` BOOLEAN,
  `image` VARCHAR(255),            
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE `customer_order` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('cart','paid','processing','processed','shipped','delivered') NOT NULL DEFAULT 'cart',
  `client` INT UNSIGNED NOT NULL,
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`client`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `customer_order_line` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_order` INT UNSIGNED NOT NULL,
  `product` INT UNSIGNED NOT NULL,
  `sale_price` DECIMAL(8,2) NOT NULL,
  `quantity` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`customer_order`) REFERENCES `customer_order`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`product`) REFERENCES `tshirt`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




CREATE TABLE `payment` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_order_id` INT UNSIGNED NOT NULL,
  `payment_method_id` INT UNSIGNED,
  `amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('PENDING','COMPLETED','FAILED','REFUNDED') DEFAULT 'PENDING',
  `transaction_id` VARCHAR(255) COMMENT 'External payment processor ID',
  `payment_date` DATETIME,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`customer_order_id`) REFERENCES `customer_order`(`id`),
  FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`id`),
  INDEX `idx_customer_order_id` (`customer_order_id`),
  INDEX `idx_transaction_id` (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE reset_tokens (
    user_id INT UNSIGNED NOT NULL,
    token VARCHAR(128) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `user` (`username`, `email`, `phone`, `address`, `role`) VALUES
('admin_user', 'admin@tshirtstore.com', '+34123456789', 'Calle Principal 123, Madrid', 'OPERATOR'),
('john_doe', 'john.doe@email.com', '+34666111222', 'Avenida Central 45, Barcelona', 'CLIENT'),
('sarah_connor', 'sarah.c@email.com', '+34777333444', 'Plaza Mayor 67, Valencia', 'CLIENT'),
('mike_tyson', 'mike.t@email.com', '+34888555666', 'Calle Secundaria 89, Sevilla', 'CLIENT');

INSERT INTO `password` (`user_id`, `password_hash`) VALUES
(1, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), 
(2, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), 
(3, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), 
(4, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); 

INSERT INTO `tshirt` (`size`, `gender`, `color`, `brand`, `stock`, `price`, `active`, `image`) VALUES
('m', 'man', 'Negro', 'Nike', 50, 25.99, TRUE, 'https://shoppinginibiza.com/142715-large_default/nike-camiseta-negra-sportwear-hombre.jpg'),
('l', 'woman', 'Blanco', 'Adidas', 30, 22.50, TRUE, 'https://fivesneakershop.com/uploads/photo/image/6407/A03038_52DVr3qc.JPG'),
('xl', 'unisex', 'Azul', 'Puma', 25, 19.99, TRUE, 'https://static.futbolfactory.es/products/246693_1.jpg'),
('s', 'man', 'Rojo', 'Under Armour', 40, 28.75, TRUE, 'https://img01.ztat.net/article/spp-media-p1/a36e7af84788318e89094601d15d975d/f80c742847a04fc18df714e5036019c3.jpg?imwidth=762&filter=packshot'),
('m', 'woman', 'Verde', 'New Balance', 35, 21.99, TRUE, 'https://mobile.yoox.com/images/items/10/10382895XS_14_f.jpg'),
('l', 'unisex', 'Gris', 'Champion', 20, 17.50, TRUE, 'https://mobile.yoox.com/images/items/10/10196466RA_14_f.jpg?impolicy=crop&width=387&height=490'),
('xl', 'man', 'Negro', 'Nike', 15, 26.99, TRUE, 'https://shoppinginibiza.com/169741-medium_default/nike-camiseta-negra-dv9750-010-hombre.jpg'),
('m', 'woman', 'Rosa', 'Adidas', 45, 23.25, TRUE, 'https://fuckingwod.com/wp-content/uploads/2024/05/IC1218.UNICA_.1.jpg'),
('s', 'unisex_kids', 'Amarillo', 'Puma', 60, 15.99, TRUE, 'https://galeasport.es/4835-large_default/puma-camiseta-logo-yellow.jpg'),
('l', 'boy', 'Azul Marino', 'Nike', 25, 18.50, TRUE, 'https://img01.ztat.net/article/spp-media-p1/43d1e34cc8b646c38c3f66db77f32573/709c4d18784f4527809b9a81c1338bcc.jpg?imwidth=762&filter=packshot');


INSERT INTO `payment_method` (`user_id`, `card_type`, `last_four`, `expiry_month`, `expiry_year`, `is_default`) VALUES
(2, 'VISA', '1234', 12, 2025, TRUE),
(2, 'MASTERCARD', '5678', 6, 2024, FALSE),
(3, 'VISA', '9012', 3, 2026, TRUE),
(4, 'AMEX', '3456', 9, 2025, TRUE);

INSERT INTO `customer_order` (`client`, `status`, `total`) VALUES
(2, 'paid', 48.49),
(2, 'shipped', 67.24),
(3, 'processing', 35.99),
(4, 'cart', 0.00);

INSERT INTO `customer_order_line` (`customer_order`, `product`, `sale_price`, `quantity`) VALUES
(1, 1, 25.99, 1),
(1, 3, 22.50, 1),
(2, 2, 22.50, 3),
(2, 4, 28.75, 2),
(2, 6, 15.99, 1),
(3, 5, 21.99, 2),
(3, 7, 14.00, 5);


INSERT INTO `payment` (`customer_order_id`, `payment_method_id`, `amount`, `status`, `transaction_id`, `payment_date`) VALUES
(1, 1, 48.49, 'COMPLETED', 'txn_123456789', '2024-01-15 10:30:00'),
(2, 1, 67.24, 'COMPLETED', 'txn_987654321', '2024-01-16 14:45:00'),
(3, 3, 35.99, 'PENDING', NULL, NULL);

UPDATE customer_order 
SET total = (
  SELECT SUM(sale_price * quantity)
  FROM customer_order_line
  WHERE customer_order.id = customer_order_line.customer_order
)
WHERE id IN (1, 2, 3);
