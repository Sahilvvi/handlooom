<?php
header('Content-Type: text/plain');
echo "Searching for '1.png' starting from: " . __DIR__ . "\n\n";

function search_folder($dir, $filename, $depth = 0) {
    if ($depth > 5) return;
    $files = @scandir($dir);
    if (!$files) return;
    
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $path = $dir . DIRECTORY_SEPARATOR . $file;
        
        if ($file === $filename) {
            echo "FOUND: " . $path . "\n";
        }
        
        if (is_dir($path)) {
            search_folder($path, $filename, $depth + 1);
        }
    }
}

// Search from 2 levels up if possible to catch server/ folder too
$start = realpath(__DIR__ . '/..');
if (!$start) $start = __DIR__;

search_folder($start, '1.png');
echo "\nSearch complete.\n";
?>
