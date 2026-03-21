<?php
header('Content-Type: text/plain');
ini_set('max_execution_time', 300);

echo "Broadest Directory Scan Started...\n";

function search($dir) {
    if (strpos($dir, 'node_modules') !== false) return; // Skip entirely
    $files = @scandir($dir);
    if (!$files) return;
    foreach ($files as $f) {
        if ($f === '.' || $f === '..') continue;
        if (strpos($f, '.') === 0) continue;
        $path = $dir . '/' . $f;
        
        // Find ANY png image anywhere matching the pattern except the logo
        if (strpos(strtolower($f), '.png') !== false && $f !== 'logo.png') {
            echo "\n-> CRITICAL FOUND IMAGE PATH:\n" . $path . "\n";
            exit; // Stop entirely to capture just one true path format
        }
        
        if (is_dir($path)) search($path);
    }
}

$start = realpath(__DIR__ . '/..'); // /home/uXXXXX/domains/jannathandloom.com
echo "Starting physical scan from: " . $start . "\n";
search($start);
echo "\nNo arbitrary PNGs found recursively.";
?>
