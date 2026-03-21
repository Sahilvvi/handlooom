<?php
header('Content-Type: text/plain');
ini_set('max_execution_time', 300);

echo "Deep Dive Scan Started...\n";

$count = 0;
function search($dir) {
    global $count;
    if ($count > 10) return;
    if (strpos($dir, 'node_modules') !== false) return; 
    $files = @scandir($dir);
    if (!$files) return;
    foreach ($files as $f) {
        if ($f === '.' || $f === '..') continue;
        if (strpos($f, '.') === 0) continue;
        $path = $dir . '/' . $f;
        
        if (strpos(strtolower($f), '.png') !== false && strpos($path, 'public/banner') === false && strpos($path, 'logo.png') === false) {
            echo "FOUND: " . $path . "\n";
            $count++;
        }
        
        if (is_dir($path)) search($path);
    }
}

$start = realpath(__DIR__ . '/..'); 
echo "Starting scan from: " . $start . "\n";
search($start);
echo "\nScan complete.";
?>
