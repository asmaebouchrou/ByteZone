
CREATE DATABASE `bytezone`;

USE `bytezone`;

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

CREATE TABLE `product` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category` ENUM('ram','ssd','processor','graphics_card','motherboard','power_supply','case','cooling','monitor','keyboard','mouse','headset','accessory') NOT NULL,
  `specs` VARCHAR(120) NOT NULL,
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
  FOREIGN KEY (`product`) REFERENCES `product`(`id`)
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
('admin_user', 'admin@bytezone.com', '+34123456789', 'Calle Principal 123, Madrid', 'OPERATOR'),
('john_doe', 'john.doe@email.com', '+34666111222', 'Avenida Central 45, Barcelona', 'CLIENT'),
('sarah_connor', 'sarah.c@email.com', '+34777333444', 'Plaza Mayor 67, Valencia', 'CLIENT'),
('mike_tyson', 'mike.t@email.com', '+34888555666', 'Calle Secundaria 89, Sevilla', 'CLIENT'),
('admin', 'admin@admin.com', NULL, NULL, 'OPERATOR'),
('user', 'user@user.com', NULL, NULL, 'CLIENT');

INSERT INTO `password` (`user_id`, `password_hash`) VALUES
(1, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), 
(2, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), 
(3, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), 
(4, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(5, '$2a$10$6bBu7A28YxZ6ASl6xZLJhOYvztNhAwS3roTQ6Qwpaw5z3dVMwM8T6'),
(6, '$2a$10$s98BKOtlwGMfjMEUNPWBROwdB8rdhse8sxqh3LLNLlJkbJbF6S1pa'); 

INSERT INTO `product` (`category`, `specs`, `brand`, `stock`, `price`, `active`, `image`) VALUES
('ram', '32GB DDR5 6000MHz CL36', 'Corsair Vengeance', 50, 129.99, TRUE, 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=900&q=80'),
('ssd', '2TB NVMe PCIe 4.0 M.2', 'Samsung 990 EVO', 30, 149.90, TRUE, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=80'),
('processor', 'AMD Ryzen 7 7800X3D', 'AMD', 18, 389.99, TRUE, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=80'),
('graphics_card', 'GeForce RTX 4070 Super 12GB', 'MSI', 12, 689.99, TRUE, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80'),
('motherboard', 'ATX B650 WiFi AM5', 'ASUS TUF Gaming', 22, 219.99, TRUE, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'),
('power_supply', '850W 80 Plus Gold Modular', 'Seasonic Focus', 35, 139.50, TRUE, 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=900&q=80'),
('case', 'ATX airflow tempered glass', 'NZXT H5 Flow', 20, 109.99, TRUE, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80'),
('cooling', 'AIO 240mm ARGB', 'Cooler Master', 28, 94.99, TRUE, 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=900&q=80'),
('monitor', '27 pulgadas IPS 1440p 165Hz', 'LG UltraGear', 18, 299.99, TRUE, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80'),
('keyboard', 'Mecanico TKL switches red', 'Logitech G Pro', 45, 119.00, TRUE, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80'),
('mouse', 'Inalambrico 26K DPI', 'Razer DeathAdder V3', 40, 79.99, TRUE, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80'),
('headset', 'Auriculares gaming 7.1 USB', 'HyperX Cloud II', 33, 79.99, TRUE, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'),
('accessory', 'Hub USB-C 7 en 1 HDMI 4K', 'Anker PowerExpand', 42, 49.99, TRUE, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80'),
('ram', '16GB DDR4 3200MHz CL16', 'Kingston Fury Beast', 70, 44.99, TRUE, 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=80'),
('ssd', '500GB SATA 2.5 pulgadas', 'Crucial MX500', 80, 39.99, TRUE, 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=900&q=80'),
('processor', 'Intel Core i5-14600K', 'Intel', 24, 309.99, TRUE, 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=900&q=80'),
('graphics_card', 'Radeon RX 7800 XT 16GB', 'Sapphire Pulse', 14, 549.99, TRUE, 'https://images.unsplash.com/photo-1658673847785-08f1738116f8?auto=format&fit=crop&w=900&q=80'),
('keyboard', 'Mecanico 75% hot-swap brown', 'Keychron K2 Pro', 32, 109.99, TRUE, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80');


INSERT INTO `payment_method` (`user_id`, `card_type`, `last_four`, `expiry_month`, `expiry_year`, `is_default`) VALUES
(2, 'VISA', '1234', 12, 2025, TRUE),
(2, 'MASTERCARD', '5678', 6, 2024, FALSE),
(3, 'VISA', '9012', 3, 2026, TRUE),
(4, 'AMEX', '3456', 9, 2025, TRUE);

INSERT INTO `customer_order` (`client`, `status`, `total`) VALUES
(2, 'paid', 519.98),
(2, 'shipped', 979.39),
(3, 'processing', 329.98),
(4, 'cart', 0.00);

INSERT INTO `customer_order_line` (`customer_order`, `product`, `sale_price`, `quantity`) VALUES
(1, 1, 129.99, 1),
(1, 3, 389.99, 1),
(2, 2, 149.90, 1),
(2, 4, 689.99, 1),
(2, 6, 139.50, 1),
(3, 5, 219.99, 1),
(3, 7, 109.99, 1);


INSERT INTO `payment` (`customer_order_id`, `payment_method_id`, `amount`, `status`, `transaction_id`, `payment_date`) VALUES
(1, 1, 519.98, 'COMPLETED', 'txn_123456789', '2024-01-15 10:30:00'),
(2, 1, 979.39, 'COMPLETED', 'txn_987654321', '2024-01-16 14:45:00'),
(3, 3, 329.98, 'PENDING', NULL, NULL);

UPDATE customer_order 
SET total = (
  SELECT SUM(sale_price * quantity)
  FROM customer_order_line
  WHERE customer_order.id = customer_order_line.customer_order
)
WHERE id IN (1, 2, 3);
