Write-Host "Setting up .env.local for My Crochet Kit" -ForegroundColor Cyan
Write-Host "Please enter the values from your Firebase Console."
Write-Host "Leave blank and press Enter to keep empty."

$apiKey = Read-Host "API Key (apiKey)"
$authDomain = Read-Host "Auth Domain (authDomain)"
$projectId = Read-Host "Project ID (projectId)"
$storageBucket = Read-Host "Storage Bucket (storageBucket)"
$messagingSenderId = Read-Host "Messaging Sender ID (messagingSenderId)"
$appId = Read-Host "App ID (appId)"
$measurementId = Read-Host "Measurement ID (measurementId)"

$content = @"
VITE_FIREBASE_API_KEY=$apiKey
VITE_FIREBASE_AUTH_DOMAIN=$authDomain
VITE_FIREBASE_PROJECT_ID=$projectId
VITE_FIREBASE_STORAGE_BUCKET=$storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
VITE_FIREBASE_APP_ID=$appId
VITE_FIREBASE_MEASUREMENT_ID=$measurementId
"@

$targetPath = Join-Path (Get-Location) ".env.local"
$content | Out-File -FilePath $targetPath -Encoding utf8
Write-Host ".env.local created successfully at $targetPath" -ForegroundColor Green
