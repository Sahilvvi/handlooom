<?php
header('Content-Type: text/plain');
ini_set('max_execution_time', 300);

echo "Bypassing Hostinger Security Locks...\n";

function search($dir) {
    $files = @scandir($dir);
    if (!$files) return;
    foreach ($files as $f) {
        if ($f === '.' || $f === '..') continue;
        if ($f === 'node_modules') continue;
        if (strpos($f, '.') === 0) continue; // Skip hidden dirs like .git
        $path = $dir . '/' . $f;
        if ($f === '1.png') echo "FOUND: " . $path . "\n";
        if (is_dir($path)) search($path);
    }
}

$dirsToSearch = [ __DIR__, realpath(__DIR__ . '/../') ];

foreach ($dirsToSearch as $b) {
    if ($b) {
        echo "Searching: $b\n";
        search($b);
    }
}

echo "\nPure PHP Scan complete.";
?>
