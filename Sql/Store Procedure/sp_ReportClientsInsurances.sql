CREATE OR ALTER PROCEDURE dbo.sp_ReportClientsInsurances
    @Identification NVARCHAR(20) = NULL,
    @InsuranceCode  NVARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF (@Identification IS NULL AND @InsuranceCode IS NULL)
    BEGIN
        SELECT TOP 0
            CAST(NULL AS INT)            AS ClientId,
            CAST(NULL AS NVARCHAR(20))   AS Identification,
            CAST(NULL AS NVARCHAR(200))  AS FullName,
            CAST(NULL AS NVARCHAR(20))   AS InsuranceCode,
            CAST(NULL AS NVARCHAR(100))  AS InsuranceName,
            CAST(NULL AS DECIMAL(20,8))  AS InsuredAmount,
            CAST(NULL AS DECIMAL(20,8))  AS Price;
        RETURN;
    END

    SELECT
        c.Id              AS ClientId,
        c.Identification  AS Identification,
        c.FullName        AS FullName,
        i.Code            AS InsuranceCode,
        i.Name            AS InsuranceName,
        i.InsuredAmount   AS InsuredAmount,
        i.Price           AS Price
    FROM Clients c
    INNER JOIN ClientInsurances ci
        ON ci.ClientId = c.Id AND ci.Status = 1
    INNER JOIN Insurances i
        ON i.Id = ci.InsuranceId AND i.Status = 1
    WHERE c.IsDeleted = 0
      AND (@Identification IS NULL OR c.Identification = @Identification)
      AND (@InsuranceCode  IS NULL OR i.Code = @InsuranceCode)
    ORDER BY c.FullName, i.Code;
END
