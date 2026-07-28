
# Handiboost.fr FTP Deployment Script
$ftpServer = "ftp://92.113.28.82"
$ftpUser = "u753676535"
$ftpPass = "IiV^b+Hk@zoC+b1P"
$remotePath = "/domains/handiboost.fr/public_html"
$localPath = Join-Path $PSScriptRoot "out"

$credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)

function Ensure-FtpDirectory($dirPath) {
    try {
        $req = [System.Net.FtpWebRequest]::Create("$ftpServer$dirPath/")
        $req.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $req.Credentials = $credentials
        $req.KeepAlive = $false
        $resp = $req.GetResponse()
        $resp.Close()
    } catch {
        # Directory likely already exists
    }
}

function Upload-File($localFile, $remoteFile) {
    try {
        $req = [System.Net.FtpWebRequest]::Create("$ftpServer$remoteFile")
        $req.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $req.Credentials = $credentials
        $req.UseBinary = $true
        $req.KeepAlive = $false
        $req.UsePassive = $true

        $fileContent = [System.IO.File]::ReadAllBytes($localFile)
        $req.ContentLength = $fileContent.Length
        $reqStream = $req.GetRequestStream()
        $reqStream.Write($fileContent, 0, $fileContent.Length)
        $reqStream.Close()
        $resp = $req.GetResponse()
        $resp.Close()
        return $true
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# First, clean existing content in public_html
Write-Host "=== Handiboost.fr FTP Deployment ===" -ForegroundColor Cyan
Write-Host "Target: $ftpServer$remotePath" -ForegroundColor Gray
Write-Host ""

# Collect all directories and files
$allItems = Get-ChildItem -Path $localPath -Recurse
$dirs = $allItems | Where-Object { $_.PSIsContainer } | Sort-Object { $_.FullName.Length }
$files = $allItems | Where-Object { -not $_.PSIsContainer }

Write-Host "Creating $($dirs.Count) directories..." -ForegroundColor Yellow
foreach ($dir in $dirs) {
    $relativePath = $dir.FullName.Substring($localPath.Length).Replace("\", "/")
    $ftpDir = "$remotePath$relativePath"
    Ensure-FtpDirectory $ftpDir
}

Write-Host "Uploading $($files.Count) files..." -ForegroundColor Yellow
$uploaded = 0
$failed = 0
$total = $files.Count

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($localPath.Length).Replace("\", "/")
    $ftpFile = "$remotePath$relativePath"
    
    $pct = [math]::Round(($uploaded + $failed) / $total * 100)
    Write-Host "`r  [$pct%] $relativePath" -NoNewline
    
    if (Upload-File $file.FullName $ftpFile) {
        $uploaded++
    } else {
        $failed++
    }
}

Write-Host ""
Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Green
Write-Host "  Uploaded: $uploaded files" -ForegroundColor Green
Write-Host "  Failed:   $failed files" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host "  Site:     https://handiboost.fr" -ForegroundColor Cyan
