-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 17. Jun 2024 um 16:41
-- Server-Version: 10.4.28-MariaDB
-- PHP-Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `basaronline`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `coupon`
--

CREATE TABLE `coupon` (
  `code` varchar(320) NOT NULL,
  `value` int(11) NOT NULL,
  `expiry_date` varchar(320) NOT NULL,
  `redeemed` varchar(320) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `coupon`
--

INSERT INTO `coupon` (`code`, `value`, `expiry_date`, `redeemed`) VALUES
('AGJV0', 15, '2024-06-19', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `product`
--

CREATE TABLE `product` (
  `id` int(50) NOT NULL,
  `name` varchar(240) NOT NULL,
  `price` float(32,0) NOT NULL,
  `description` varchar(240) NOT NULL,
  `url` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  `rating` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `product`
--

INSERT INTO `product` (`id`, `name`, `price`, `description`, `url`, `category`, `rating`) VALUES
(1, 'Smartphone Samsung Galaxy S', 500, 'Powerful smartphone with quad-camera and large display.', 'https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg', 'Unterhaltungselektronik', 2),
(2, 'Laptop Lenovo X', 899, 'High-performance laptop with Intel Core i7 processor and NVIDIA graphics card.', 'https://cdn.pixabay.com/photo/2021/11/05/11/08/laptop-6771039_1280.jpg', 'Unterhaltungselektronik', 5),
(3, 'Smartwatch XY', 200, 'Stylish smartwatch with heart rate monitor and waterproof case.', 'https://cdn.pixabay.com/photo/2020/02/10/09/18/calendar-4835848_1280.jpg', 'Unterhaltungselektronik', 4),
(4, 'Bluetooth Speaker GHI', 80, 'Compact Bluetooth speaker with powerful sound and long battery life.', 'https://cdn.pixabay.com/photo/2016/11/14/04/42/techland-1822630_1280.jpg', 'Unterhaltungselektronik', 3),
(5, 'Sony PlayStation', 400, 'High-performance gaming console for demanding gamers with HDR support.', 'https://cdn.pixabay.com/photo/2017/04/04/18/14/video-game-console-2202634_1280.jpg', 'Unterhaltungselektronik', 5),
(6, 'Bunter Regenschirm', 30, 'Compact Bluetooth speaker with powerful sound and long battery life.', '', 'Sonstiges', 1),
(9, 'iPhone 17 Pro', 1200, 'asdfassd', 'https://i0.wp.com/appleworld.today/wp-content/uploads/2024/02/iPhone-17.jpg?fit=1200%2C900&ssl=1', 'Unterhaltungselektronik', 5);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `anrede` varchar(10) NOT NULL,
  `vorname` varchar(40) NOT NULL,
  `nachname` varchar(40) NOT NULL,
  `adresse` varchar(60) NOT NULL,
  `plz` int(40) NOT NULL,
  `ort` varchar(60) NOT NULL,
  `email` text NOT NULL,
  `username` text NOT NULL,
  `passwort` varchar(250) NOT NULL,
  `zahlungsinformation` varchar(250) NOT NULL,
  `rolle` varchar(20) NOT NULL,
  `id` int(250) NOT NULL,
  `active` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`anrede`, `vorname`, `nachname`, `adresse`, `plz`, `ort`, `email`, `username`, `passwort`, `zahlungsinformation`, `rolle`, `id`, `active`) VALUES
('Herr', 'asd', 'asfa', 'asdasda', 1452, 'asd', 'asdf@gmail.com', 'asdfq', '$2y$10$Yp8loVwtMOUlEfOgtWclDui48kiIPyWX/j9zZ2Okz./Vc0hEDAbMG', 'PayPal', 'user', 1, 1),
('a', 'b', 'c', 'd', 192, 'e', 'einstein@gmail.com', 'ef', '$2y$10$DbzdTD65aZ1P4Q14COMuVO4.cG6nrdCSFT40JE/TeWh7z5.Qi//hy', 'asd', 'user', 2, 0),
('as', 'bf', 'c', 'd', 192, 'e', 'einstein1@gmail.com', 'efe', '$2y$10$mc/eSYv2hoZzUtvP6dxUSeuhFVUPAN94bFDcjgA2cwgxrf13jBoxG', 'asd', 'user', 3, 1),
('Herr', 'Volkan', 'Altindas', 'Engerthstraße 148/1/5', 1020, 'Wien', 'volkan.altindas22@gmail.com', 'wi22b059', '$2y$10$Wgm9kIUQyMOxheQZ23Cdi.c6tSOJW519aOXm1Ds5a96lmys7QhXiO', 'Paypal', 'admin', 4, 1),
('Frau', 'Milorad', 'Bozic', 'Schlossmühlstraße', 2541, 'NÖ', 'milobozic@hotmail.com', 'mbzc', '$2y$10$E0ZuC69MsXsvOcbYgmpRcutTwVmlsOF15aKVfsE.DcTamnLVhsiQG', '', 'user', 5, 1),
('Herr', 'Milorad', 'Bozic', 'Annen 124', 1234, 'WErt', 'mbzc12345@goran.at', 'mbzc12345', '$2y$10$mqwSWj9.JI8EGPoVKbgCuemn2iN0voYnRjrO/Z/u.aXIWPapI1QGG', 'PayPal', 'admin', 7, 1),
('Herr', 'Tana', 'Köze', 'Bananenstraße 5', 3169, 'Samsung', 'banana5@sikis.at', 'messi10', '$2y$10$qMpCoAu0DX5u5ZMvgov9TOkKi8r/Bkoq3pitlVFulWxqg1DABzlUO', '', 'user', 8, 0);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`) USING HASH,
  ADD UNIQUE KEY `username` (`username`) USING HASH;

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `product`
--
ALTER TABLE `product`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `id` int(250) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
