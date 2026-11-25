# ====================================================
# Lightweight Local Static HTTP Server for Portfolio
# ====================================================

param(
    [int]$Port = 8000
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Error "Failed to start listener on $($prefix): $_"
    exit 1
}

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " Portfolio Server is LIVE at: $prefix" -ForegroundColor Green
Write-Host " Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host "====================================================" -ForegroundColor Cyan

$root = $PSScriptRoot
if (-not $root) {
    $root = (Get-Location).Path
}

$mimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".htm"   = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".svg"   = "image/svg+xml"
    ".gif"   = "image/gif"
    ".ico"   = "image/x-icon"
    ".webp"  = "image/webp"
    ".pdf"   = "application/pdf"
    ".woff"  = "font/woff"
    ".woff2" = "font/woff2"
    ".ttf"   = "font/ttf"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = $request.Url.LocalPath
        if ($rawPath -eq "/" -or [string]::IsNullOrWhiteSpace($rawPath)) {
            $rawPath = "/index.html"
        }

        # URL Decode and convert slashes for Windows
        $decoded = [System.Uri]::UnescapeDataString($rawPath).TrimStart('/')
        $decoded = $decoded.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $filePath = [System.IO.Path]::Combine($root, $decoded)

        if ([System.IO.File]::Exists($filePath)) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

            $response.ContentType = $mime
            $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
            $response.StatusCode = 200

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errMessage = "404 Not Found: $rawPath"
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes($errMessage)
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }

        $response.Close()
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
