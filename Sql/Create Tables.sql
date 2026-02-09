use InsuranceConsulting

CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Status BIT NOT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    UserCreated INT NOT NULL,
    ModifiedDate DATETIME NULL,
    UserModified INT NULL
);

CREATE TABLE Insurances (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(20) NOT NULL ,
    Name NVARCHAR(100) NOT NULL,
    InsuredAmount DECIMAL(20,8) NOT NULL,
    Price DECIMAL(20,8) NOT NULL,

    Status BIT NOT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    UserCreated INT NOT NULL,
    ModifiedDate DATETIME NULL,
    UserModified INT NULL
);

CREATE TABLE Clients (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Identification NVARCHAR(20) NOT NULL ,

    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    FullName NVARCHAR(200) NOT NULL,

    Phone NVARCHAR(20),
    Age INT NOT NULL,
    Email NVARCHAR(200),
    Status BIT NOT NULL,
    IsDeleted BIT NOT NULL,

    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    UserCreated INT NOT NULL,
    ModifiedDate DATETIME NULL,
    UserModified INT NULL
);

CREATE TABLE ClientInsurances (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ClientId INT NOT NULL,
    InsuranceId INT NOT NULL,

    Status BIT NOT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    UserCreated INT NOT NULL,
    ModifiedDate DATETIME NULL,
    UserModified INT NULL,

    CONSTRAINT FK_ClientInsurances_Client
        FOREIGN KEY (ClientId) REFERENCES Clients(Id),
    CONSTRAINT FK_ClientInsurances_Insurance
        FOREIGN KEY (InsuranceId) REFERENCES Insurances(Id),
);
