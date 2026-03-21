<?php
header('Content-Type: text/plain');
ini_set('max_execution_time', 300); // 5 minutes max
$base = realpath(__DIR__ . '/../../../'); // Go up to /home/uXXXXX/
echo "Searching everywhere using pure PHP in: $base\n";

function search($dir) {
    $files = @scandir($dir);
    if (!$files) return;
    foreach ($files as $f) {
        if ($f === '.' || $f === '..') continue;
        if ($f === 'node_modules') continue;
        if (strpos($f, '.') === 0) continue; // Skip hidden dirs
        $path = $dir . '/' . $f;
        if ($f === '1.png') echo "FOUND: " . $path . "\n";
        if (is_dir($path)) search($path);
    }
}
search($base);
echo "\nPure PHP Scan complete.";
?>
