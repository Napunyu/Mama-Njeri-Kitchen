CREATE DATABASE IF NOT EXISTS mama_njeri_kitchen
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mama_njeri_kitchen;

CREATE TABLE IF NOT EXISTS reservations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  reservation_date DATE NOT NULL,
  guests INT UNSIGNED NOT NULL,
  preferred_meal VARCHAR(100) DEFAULT NULL,
  special_requests TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;