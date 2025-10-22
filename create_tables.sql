USE raspberrypay_db;

DROP TABLE IF EXISTS Transactions;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    card_number VARCHAR(16) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (card_number),
    CONSTRAINT chk_balance_positive CHECK (balance >= 0)
);

CREATE TABLE Transactions (
    transaction_id INT NOT NULL AUTO_INCREMENT,
    card_number_fk VARCHAR(16) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (transaction_id),
    CONSTRAINT fk_card_number_transactions
        FOREIGN KEY (card_number_fk)
        REFERENCES Users(card_number)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);