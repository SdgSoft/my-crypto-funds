param(
    [string]$DatabaseName = "my-crypto-funds",
    [string]$ContainerName = "my-crypto-funds-mysql",
    [string]$OutputDir = (Join-Path $PSScriptRoot "../backups")
)

$timestamp = Get-Date -Format "yyyyMMdd"
$backupFileName = "${timestamp}_backup_${DatabaseName}.sql"
$backupPath = Join-Path $OutputDir $backupFileName
$rootPassword = if ($env:MYSQL_ROOT_PASSWORD) { $env:MYSQL_ROOT_PASSWORD } else { "change-me" }

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

Write-Host "Creating backup for database: $DatabaseName"
Write-Host "Container: $ContainerName"
Write-Host "Output: $backupPath"

docker exec $ContainerName sh -lc "mysqldump --single-transaction --routines --events --user=root --password='$rootPassword' --databases '$DatabaseName'" | Set-Content -Path $backupPath -Encoding UTF8

Write-Host "Backup created: $backupPath"
