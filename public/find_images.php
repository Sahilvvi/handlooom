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

$dirsToSearch = [ 
    realpath(__DIR__ . '/../../violet-narwhal-474691.hostingersite.com/'), 
    realpath(__DIR__ . '/../../rosybrown-koala-703473.hostingersite.com/') 
];

foreach ($dirsToSearch as $b) {
    if ($b) {
        echo "Searching Sibling Domain: $b\n";
        search($b);
    }
}

echo "\nPure PHP Scan complete.";
?>
