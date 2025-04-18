-- Movies Table
CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT, -- duration in minutes
    rating VARCHAR(10),
    showtimes JSON -- store showtimes as JSON array
);

-- Ensure you are connected to your 'movie_booking_db' database

-- Insert 15 Tamil Movies
INSERT INTO movies (title, description, duration, rating) VALUES
('Kaithi 2', 'A sequel to the action-packed thriller where Dilli faces a new threat.', 155, 8.8),
('Master Returns', 'JD takes on a new challenge in a different city, fighting corruption in the education system.', 170, 8.2),
('Valimai Thodargirathu', 'ACP Arjun Kumar is back, tackling a high-tech criminal network.', 165, 7.5),
('Vikram Vedha Reimagined', 'A fresh take on the classic tale of a cop and a gangster, exploring moral ambiguities.', 150, 9.0),
('Soorarai Pottru: The Next Chapter', 'Maara continues his journey, expanding his low-cost airline against new obstacles.', 160, 8.9),
('Asuran Legacy', 'The story continues, focusing on the next generation facing caste oppression.', 148, 8.5),
('Doctor Strange in Chennai', 'A neurosurgeon turned sorcerer discovers mystical threats lurking in Chennai.', 145, 7.9),
('KGF: Chapter 3 - Tamil Version', 'Rocky Bhai expands his empire, facing international foes.', 180, 9.1),
('Mankatha Reloaded', 'A stylish heist thriller with unexpected twists and turns.', 152, 8.0),
('Thuppakki Mission 2', 'Captain Jagadish Dhanapal on a new mission to thwart a terror plot.', 168, 8.3),
('Vada Chennai: Anbuvin Ezhuchi', 'Anbu rises through the ranks in the gritty world of North Chennai politics and crime.', 175, 8.7),
('Pariyerum Perumal Continues', 'Pariyan faces new challenges as he pursues higher education and fights for equality.', 158, 8.6),
('96 - The Reunion', 'Ram and Jaanu meet again years later, exploring what could have been.', 140, 8.4),
('Ratsasan: The Hunt Begins', 'A new serial killer emerges, and Arun Kumar must race against time.', 162, 8.8),
('Jailer 2: Tiger Ka Hukum', 'Muthuvel Pandian faces a formidable old rival seeking revenge.', 172, 8.1);

-- You can verify the insertions
-- SELECT * FROM movies ORDER BY id DESC LIMIT 15;


-- Bookings Table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    showtime VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- Booking Seats Table
CREATE TABLE booking_seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);