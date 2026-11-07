param(
    [Parameter(Mandatory = $true)]
    [string]$File,
    [string]$ContainerName = "my-crypto-funds-mysql"
)

if (-not (Test-Path $File)) {
    throw "File not found: $File"
}

$rootPassword = if ($env:MYSQL_ROOT_PASSWORD) { $env:MYSQL_ROOT_PASSWORD } else { "change-me" }

Write-Host "Restoring database from: $File"
Write-Host "Container: $ContainerName"

Get-Content -Path $File -Raw | docker exec -i $ContainerName mysql --user=root --password=$rootPassword

Write-Host "Database restored successfully."
