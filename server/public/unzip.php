<?php
header('Content-Type: text/html');
ini_set('max_execution_time', 600); // 10 minutes max for large payload
echo "<h3>Forceful Backend Extraction Initializing...</h3>";

$zipFile = __DIR__ . '/uploads_ready_for_website.zip';

if (!file_exists($zipFile)) {
    echo "<p style='color:red;'>ERROR: Could not find 'uploads_ready_for_website.zip' inside public_html. Please double check that you uploaded it directly next to this script!</p>";
    exit;
}

$zip = new ZipArchive;
$res = $zip->open($zipFile);
if ($res === TRUE) {
    echo "<p>Found ZIP. Unpacking 340MB payload right now natively... (Please wait tightly, this might take 60+ seconds)</p>";
    flush(); 
    
    // Extracting into same public_html directory. It should create uploads/... natively
    $zip->extractTo(__DIR__);
    $zip->close();
    
    echo "<h2 style='color:green;'>✅ MASSIVE SUCCESS! All images are physically unlocked on the server!</h2>";
    echo "<p>You may now refresh your website! The server is perfectly fixed!</p>";
} else {
    echo "<p style='color:red;'>ERROR: Corrupted or invalid ZIP file. Could not natively open.</p>";
}
?>
